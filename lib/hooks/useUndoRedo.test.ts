import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from './useUndoRedo';

describe('useUndoRedo', () => {
  // 1. 초기 상태
  it('initialState가 current state로 반환된다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('객체 타입의 initialState도 올바르게 반환된다', () => {
    const initial = { name: 'test', value: 42 };
    const { result } = renderHook(() => useUndoRedo(initial));
    expect(result.current.state).toEqual(initial);
  });

  // 2. set - 상태 추가
  it('set으로 새 상태를 추가하면 current가 업데이트된다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('set 후 redo 히스토리가 제거된다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.undo()); // index: 1 → 0, canRedo: true
    act(() => result.current.set(99)); // redo 제거
    expect(result.current.state).toBe(99);
    expect(result.current.canRedo).toBe(false);
  });

  it('연속 set으로 히스토리가 누적된다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3));
    expect(result.current.state).toBe(3);
    expect(result.current.canUndo).toBe(true);
  });

  // 3. undo
  it('undo가 이전 상태로 돌아간다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });

  it('초기 상태에서 undo는 아무 효과 없다', () => {
    const { result } = renderHook(() => useUndoRedo('hello'));
    act(() => result.current.undo());
    expect(result.current.state).toBe('hello');
    expect(result.current.canUndo).toBe(false);
  });

  it('canUndo가 false일 때 undo를 호출해도 상태가 변하지 않는다', () => {
    const { result } = renderHook(() => useUndoRedo(42));
    act(() => result.current.undo()); // canUndo false
    expect(result.current.state).toBe(42);
  });

  it('undo를 여러 번 호출하면 더 이전 상태로 돌아간다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3));
    act(() => result.current.undo());
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
  });

  // 4. redo
  it('redo가 다음 상태로 이동한다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.state).toBe(1);
    expect(result.current.canRedo).toBe(false);
  });

  it('마지막 상태에서 redo는 아무 효과 없다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.redo()); // canRedo false
    expect(result.current.state).toBe(1);
  });

  it('canRedo가 false일 때 redo를 호출해도 상태가 변하지 않는다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.redo()); // no redo history
    expect(result.current.state).toBe(0);
  });

  it('undo 후 redo로 원래 상태로 돌아온다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.undo());
    act(() => result.current.undo());
    act(() => result.current.redo());
    act(() => result.current.redo());
    expect(result.current.state).toBe(2);
    expect(result.current.canRedo).toBe(false);
  });

  // 5. reset
  it('reset이 히스토리를 단일 상태로 초기화한다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.reset(99));
    expect(result.current.state).toBe(99);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('reset 후 set으로 새 히스토리를 시작할 수 있다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.set(1));
    act(() => result.current.reset(10));
    act(() => result.current.set(20));
    expect(result.current.state).toBe(20);
    act(() => result.current.undo());
    expect(result.current.state).toBe(10);
  });

  // 6. maxHistorySize
  it('maxHistorySize 초과 시 가장 오래된 히스토리가 제거된다', () => {
    const { result } = renderHook(() => useUndoRedo(0, { maxHistorySize: 3 }));
    act(() => result.current.set(1));
    act(() => result.current.set(2));
    act(() => result.current.set(3)); // 초기 0이 제거됨
    expect(result.current.state).toBe(3);
    // undo 2번 후 상태는 1이어야 함 (0은 제거됨)
    act(() => result.current.undo());
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(false);
  });

  it('기본 maxHistorySize는 50이다', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    // 50번 set
    for (let i = 1; i <= 50; i++) {
      act(() => result.current.set(i));
    }
    expect(result.current.state).toBe(50);
    expect(result.current.canUndo).toBe(true);
  });
});
