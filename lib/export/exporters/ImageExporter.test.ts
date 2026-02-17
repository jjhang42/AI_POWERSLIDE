import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CapturedSlide, ExportOptions } from '../core/types';

// ---------------------------------------------------------------------------
// file-saver를 최상단에서 vi.mock으로 hoisting (동적 import에도 적용됨)
// ---------------------------------------------------------------------------
const mockSaveAs = vi.fn();
vi.mock('file-saver', () => ({ saveAs: mockSaveAs }));

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

const VALID_PNG_BASE64 = 'data:image/png;base64,SGVsbG8gV29ybGQ=';
const VALID_JPEG_BASE64 = 'data:image/jpeg;base64,SGVsbG8gV29ybGQ=';

function createSlide(overrides: Partial<CapturedSlide> = {}): CapturedSlide {
  return {
    id: 'slide-1',
    title: 'Test Slide',
    imageData: VALID_PNG_BASE64,
    width: 1920,
    height: 1080,
    ...overrides,
  };
}

function createOptions(overrides: Partial<ExportOptions> = {}): ExportOptions {
  return {
    format: 'png',
    quality: 'high',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Canvas mock helper
// ---------------------------------------------------------------------------
function setupCanvasMock(jpegResult = 'data:image/jpeg;base64,fakeJpegData') {
  const mockCtx = {
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  };
  const mockCanvas = {
    width: 100,
    height: 80,
    getContext: vi.fn().mockReturnValue(mockCtx),
    toDataURL: vi.fn().mockReturnValue(jpegResult),
  };
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'canvas') return mockCanvas as unknown as HTMLElement;
    // 다른 태그는 실제 document.createElement 사용
    return document.createElement.call(document, tag);
  });
  return { mockCanvas, mockCtx };
}

