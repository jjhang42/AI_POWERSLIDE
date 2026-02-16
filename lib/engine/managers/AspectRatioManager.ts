/**
 * AspectRatioManager
 * 화면 비율 관리
 */

import type { AspectRatioPreset, AspectRatioValue } from "../types";

// 프리셋 비율
const PRESET_RATIOS: Record<
  Exclude<AspectRatioPreset, "custom">,
  AspectRatioValue
> = {
  "16:9": { width: 16, height: 9 },
  "4:3": { width: 4, height: 3 },
};

export class AspectRatioManager {
  private preset: AspectRatioPreset;
  private customRatio: AspectRatioValue;
  private listeners: Set<() => void> = new Set();

  constructor(initialPreset: AspectRatioPreset = "16:9") {
    this.preset = initialPreset;
    // custom이 아닌 경우에만 PRESET_RATIOS에서 가져옴
    if (initialPreset !== "custom") {
      this.customRatio = PRESET_RATIOS[initialPreset];
    } else {
      this.customRatio = { width: 16, height: 9 };
    }
  }

  /**
   * 상태 변경 리스너 등록
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 모든 리스너에게 상태 변경 알림
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 프리셋 설정
   */
  public setPreset(preset: AspectRatioPreset): void {
    this.preset = preset;

    if (process.env.NODE_ENV === "development") {
      console.log(`[AspectRatioManager] Aspect ratio changed to: ${preset}`);
    }

    this.notify();
  }

  /**
   * 커스텀 비율 설정
   */
  public setCustom(ratio: AspectRatioValue): void {
    this.customRatio = ratio;
    this.preset = "custom";

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[AspectRatioManager] Custom ratio set to: ${ratio.width}:${ratio.height}`
      );
    }

    this.notify();
  }

  /**
   * 현재 비율 가져오기
   */
  public getCurrent(): AspectRatioValue {
    if (this.preset === "custom") {
      return this.customRatio;
    }
    return PRESET_RATIOS[this.preset];
  }

  /**
   * 현재 프리셋 가져오기
   */
  public getPreset(): AspectRatioPreset {
    return this.preset;
  }

  /**
   * 비율을 문자열로 가져오기
   */
  public getRatioString(): string {
    const ratio = this.getCurrent();
    return `${ratio.width}:${ratio.height}`;
  }

  /**
   * 커스텀 비율 가져오기
   */
  public getCustomRatio(): AspectRatioValue {
    return this.customRatio;
  }

  /**
   * 정리 (cleanup)
   */
  public destroy(): void {
    this.listeners.clear();
  }
}
