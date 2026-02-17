import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, SHORTCUTS } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any remaining event listeners
    window.removeEventListener('keydown', vi.fn() as any);
  });

  it('should call callback when matching shortcut is pressed', () => {
    const callback = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback, description: 'Undo' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true }));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should differentiate shift modifier', () => {
    const undo = vi.fn();
    const redo = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback: undo, description: 'Undo' },
      { key: 'z', metaKey: true, shiftKey: true, callback: redo, description: 'Redo' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    // Cmd+Z should trigger undo
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).not.toHaveBeenCalled();

    vi.clearAllMocks();

    // Cmd+Shift+Z should trigger redo
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
      shiftKey: true,
    }));
    expect(redo).toHaveBeenCalledTimes(1);
    expect(undo).not.toHaveBeenCalled();
  });

  it('should call preventDefault on matched shortcuts', () => {
    const callback = vi.fn();
    const shortcuts = [
      { key: 's', metaKey: true, callback, description: 'Save' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    const event = new KeyboardEvent('keydown', { key: 's', metaKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when enabled is false', () => {
    const callback = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback, description: 'Undo' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, false));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle ctrlKey as metaKey alternative', () => {
    const callback = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback, description: 'Undo' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    // On Windows/Linux, Ctrl key should work
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const callback = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback, description: 'Undo' },
    ];

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts, true));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should handle case-insensitive key matching', () => {
    const callback = vi.fn();
    const shortcuts = [
      { key: 'd', metaKey: true, callback, description: 'Duplicate' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    // Both lowercase and uppercase should work
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'D', metaKey: true }));
    expect(callback).toHaveBeenCalledTimes(1);

    vi.clearAllMocks();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', metaKey: true }));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only trigger first matching shortcut', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback: callback1, description: 'First' },
      { key: 'z', metaKey: true, callback: callback2, description: 'Second' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true }));

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
  });

  it('should not trigger callback when modifier keys do not match', () => {
    const callback = vi.fn();
    const shortcuts = [
      { key: 'z', metaKey: true, callback, description: 'Undo' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    // Press 'z' without metaKey
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle arrow keys with modifiers', () => {
    const prevCallback = vi.fn();
    const nextCallback = vi.fn();
    const shortcuts = [
      { key: 'ArrowLeft', metaKey: true, callback: prevCallback, description: 'Previous' },
      { key: 'ArrowRight', metaKey: true, callback: nextCallback, description: 'Next' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts, true));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', metaKey: true }));
    expect(prevCallback).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', metaKey: true }));
    expect(nextCallback).toHaveBeenCalledTimes(1);
  });
});

describe('SHORTCUTS constant', () => {
  it('should have correct predefined shortcuts', () => {
    expect(SHORTCUTS.UNDO).toEqual({
      key: 'z',
      metaKey: true,
      description: 'Undo (⌘+Z)',
    });

    expect(SHORTCUTS.REDO).toEqual({
      key: 'z',
      metaKey: true,
      shiftKey: true,
      description: 'Redo (⌘+⇧+Z)',
    });

    expect(SHORTCUTS.DELETE_SLIDE).toEqual({
      key: 'Backspace',
      metaKey: true,
      description: 'Delete Slide (⌘+⌫)',
    });
  });

  it('should have all expected shortcuts defined', () => {
    const expectedKeys = [
      'INSPECTOR',
      'DELETE_SLIDE',
      'DUPLICATE',
      'PREV_SLIDE',
      'NEXT_SLIDE',
      'UNDO',
      'REDO',
    ];

    expectedKeys.forEach((key) => {
      expect(SHORTCUTS).toHaveProperty(key);
      expect((SHORTCUTS as any)[key]).toHaveProperty('key');
      expect((SHORTCUTS as any)[key]).toHaveProperty('description');
    });
  });
});
