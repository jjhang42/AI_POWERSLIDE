import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { captureSlide, captureSlides, base64ToBlob } from './capture';
import type { SlideInfo, ExportQuality } from './types';

describe('capture', () => {
  let mockCanvas: any;
  let mockHtml2Canvas: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock canvas 객체 생성
    mockCanvas = {
      width: 1920,
      height: 1080,
      toDataURL: vi.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='),
    };

    // Mock html2canvas 함수
    mockHtml2Canvas = vi.fn().mockResolvedValue(mockCanvas);

    // 동적 import를 위한 doMock 사용
    await vi.doMock('html2canvas', () => ({
      default: mockHtml2Canvas,
    }));
  });

  afterEach(() => {
    vi.doUnmock('html2canvas');
  });

  describe('captureSlide', () => {
    it('should capture a slide with high quality', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      // Create aspect-ratio container
      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const slide: SlideInfo = {
        id: 'slide-1',
        index: 0,
        ref: mockRef as any,
        title: 'Test Slide',
      };

      const result = await captureSlide(slide, 'high');

      expect(result.id).toBe('slide-1');
      expect(result.title).toBe('Test Slide');
      expect(result.imageData).toMatch(/^data:image\/png;base64,/);
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    it('should use slide id as title if title is not provided', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const slide: SlideInfo = {
        id: 'slide-1',
        index: 0,
        ref: mockRef as any,
      };

      const result = await captureSlide(slide, 'medium');

      expect(result.title).toBe('slide-1');
    });

    it('should throw error if container is not found', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const slide: SlideInfo = {
        id: 'slide-1',
        index: 0,
        ref: mockRef as any,
      };

      await expect(captureSlide(slide, 'low')).rejects.toThrow(
        '슬라이드를 찾을 수 없습니다: slide-1'
      );
    });

    it('should throw error if ref.current is null', async () => {
      const mockRef = {
        current: null,
      };

      const slide: SlideInfo = {
        id: 'slide-1',
        index: 0,
        ref: mockRef as any,
      };

      await expect(captureSlide(slide, 'low')).rejects.toThrow(
        '슬라이드를 찾을 수 없습니다: slide-1'
      );
    });

    it('should scroll slide into view before capturing', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const scrollIntoViewMock = vi.fn();
      mockRef.current.scrollIntoView = scrollIntoViewMock;

      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const slide: SlideInfo = {
        id: 'slide-1',
        index: 0,
        ref: mockRef as any,
      };

      await captureSlide(slide, 'medium');

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      });
    });

    it('should apply correct scale based on quality', async () => {
      const mockRef = {
        current: document.createElement('div'),
      };

      const container = document.createElement('div');
      container.style.aspectRatio = '16/9';
      mockRef.current.appendChild(container);

      const slide: SlideInfo = {
        id: 'slide-1',
        index: 0,
        ref: mockRef as any,
      };

      // Test high quality (scale 3)
      await captureSlide(slide, 'high');
      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        container,
        expect.objectContaining({ scale: 3 })
      );

      vi.clearAllMocks();

      // Test medium quality (scale 2)
      await captureSlide(slide, 'medium');
      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        container,
        expect.objectContaining({ scale: 2 })
      );

      vi.clearAllMocks();

      // Test low quality (scale 1)
      await captureSlide(slide, 'low');
      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        container,
        expect.objectContaining({ scale: 1 })
      );
    });
  });

  describe('captureSlides', () => {
    it('should capture multiple slides sequentially', async () => {
      const slides: SlideInfo[] = [
        {
          id: 'slide-1',
          index: 0,
          ref: { current: createMockSlide() } as any,
          title: 'Slide 1',
        },
        {
          id: 'slide-2',
          index: 1,
          ref: { current: createMockSlide() } as any,
          title: 'Slide 2',
        },
      ];

      const results = await captureSlides(slides, 'medium');

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('slide-1');
      expect(results[1].id).toBe('slide-2');
    });

    it('should call onProgress callback', async () => {
      const slides: SlideInfo[] = [
        {
          id: 'slide-1',
          index: 0,
          ref: { current: createMockSlide() } as any,
        },
        {
          id: 'slide-2',
          index: 1,
          ref: { current: createMockSlide() } as any,
        },
      ];

      const onProgress = vi.fn();

      await captureSlides(slides, 'medium', onProgress);

      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenNthCalledWith(1, 1, 2);
      expect(onProgress).toHaveBeenNthCalledWith(2, 2, 2);
    });

    it('should continue capturing even if one slide fails', async () => {
      const slides: SlideInfo[] = [
        {
          id: 'slide-1',
          index: 0,
          ref: { current: createMockSlide() } as any,
        },
        {
          id: 'slide-2-invalid',
          index: 1,
          ref: { current: null } as any, // This will fail
        },
        {
          id: 'slide-3',
          index: 2,
          ref: { current: createMockSlide() } as any,
        },
      ];

      const results = await captureSlides(slides, 'medium');

      // Should capture 2 out of 3 slides
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('slide-1');
      expect(results[1].id).toBe('slide-3');
    });

    it('should return empty array if all slides fail', async () => {
      const slides: SlideInfo[] = [
        {
          id: 'slide-1',
          index: 0,
          ref: { current: null } as any,
        },
        {
          id: 'slide-2',
          index: 1,
          ref: { current: null } as any,
        },
      ];

      const results = await captureSlides(slides, 'medium');

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

// Helper function to create mock slide element
function createMockSlide(): HTMLDivElement {
  const div = document.createElement('div');
  const container = document.createElement('div');
  container.style.aspectRatio = '16/9';
  div.appendChild(container);
  return div;
}
