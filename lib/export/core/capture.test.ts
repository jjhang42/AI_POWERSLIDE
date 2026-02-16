import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureSection, captureSections, base64ToBlob } from './capture';
import type { SectionInfo, ExportQuality } from './types';
import '../../../tests/mocks/exports';

// Mock html2canvas
const mockCanvas = {
  width: 1920,
  height: 1080,
  toDataURL: vi.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='),
};

const mockHtml2Canvas = vi.fn().mockResolvedValue(mockCanvas);

vi.mock('html2canvas', () => ({
  default: mockHtml2Canvas,
}));

describe('capture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('captureSection', () => {
    it('should capture a section with high quality', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      // Create aspect-ratio container
      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const section: SectionInfo = {
        id: 'section-1',
        index: 0,
        ref: mockRef as any,
        title: 'Test Section',
      };

      const result = await captureSection(section, 'high');

      expect(result.id).toBe('section-1');
      expect(result.title).toBe('Test Section');
      expect(result.imageData).toMatch(/^data:image\/png;base64,/);
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    it('should use section id as title if title is not provided', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const section: SectionInfo = {
        id: 'section-1',
        index: 0,
        ref: mockRef as any,
      };

      const result = await captureSection(section, 'medium');

      expect(result.title).toBe('section-1');
    });

    it('should throw error if container is not found', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const section: SectionInfo = {
        id: 'section-1',
        index: 0,
        ref: mockRef as any,
      };

      await expect(captureSection(section, 'low')).rejects.toThrow(
        '섹션을 찾을 수 없습니다: section-1'
      );
    });

    it('should throw error if ref.current is null', async () => {
      const mockRef = {
        current: null,
      };

      const section: SectionInfo = {
        id: 'section-1',
        index: 0,
        ref: mockRef as any,
      };

      await expect(captureSection(section, 'low')).rejects.toThrow(
        '섹션을 찾을 수 없습니다: section-1'
      );
    });

    it('should scroll section into view before capturing', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const scrollIntoViewMock = vi.fn();
      mockRef.current.scrollIntoView = scrollIntoViewMock;

      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const section: SectionInfo = {
        id: 'section-1',
        index: 0,
        ref: mockRef as any,
      };

      await captureSection(section, 'medium');

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      });
    });

    it('should apply correct scale based on quality', async () => {
      const html2canvas = (await import('html2canvas')).default;

      const mockRef = {
        current: document.createElement('div'),
      };

      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const section: SectionInfo = {
        id: 'section-1',
        index: 0,
        ref: mockRef as any,
      };

      // Test high quality (scale 3)
      await captureSection(section, 'high');
      expect(html2canvas).toHaveBeenCalledWith(
        container,
        expect.objectContaining({ scale: 3 })
      );

      vi.clearAllMocks();

      // Test medium quality (scale 2)
      await captureSection(section, 'medium');
      expect(html2canvas).toHaveBeenCalledWith(
        container,
        expect.objectContaining({ scale: 2 })
      );

      vi.clearAllMocks();

      // Test low quality (scale 1)
      await captureSection(section, 'low');
      expect(html2canvas).toHaveBeenCalledWith(
        container,
        expect.objectContaining({ scale: 1 })
      );
    });
  });

  describe('captureSections', () => {
    it('should capture multiple sections sequentially', async () => {
      const sections: SectionInfo[] = [
        {
          id: 'section-1',
          index: 0,
          ref: { current: createMockSection() } as any,
          title: 'Section 1',
        },
        {
          id: 'section-2',
          index: 1,
          ref: { current: createMockSection() } as any,
          title: 'Section 2',
        },
      ];

      const results = await captureSections(sections, 'medium');

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('section-1');
      expect(results[1].id).toBe('section-2');
    });

    it('should call onProgress callback', async () => {
      const sections: SectionInfo[] = [
        {
          id: 'section-1',
          index: 0,
          ref: { current: createMockSection() } as any,
        },
        {
          id: 'section-2',
          index: 1,
          ref: { current: createMockSection() } as any,
        },
      ];

      const onProgress = vi.fn();

      await captureSections(sections, 'medium', onProgress);

      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenNthCalledWith(1, 1, 2);
      expect(onProgress).toHaveBeenNthCalledWith(2, 2, 2);
    });

    it('should continue capturing even if one section fails', async () => {
      const sections: SectionInfo[] = [
        {
          id: 'section-1',
          index: 0,
          ref: { current: createMockSection() } as any,
        },
        {
          id: 'section-2-invalid',
          index: 1,
          ref: { current: null } as any, // This will fail
        },
        {
          id: 'section-3',
          index: 2,
          ref: { current: createMockSection() } as any,
        },
      ];

      const results = await captureSections(sections, 'medium');

      // Should capture 2 out of 3 sections
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('section-1');
      expect(results[1].id).toBe('section-3');
    });

    it('should return empty array if all sections fail', async () => {
      const sections: SectionInfo[] = [
        {
          id: 'section-1',
          index: 0,
          ref: { current: null } as any,
        },
        {
          id: 'section-2',
          index: 1,
          ref: { current: null } as any,
        },
      ];

      const results = await captureSections(sections, 'medium');

      expect(results).toHaveLength(0);
    });
  });

  describe('base64ToBlob', () => {
    it('should convert base64 to Blob', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const blob = base64ToBlob(base64, 'image/png');

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should handle different mime types', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';

      const blob = base64ToBlob(base64, 'image/jpeg');

      expect(blob.type).toBe('image/jpeg');
    });

    it('should extract base64 data after comma', () => {
      const base64WithPrefix = 'data:image/png;base64,SGVsbG8gV29ybGQ=';
      const blob = base64ToBlob(base64WithPrefix, 'image/png');

      expect(blob.size).toBe(11); // "Hello World" = 11 bytes
    });
  });
});

// Helper function to create mock section element
function createMockSection(): HTMLDivElement {
  const div = document.createElement('div');
  const container = document.createElement('div');
  container.style.aspectRatio = '16/9';
  div.appendChild(container);
  return div;
}
