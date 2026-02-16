import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';

describe('useHistory', () => {
  describe('SET action', () => {
    it('should add new state to history', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
      });

      expect(result.current.state).toBe(1);
      expect(result.current.history).toEqual([0, 1]);
      expect(result.current.currentIndex).toBe(1);
    });

    it('should remove redo history after current index when setting new state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.undo();
        result.current.set(3); // Should remove state "2"
      });

      expect(result.current.history).toEqual([0, 1, 3]);
      expect(result.current.currentIndex).toBe(2);
    });

    it('should limit history to maxHistorySize', () => {
      const { result } = renderHook(() =>
        useHistory<number>(0, { maxHistorySize: 3 })
      );

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.set(3); // Initial state (0) should be removed
      });

      expect(result.current.history).toEqual([1, 2, 3]);
      expect(result.current.currentIndex).toBe(2);
    });

    it('should support functional updates', () => {
      const { result } = renderHook(() => useHistory<number>(10));

      act(() => {
        result.current.set((prev) => prev + 5);
      });

      expect(result.current.state).toBe(15);
      expect(result.current.history).toEqual([10, 15]);
    });
  });

  describe('UNDO action', () => {
    it('should move to previous state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.undo();
      });

      expect(result.current.state).toBe(1);
      expect(result.current.currentIndex).toBe(1);
    });

    it('should not undo beyond initial state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.undo(); // Try to undo at initial state
      });

      expect(result.current.state).toBe(0);
      expect(result.current.currentIndex).toBe(0);
    });

    it('should undo multiple times', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.set(3);
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.state).toBe(1);
      expect(result.current.currentIndex).toBe(1);
    });
  });

  describe('REDO action', () => {
    it('should move to next state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.undo();
        result.current.redo();
      });

      expect(result.current.state).toBe(2);
      expect(result.current.currentIndex).toBe(2);
    });

    it('should not redo beyond last state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.redo(); // Try to redo at last state
      });

      expect(result.current.state).toBe(1);
      expect(result.current.currentIndex).toBe(1);
    });

    it('should redo multiple times', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.set(3);
        result.current.undo();
        result.current.undo();
        result.current.redo();
        result.current.redo();
      });

      expect(result.current.state).toBe(3);
      expect(result.current.currentIndex).toBe(3);
    });
  });

  describe('goToIndex', () => {
    it('should jump to specific index (forward)', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.set(3);
        result.current.undo();
        result.current.undo();
        result.current.goToIndex(3); // Jump from index 1 to 3
      });

      expect(result.current.state).toBe(3);
      expect(result.current.currentIndex).toBe(3);
    });

    it('should jump to specific index (backward)', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.set(3);
        result.current.goToIndex(1); // Jump from index 3 to 1
      });

      expect(result.current.state).toBe(1);
      expect(result.current.currentIndex).toBe(1);
    });

    it('should ignore out-of-bounds index', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.goToIndex(10); // Out of bounds
      });

      expect(result.current.currentIndex).toBe(1); // Should not change
    });

    it('should ignore negative index', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.goToIndex(-1); // Negative index
      });

      expect(result.current.currentIndex).toBe(1); // Should not change
    });
  });

  describe('canUndo and canRedo flags', () => {
    it('canUndo should be false at initial state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      expect(result.current.canUndo).toBe(false);
    });

    it('canUndo should be true after setting state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
      });

      expect(result.current.canUndo).toBe(true);
    });

    it('canRedo should be false at last state', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
      });

      expect(result.current.canRedo).toBe(false);
    });

    it('canRedo should be true after undo', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);
    });
  });

  describe('history array exposure', () => {
    it('should expose history array', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
      });

      expect(result.current.history).toEqual([0, 1, 2]);
    });

    it('should expose currentIndex', () => {
      const { result } = renderHook(() => useHistory<number>(0));

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.undo();
      });

      expect(result.current.currentIndex).toBe(1);
    });
  });

  describe('complex scenarios', () => {
    it('should handle alternating set/undo/redo', () => {
      const { result } = renderHook(() => useHistory<string>('a'));

      act(() => {
        result.current.set('b');
        result.current.undo();
        result.current.set('c');
        result.current.undo();
        result.current.redo();
      });

      expect(result.current.state).toBe('c');
      expect(result.current.history).toEqual(['a', 'c']);
    });

    it('should handle maxHistorySize with undo/redo', () => {
      const { result } = renderHook(() =>
        useHistory<number>(0, { maxHistorySize: 3 })
      );

      act(() => {
        result.current.set(1);
        result.current.set(2);
        result.current.set(3); // History: [1, 2, 3]
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.state).toBe(1);
      expect(result.current.history).toEqual([1, 2, 3]);
      expect(result.current.canUndo).toBe(false); // Can't undo further
    });
  });
});
