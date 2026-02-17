import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExportPresentation } from './useExportPresentation';
import { captureSlides } from './capture';
import type { SlideWithProps } from '@/lib/types/slides';
import type { ExportOptions } from './types';

// captureSlides는 정적 import이므로 vi.mock 사용
vi.mock('./capture', () => ({
  captureSlides: vi.fn(),
}));

// 각 Exporter mock (동적 import이지만 Vitest가 hoisting 처리)
vi.mock('../exporters/SimplePPTExporter', () => ({
  SimplePPTExporter: vi.fn(),
}));

vi.mock('../exporters/PdfExporter', () => ({
  PdfExporter: vi.fn(),
}));

vi.mock('../exporters/ImageExporter', () => ({
  ImageExporter: vi.fn(),
}));

describe('useExportPresentation', () => {
  const mockSlides: SlideWithProps[] = [
    { id: 'slide-1', type: 'TitleSlide', name: 'Slide 1', props: { title: '', subtitle: '', author: '', date: '' } },
    { id: 'slide-2', type: 'ContentSlide', name: 'Slide 2', props: { title: '', content: '', align: 'left' } },
  ];

  const defaultOptions: ExportOptions = {
    format: 'ppt',
    quality: 'medium',
  };

  const mockCapturedSlides = [
    { id: 'slide-1', title: 'Slide 1', imageData: 'data:image/png;base64,test', width: 1920, height: 1080 },
    { id: 'slide-2', title: 'Slide 2', imageData: 'data:image/png;base64,test', width: 1920, height: 1080 },
  ];

  const makeMockExporter = (overrides?: Partial<{ success: boolean; errorMessage: string }>) => {
    const success = overrides?.success ?? true;
    const result = success
      ? { success: true, stats: { totalSlides: 2, capturedSlides: 2, failedSlides: 0, duration: 100 } }
      : {
          success: false,
          error: overrides?.errorMessage
            ? { type: 'generation_failed' as const, message: overrides.errorMessage, timestamp: Date.now() }
            : undefined,
        };
    return { export: vi.fn().mockResolvedValue(result) };
  };

  beforeEach(async () => {
    // mockReset: true로 인해 모든 mock이 초기화되므로 각 테스트마다 재설정
    vi.mocked(captureSlides).mockResolvedValue(mockCapturedSlides);

    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    vi.mocked(SimplePPTExporter).mockImplementation(() => makeMockExporter());

    const { PdfExporter } = await import('../exporters/PdfExporter');
    vi.mocked(PdfExporter).mockImplementation(() => makeMockExporter());

    const { ImageExporter } = await import('../exporters/ImageExporter');
    vi.mocked(ImageExporter).mockImplementation(() => makeMockExporter());
  });

  // 1. slidesCount - slides.length 반환 확인
  it('slidesCount는 slides.length를 반환한다', () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));
    expect(result.current.slidesCount).toBe(2);
  });

  it('빈 배열일 때 slidesCount는 0을 반환한다', () => {
    const { result } = renderHook(() => useExportPresentation([]));
    expect(result.current.slidesCount).toBe(0);
  });

  // 2. registerSlideRef - ref 등록 후 captureSlides 호출 시 올바른 ref 전달
  it('registerSlideRef로 등록한 ref가 captureSlides에 전달된다', async () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    const mockRef1 = { current: document.createElement('div') };
    const mockRef2 = { current: document.createElement('div') };

    act(() => {
      result.current.registerSlideRef('slide-1', mockRef1 as any);
      result.current.registerSlideRef('slide-2', mockRef2 as any);
    });

    await act(async () => {
      await result.current.executeExport(defaultOptions);
    });

    expect(captureSlides).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'slide-1', ref: mockRef1 }),
        expect.objectContaining({ id: 'slide-2', ref: mockRef2 }),
      ]),
      'medium',
      expect.any(Function)
    );
  });

  // 3. selectedSlides 필터링 - selectedSlides: ['slide-1'] 시 1개만 처리
  it('selectedSlides 지정 시 해당 슬라이드만 처리한다', async () => {
    vi.mocked(captureSlides).mockResolvedValue([mockCapturedSlides[0]]);

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({
        ...defaultOptions,
        selectedSlides: ['slide-1'],
      });
    });

    const callArgs = vi.mocked(captureSlides).mock.calls[0][0];
    expect(callArgs).toHaveLength(1);
    expect(callArgs[0].id).toBe('slide-1');
  });

  // 4. 빈 selectedSlides - 전체 슬라이드 처리
  it('selectedSlides가 빈 배열이면 전체 슬라이드를 처리한다', async () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({
        ...defaultOptions,
        selectedSlides: [],
      });
    });

    const callArgs = vi.mocked(captureSlides).mock.calls[0][0];
    expect(callArgs).toHaveLength(2);
  });

  // 5. 슬라이드 없음 에러 - 빈 slides 배열 시 throw
  it('slides가 빈 배열이면 에러를 throw한다', async () => {
    const { result } = renderHook(() => useExportPresentation([]));

    await expect(
      act(async () => {
        await result.current.executeExport(defaultOptions);
      })
    ).rejects.toThrow('내보낼 슬라이드가 없습니다.');
  });

  // 6. selectedSlides로 필터 후 0개 - 존재하지 않는 id 선택 시 throw
  it('selectedSlides에 존재하지 않는 id만 있으면 에러를 throw한다', async () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await expect(
      act(async () => {
        await result.current.executeExport({
          ...defaultOptions,
          selectedSlides: ['non-existent-id'],
        });
      })
    ).rejects.toThrow('내보낼 슬라이드가 없습니다.');
  });

  // 7. 캡처 실패 에러 - captureSlides가 빈 배열 반환 시 throw
  it('captureSlides가 빈 배열을 반환하면 에러를 throw한다', async () => {
    vi.mocked(captureSlides).mockResolvedValue([]);

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await expect(
      act(async () => {
        await result.current.executeExport(defaultOptions);
      })
    ).rejects.toThrow('슬라이드 캡처에 실패했습니다.');
  });

  // 8. ppt format - SimplePPTExporter 사용 확인
  it('format이 ppt이면 SimplePPTExporter를 사용한다', async () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({ ...defaultOptions, format: 'ppt' });
    });

    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    expect(SimplePPTExporter).toHaveBeenCalled();
  });

  // keynote도 SimplePPTExporter 사용 확인
  it('format이 keynote이면 SimplePPTExporter를 사용한다', async () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({ ...defaultOptions, format: 'keynote' });
    });

    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    expect(SimplePPTExporter).toHaveBeenCalled();
  });

  // 9. pdf format - PdfExporter 사용 확인
  it('format이 pdf이면 PdfExporter를 사용한다', async () => {
    vi.mocked(captureSlides).mockResolvedValue([mockCapturedSlides[0]]);

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({ ...defaultOptions, format: 'pdf' });
    });

    const { PdfExporter } = await import('../exporters/PdfExporter');
    expect(PdfExporter).toHaveBeenCalled();
  });

  // 10. jpeg format - ImageExporter 사용 확인
  it('format이 jpeg이면 ImageExporter를 사용한다', async () => {
    vi.mocked(captureSlides).mockResolvedValue([mockCapturedSlides[0]]);

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({ ...defaultOptions, format: 'jpeg' });
    });

    const { ImageExporter } = await import('../exporters/ImageExporter');
    expect(ImageExporter).toHaveBeenCalled();
  });

  it('format이 png이면 ImageExporter를 사용한다', async () => {
    vi.mocked(captureSlides).mockResolvedValue([mockCapturedSlides[0]]);

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport({ ...defaultOptions, format: 'png' });
    });

    const { ImageExporter } = await import('../exporters/ImageExporter');
    expect(ImageExporter).toHaveBeenCalled();
  });

  // 11. onProgress 호출 - 캡처 시작, 생성 시작, 완료 순서 확인
  it('onProgress가 캡처 시작 → 생성 시작 → 완료 순서로 호출된다', async () => {
    const onProgress = vi.fn();
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await act(async () => {
      await result.current.executeExport(defaultOptions, onProgress);
    });

    expect(onProgress).toHaveBeenCalled();

    const calls = onProgress.mock.calls.map((c) => c[0]);

    // 첫 번째 호출: capturing 상태
    expect(calls[0]).toMatchObject({ status: 'capturing' });

    // 마지막 호출: completed 상태, percentage: 100
    const lastCall = calls[calls.length - 1];
    expect(lastCall).toMatchObject({ status: 'completed', percentage: 100 });

    // generating 상태가 중간에 호출되어야 함
    const hasGenerating = calls.some((c: any) => c.status === 'generating');
    expect(hasGenerating).toBe(true);
  });

  // 12. exporter 실패 - result.success: false 시 throw
  it('exporter가 success: false를 반환하면 에러를 throw한다', async () => {
    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    vi.mocked(SimplePPTExporter).mockImplementationOnce(() => makeMockExporter({ success: false, errorMessage: '파일 생성 실패' }));

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await expect(
      act(async () => {
        await result.current.executeExport(defaultOptions);
      })
    ).rejects.toThrow('파일 생성 실패');
  });

  it('exporter가 success: false이고 error 메시지가 없으면 기본 에러 메시지를 throw한다', async () => {
    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    vi.mocked(SimplePPTExporter).mockImplementationOnce(() => ({
      export: vi.fn().mockResolvedValue({ success: false }),
    }));

    const { result } = renderHook(() => useExportPresentation(mockSlides));

    await expect(
      act(async () => {
        await result.current.executeExport(defaultOptions);
      })
    ).rejects.toThrow('내보내기 실패');
  });

  // 13. 기본 aspectRatio - 1920x1080 기본값 확인
  it('aspectRatio를 지정하지 않으면 기본값 1920x1080이 사용된다', async () => {
    const { result } = renderHook(() => useExportPresentation(mockSlides));

    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    const mockExport = vi.fn().mockResolvedValue({
      success: true,
      stats: { totalSlides: 2, capturedSlides: 2, failedSlides: 0, duration: 100 },
    });
    vi.mocked(SimplePPTExporter).mockImplementationOnce(() => ({ export: mockExport }));

    await act(async () => {
      await result.current.executeExport(defaultOptions);
    });

    expect(mockExport).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        aspectRatio: { width: 1920, height: 1080 },
      }),
      expect.any(Function)
    );
  });

  it('aspectRatio를 직접 지정하면 해당 값이 사용된다', async () => {
    const customAspectRatio = { width: 1280, height: 720 };
    const { result } = renderHook(() =>
      useExportPresentation(mockSlides, customAspectRatio)
    );

    const { SimplePPTExporter } = await import('../exporters/SimplePPTExporter');
    const mockExport = vi.fn().mockResolvedValue({
      success: true,
      stats: { totalSlides: 2, capturedSlides: 2, failedSlides: 0, duration: 100 },
    });
    vi.mocked(SimplePPTExporter).mockImplementationOnce(() => ({ export: mockExport }));

    await act(async () => {
      await result.current.executeExport(defaultOptions);
    });

    expect(mockExport).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        aspectRatio: customAspectRatio,
      }),
      expect.any(Function)
    );
  });
});
