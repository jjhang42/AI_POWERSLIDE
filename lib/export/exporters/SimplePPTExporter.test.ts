import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SimplePPTExporter } from './SimplePPTExporter';
import type { CapturedSlide, ExportOptions } from '../core/types';

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

function createSlide(id: string, index: number): CapturedSlide {
  return {
    id,
    title: `Slide ${index}`,
    imageData: 'data:image/png;base64,SGVsbG8gV29ybGQ=',
    width: 1920,
    height: 1080,
  };
}

function createOptions(overrides: Partial<ExportOptions> = {}): ExportOptions {
  return {
    format: 'ppt',
    quality: 'high',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('SimplePPTExporter', () => {
  let mockZipInstance: {
    file: ReturnType<typeof vi.fn>;
    folder: ReturnType<typeof vi.fn>;
    generateAsync: ReturnType<typeof vi.fn>;
  };
  let mockJSZip: ReturnType<typeof vi.fn>;

  // Each folder mock returned by zip.folder() also has its own file/folder
  function buildFolderMock(): {
    file: ReturnType<typeof vi.fn>;
    folder: ReturnType<typeof vi.fn>;
  } {
    const inner: { file: ReturnType<typeof vi.fn>; folder: ReturnType<typeof vi.fn> } = {
      file: vi.fn(),
      folder: vi.fn(),
    };
    // Nested folders also need a file method
    inner.folder.mockReturnValue({ file: vi.fn(), folder: vi.fn().mockReturnValue({ file: vi.fn() }) });
    return inner;
  }

  beforeEach(async () => {
    // Build JSZip mock
    mockZipInstance = {
      file: vi.fn(),
      folder: vi.fn(),
      generateAsync: vi.fn().mockResolvedValue(
        new Blob(['zip content'], { type: 'application/zip' })
      ),
    };

    // Every call to zip.folder() returns a folder mock with its own file/folder
    mockZipInstance.folder.mockImplementation(() => buildFolderMock());

    mockJSZip = vi.fn().mockReturnValue(mockZipInstance);

    // Dynamic import mock – must use vi.doMock before import runs
    vi.doMock('jszip', () => ({ default: mockJSZip }));

    // DOM / URL mocks
    URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url');
    URL.revokeObjectURL = vi.fn();

    const mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as unknown as Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as unknown as Node);
  });

  afterEach(() => {
    vi.doUnmock('jszip');
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // 1. Export success – 2 slides
  // -------------------------------------------------------------------------
  it('should return success result when exporting 2 slides', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1), createSlide('s2', 2)];
    const options = createOptions();

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 2. Stats validation
  // -------------------------------------------------------------------------
  it('should include correct stats in the success result', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1), createSlide('s2', 2)];
    const options = createOptions();

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(true);
    expect(result.stats).toBeDefined();
    expect(result.stats!.totalSlides).toBe(2);
    expect(result.stats!.capturedSlides).toBe(2);
    expect(result.stats!.failedSlides).toBe(0);
    expect(typeof result.stats!.duration).toBe('number');
    expect(result.stats!.duration).toBeGreaterThanOrEqual(0);
  });

  // -------------------------------------------------------------------------
  // 3. onProgress callback is called
  // -------------------------------------------------------------------------
  it('should invoke onProgress callback during export', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1), createSlide('s2', 2)];
    const options = createOptions();
    const onProgress = vi.fn();

    await exporter.export(slides, options, onProgress);

    expect(onProgress).toHaveBeenCalled();
    // First call: current=0 (initial notification)
    const firstCall = onProgress.mock.calls[0][0];
    expect(firstCall).toMatchObject({ current: 0, total: 2 });
    // Last call: percentage=100 (completed)
    const lastCall = onProgress.mock.calls[onProgress.mock.calls.length - 1][0];
    expect(lastCall.percentage).toBe(100);
    expect(lastCall.status).toBe('completed');
  });

  // -------------------------------------------------------------------------
  // 4. JSZip methods are called (zip.file, zip.folder, zip.generateAsync)
  // -------------------------------------------------------------------------
  it('should call JSZip methods to build the PPTX structure', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions();

    await exporter.export(slides, options);

    // zip.file should be called at least once (for [Content_Types].xml)
    expect(mockZipInstance.file).toHaveBeenCalled();
    // zip.folder should be called at least once (e.g. _rels folder)
    expect(mockZipInstance.folder).toHaveBeenCalled();
    // zip.generateAsync should be called to produce the Blob
    expect(mockZipInstance.generateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'blob' })
    );
  });

  // -------------------------------------------------------------------------
  // 5. File download is triggered
  // -------------------------------------------------------------------------
  it('should trigger file download via URL.createObjectURL and a link click', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions();

    await exporter.export(slides, options);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    expect(document.body.removeChild).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  // -------------------------------------------------------------------------
  // 6. Custom fileName gets .pptx extension added if missing
  // -------------------------------------------------------------------------
  it('should append .pptx extension when fileName does not already have it', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions({ fileName: 'my-presentation' });

    // Capture the link that was created to inspect the download attribute
    let capturedLink: { download: string } | null = null;
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      capturedLink = { href: '', download: '', style: { display: '' }, click: vi.fn() } as unknown as { download: string };
      return capturedLink as unknown as HTMLElement;
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => capturedLink as unknown as Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => capturedLink as unknown as Node);

    await exporter.export(slides, options);

    expect(capturedLink).not.toBeNull();
    expect((capturedLink as unknown as HTMLAnchorElement).download).toBe('my-presentation.pptx');
  });

  // -------------------------------------------------------------------------
  // 7. Custom fileName that already has .pptx is not doubled
  // -------------------------------------------------------------------------
  it('should not duplicate .pptx extension when fileName already ends with .pptx', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions({ fileName: 'deck.pptx' });

    let capturedLink: { download: string } | null = null;
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      capturedLink = { href: '', download: '', style: { display: '' }, click: vi.fn() } as unknown as { download: string };
      return capturedLink as unknown as HTMLElement;
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => capturedLink as unknown as Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => capturedLink as unknown as Node);

    await exporter.export(slides, options);

    expect((capturedLink as unknown as HTMLAnchorElement).download).toBe('deck.pptx');
  });

  // -------------------------------------------------------------------------
  // 8. No fileName provided – date-based name is generated
  // -------------------------------------------------------------------------
  it('should generate a date-based filename when no fileName is provided', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions(); // no fileName

    let capturedLink: { download: string } | null = null;
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      capturedLink = { href: '', download: '', style: { display: '' }, click: vi.fn() } as unknown as { download: string };
      return capturedLink as unknown as HTMLElement;
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => capturedLink as unknown as Node);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => capturedLink as unknown as Node);

    await exporter.export(slides, options);

    expect((capturedLink as unknown as HTMLAnchorElement).download).toMatch(
      /^presentation-\d{4}-\d{2}-\d{2}\.pptx$/
    );
  });

  // -------------------------------------------------------------------------
  // 9. Empty slides array – succeeds with zero-slide stats
  // -------------------------------------------------------------------------
  it('should succeed and report zero slides when given an empty slides array', async () => {
    const exporter = new SimplePPTExporter();
    const options = createOptions();

    const result = await exporter.export([], options);

    expect(result.success).toBe(true);
    expect(result.stats!.totalSlides).toBe(0);
    expect(result.stats!.capturedSlides).toBe(0);
    expect(result.stats!.failedSlides).toBe(0);
  });

  // -------------------------------------------------------------------------
  // 10. JSZip generateAsync throws – failure result is returned
  // -------------------------------------------------------------------------
  it('should return a failure result when zip.generateAsync throws an error', async () => {
    mockZipInstance.generateAsync.mockRejectedValueOnce(new Error('ZIP generation failed'));

    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions();

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.type).toBe('generation_failed');
    expect(result.error!.message).toContain('ZIP generation failed');
  });

  // -------------------------------------------------------------------------
  // 11. JSZip constructor throws – failure result is returned
  // -------------------------------------------------------------------------
  it('should return a failure result when JSZip constructor throws', async () => {
    mockJSZip.mockImplementationOnce(() => {
      throw new Error('JSZip unavailable');
    });

    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions();

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.message).toContain('JSZip unavailable');
  });

  // -------------------------------------------------------------------------
  // 12. stats.fileSize reflects Blob size on success
  // -------------------------------------------------------------------------
  it('should include the Blob size in stats.fileSize on a successful export', async () => {
    const fakeBlob = new Blob(['a'.repeat(512)], { type: 'application/zip' });
    mockZipInstance.generateAsync.mockResolvedValueOnce(fakeBlob);

    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1)];
    const options = createOptions();

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(true);
    expect(result.stats!.fileSize).toBe(512);
  });

  // -------------------------------------------------------------------------
  // 13. onProgress percentage progresses from 0 to 100
  // -------------------------------------------------------------------------
  it('should report increasing percentage values across all onProgress calls', async () => {
    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1), createSlide('s2', 2), createSlide('s3', 3)];
    const options = createOptions();
    const percentages: number[] = [];

    await exporter.export(slides, options, (progress) => {
      percentages.push(progress.percentage);
    });

    // Must start at 0 and end at 100
    expect(percentages[0]).toBe(0);
    expect(percentages[percentages.length - 1]).toBe(100);

    // Must be non-decreasing
    for (let i = 1; i < percentages.length; i++) {
      expect(percentages[i]).toBeGreaterThanOrEqual(percentages[i - 1]);
    }
  });

  // -------------------------------------------------------------------------
  // 14. failure result includes failedSlides count equal to total
  // -------------------------------------------------------------------------
  it('should set failedSlides equal to totalSlides in the failure stats', async () => {
    mockZipInstance.generateAsync.mockRejectedValueOnce(new Error('oops'));

    const exporter = new SimplePPTExporter();
    const slides = [createSlide('s1', 1), createSlide('s2', 2)];
    const options = createOptions();

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(false);
    expect(result.stats).toBeDefined();
    expect(result.stats!.totalSlides).toBe(2);
    expect(result.stats!.failedSlides).toBe(2);
    expect(result.stats!.capturedSlides).toBe(0);
  });
});