// ---------------------------------------------------------------------------
// setTimeout을 줄여서 테스트 속도 향상
// ---------------------------------------------------------------------------
// ImageExporter 내부의 100ms 딜레이를 0ms로 줄이기 위해 실제 timer를 mock
function setupFastTimers() {
  const originalSetTimeout = globalThis.setTimeout;
  vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: TimerHandler, _delay?: number, ...args: unknown[]) => {
    // 100ms 딜레이를 0ms로 처리
    return originalSetTimeout(fn as (...args: unknown[]) => void, 0, ...args);
  });
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('ImageExporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupFastTimers();
    setupCanvasMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // 1. PNG export 성공 (2개 슬라이드)
  // -------------------------------------------------------------------------
  it('should return success result when exporting 2 PNG slides', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [
      createSlide({ id: 's1', title: 'Slide One' }),
      createSlide({ id: 's2', title: 'Slide Two' }),
    ];
    const options = createOptions({ format: 'png' });

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(true);
  }, 15000);

  // -------------------------------------------------------------------------
  // 2. saveAs가 각 슬라이드마다 호출되는지 확인
  // -------------------------------------------------------------------------
  it('should call saveAs once for each slide', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [
      createSlide({ id: 's1', title: 'First' }),
      createSlide({ id: 's2', title: 'Second' }),
      createSlide({ id: 's3', title: 'Third' }),
    ];
    const options = createOptions({ format: 'png' });

    await exporter.export(slides, options);

    expect(mockSaveAs).toHaveBeenCalledTimes(3);
  }, 15000);

  // -------------------------------------------------------------------------
  // 3. onProgress 콜백 호출 확인
  // -------------------------------------------------------------------------
  it('should invoke onProgress callback for each slide', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [
      createSlide({ id: 's1', title: 'Slide 1' }),
      createSlide({ id: 's2', title: 'Slide 2' }),
    ];
    const options = createOptions({ format: 'png' });
    const onProgress = vi.fn();

    await exporter.export(slides, options, onProgress);

    expect(onProgress).toHaveBeenCalled();
  }, 15000);

  // -------------------------------------------------------------------------
  // 4. success stats 검증 (totalSlides, capturedSlides, failedSlides=0)
  // -------------------------------------------------------------------------
  it('should include correct stats in the success result', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [
      createSlide({ id: 's1' }),
      createSlide({ id: 's2' }),
    ];
    const options = createOptions({ format: 'png' });

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(true);
    expect(result.stats).toBeDefined();
    expect(result.stats!.totalSlides).toBe(2);
    expect(result.stats!.capturedSlides).toBe(2);
    expect(result.stats!.failedSlides).toBe(0);
    expect(typeof result.stats!.duration).toBe('number');
  }, 15000);

  // -------------------------------------------------------------------------
  // 5. JPEG format 시 saveAs에 jpeg mimeType Blob이 전달되는지
  // -------------------------------------------------------------------------
  it('should call saveAs with jpeg mime type Blob when format is jpeg and imageData is already jpeg', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    // imageData가 이미 jpeg이면 변환 없이 base64ToBlob 호출
    const slides = [createSlide({ imageData: VALID_JPEG_BASE64 })];
    const options = createOptions({ format: 'jpeg' });

    await exporter.export(slides, options);

    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob] = mockSaveAs.mock.calls[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/jpeg');
  }, 15000);

  // -------------------------------------------------------------------------
  // 6. PNG format 시 saveAs에 png mimeType Blob이 전달되는지
  // -------------------------------------------------------------------------
  it('should call saveAs with png mime type Blob when format is png', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide()];
    const options = createOptions({ format: 'png' });

    await exporter.export(slides, options);

    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob] = mockSaveAs.mock.calls[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
  }, 15000);

  // -------------------------------------------------------------------------
  // 7. fileName이 없을 때 "slide-{safeName}.{ext}" 형식 사용
  // -------------------------------------------------------------------------
  it('should use "slide-{title}.{ext}" as filename when no custom fileName is given', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide({ title: 'My Slide' })];
    const options = createOptions({ format: 'png' }); // fileName 없음

    await exporter.export(slides, options);

    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [, fileName] = mockSaveAs.mock.calls[0];
    // baseName = "slide", safeName = "my-slide" (공백→하이픈, 소문자)
    expect(fileName).toBe('slide-my-slide.png');
  }, 15000);

  // -------------------------------------------------------------------------
  // 8. 커스텀 fileName 사용
  // -------------------------------------------------------------------------
  it('should use custom fileName as base when provided', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide({ title: 'Intro' })];
    const options = createOptions({ format: 'png', fileName: 'presentation' });

    await exporter.export(slides, options);

    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [, fileName] = mockSaveAs.mock.calls[0];
    expect(fileName).toBe('presentation-intro.png');
  }, 15000);

  // -------------------------------------------------------------------------
  // 9. 파일명에서 특수문자 제거 확인 (한글은 유지)
  // -------------------------------------------------------------------------
  it('should remove special characters from title but keep Korean characters', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide({ title: '제품 소개! (2024)' })];
    const options = createOptions({ format: 'png' });

    await exporter.export(slides, options);

    const [, fileName] = mockSaveAs.mock.calls[0];
    expect(fileName).toMatch(/^slide-/);
    expect(fileName).toContain('제품');
    expect(fileName).toContain('소개');
    expect(fileName).toMatch(/\.png$/);
    // 특수문자 없어야 함
    expect(fileName).not.toContain('!');
    expect(fileName).not.toContain('(');
    expect(fileName).not.toContain(')');
  }, 15000);

  // -------------------------------------------------------------------------
  // 10. saveAs 에러 시 success: false 반환
  // -------------------------------------------------------------------------
  it('should return success: false when saveAs throws an error', async () => {
    mockSaveAs.mockImplementation(() => {
      throw new Error('Disk full');
    });

    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide()];
    const options = createOptions({ format: 'png' });

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.type).toBe('generation_failed');
    expect(result.error!.message).toContain('Disk full');
  }, 15000);

  // -------------------------------------------------------------------------
  // 11. 빈 슬라이드 배열 처리
  // -------------------------------------------------------------------------
  it('should succeed with zero-slide stats when given an empty slides array', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const options = createOptions({ format: 'png' });

    const result = await exporter.export([], options);

    expect(result.success).toBe(true);
    expect(result.stats!.totalSlides).toBe(0);
    expect(result.stats!.capturedSlides).toBe(0);
    expect(result.stats!.failedSlides).toBe(0);
    expect(mockSaveAs).not.toHaveBeenCalled();
  }, 15000);

  // -------------------------------------------------------------------------
  // 12. onProgress 마지막 호출이 percentage=100, status="completed"인지
  // -------------------------------------------------------------------------
  it('should report percentage=100 and status="completed" in the last onProgress call', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide({ id: 's1' }), createSlide({ id: 's2' })];
    const options = createOptions({ format: 'png' });
    const progressCalls: Array<{ percentage: number; status: string }> = [];

    await exporter.export(slides, options, (p) => {
      progressCalls.push({ percentage: p.percentage, status: p.status });
    });

    expect(progressCalls.length).toBeGreaterThan(0);
    const last = progressCalls[progressCalls.length - 1];
    expect(last.percentage).toBe(100);
    expect(last.status).toBe('completed');
  }, 15000);

  // -------------------------------------------------------------------------
  // 13. JPEG 변환 - PNG imageData가 있고 format이 jpeg이면 canvas를 거침
  // -------------------------------------------------------------------------
  it('should convert PNG to JPEG via canvas when format is jpeg and imageData is PNG', async () => {
    // Image.onload를 즉시 트리거하도록 mock
    const originalImage = globalThis.Image;
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      width = 100;
      height = 80;
      private _src = '';

      set src(value: string) {
        this._src = value;
        if (this.onload) {
          Promise.resolve().then(() => this.onload!());
        }
      }
      get src() {
        return this._src;
      }
    }
    globalThis.Image = MockImage as unknown as typeof Image;

    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    // PNG base64를 가진 슬라이드 + jpeg format → convertToJPEG 경로
    const slides = [createSlide({ imageData: VALID_PNG_BASE64 })];
    const options = createOptions({ format: 'jpeg' });

    const result = await exporter.export(slides, options);

    // 변환 성공 후 saveAs 호출
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    const [blob] = mockSaveAs.mock.calls[0];
    // convertToJPEG 후 mimeType은 image/jpeg
    expect(blob.type).toBe('image/jpeg');
    expect(result.success).toBe(true);

    globalThis.Image = originalImage;
  }, 15000);

  // -------------------------------------------------------------------------
  // 14. 실패 시 stats.failedSlides가 totalSlides와 동일한지
  // -------------------------------------------------------------------------
  it('should set failedSlides equal to totalSlides in the failure stats', async () => {
    mockSaveAs.mockImplementation(() => {
      throw new Error('Network error');
    });

    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slides = [createSlide({ id: 's1' }), createSlide({ id: 's2' })];
    const options = createOptions({ format: 'png' });

    const result = await exporter.export(slides, options);

    expect(result.success).toBe(false);
    expect(result.stats!.totalSlides).toBe(2);
    expect(result.stats!.failedSlides).toBe(2);
    expect(result.stats!.capturedSlides).toBe(0);
  }, 15000);

  // -------------------------------------------------------------------------
  // 15. title이 없는 슬라이드는 인덱스를 파일명으로 사용
  // -------------------------------------------------------------------------
  it('should use slide index as filename part when title is undefined', async () => {
    const { ImageExporter } = await import('./ImageExporter');
    const exporter = new ImageExporter();
    const slide = {
      id: 's1',
      title: undefined as unknown as string,
      imageData: VALID_PNG_BASE64,
      width: 1920,
      height: 1080,
    };
    const options = createOptions({ format: 'png' });

    await exporter.export([slide], options);

    const [, fileName] = mockSaveAs.mock.calls[0];
    // title이 undefined이면 index(=1)를 사용
    expect(fileName).toBe('slide-1.png');
  }, 15000);
});
