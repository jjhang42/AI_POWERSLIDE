import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlides } from './useSlides';

describe('useSlides', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllTimers();
  });

  describe('localStorage loading', () => {
    it('should load slides from localStorage on mount', () => {
      const savedSlides = [
        {
          id: 'slide-1',
          type: 'TitleSlide' as const,
          name: 'Test Slide',
          props: { title: 'Test Title' },
        },
      ];
      localStorage.setItem('presentation-slides', JSON.stringify(savedSlides));

      const { result } = renderHook(() => useSlides());

      expect(result.current.slides).toHaveLength(1);
      expect(result.current.slides[0].name).toBe('Test Slide');
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('presentation-slides', 'invalid json {]');

      const { result } = renderHook(() => useSlides());

      expect(result.current.slides).toHaveLength(0);
    });

    it('should handle empty localStorage', () => {
      const { result } = renderHook(() => useSlides());

      expect(result.current.slides).toHaveLength(0);
    });

    it('should not load if localStorage is empty array', () => {
      localStorage.setItem('presentation-slides', '[]');

      const { result } = renderHook(() => useSlides());

      expect(result.current.slides).toHaveLength(0);
    });
  });

  describe('debounced save', () => {
    it('should save to localStorage after 300ms debounce', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      expect(localStorage.getItem('presentation-slides')).toBeNull();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const saved = localStorage.getItem('presentation-slides');
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(1);

      vi.useRealTimers();
    });

    it('should set isSaving to true during save', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      expect(result.current.isSaving).toBe(true);
    });

    it('should set isSaving to false after save completes', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isSaving).toBe(false);
      vi.useRealTimers();
    });

    it('should debounce multiple rapid changes', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 3');
      });

      // Should not save yet
      expect(localStorage.getItem('presentation-slides')).toBeNull();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const saved = localStorage.getItem('presentation-slides');
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(3); // All 3 slides saved at once

      vi.useRealTimers();
    });
  });

  describe('addSlide', () => {
    it('should add a new slide', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'My Title Slide');
      });

      expect(result.current.slides).toHaveLength(1);
      expect(result.current.slides[0].name).toBe('My Title Slide');
      expect(result.current.slides[0].type).toBe('TitleSlide');
    });

    it('should generate unique IDs', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      const ids = result.current.slides.map((s) => s.id);
      expect(ids[0]).not.toBe(ids[1]);
      expect(ids[0]).toMatch(/^slide-/);
      expect(ids[1]).toMatch(/^slide-/);
    });

    it('should use default props from registry', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      const props = result.current.slides[0].props;
      expect(props).toHaveProperty('title');
      expect(props).toHaveProperty('subtitle');
      expect(props).toHaveProperty('author');
    });

    it('should return the index before adding', () => {
      const { result } = renderHook(() => useSlides());

      let firstIndex: number;
      act(() => {
        firstIndex = result.current.addSlide('TitleSlide', 'Slide 1');
      });

      expect(firstIndex!).toBe(0); // slides.length was 0 before adding

      let secondIndex: number;
      act(() => {
        secondIndex = result.current.addSlide('TitleSlide', 'Slide 2');
      });

      expect(secondIndex!).toBe(1); // slides.length was 1 before adding
    });

    it('should set action description', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'My Slide');
      });

      expect(result.current.lastActionDescription).toBe('Added My Slide');
    });
  });

  describe('updateSlideProps', () => {
    it('should update slide props', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      act(() => {
        result.current.updateSlideProps(0, { title: 'Updated Title' });
      });

      expect(result.current.slides[0].props.title).toBe('Updated Title');
    });

    it('should merge partial props', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      act(() => {
        result.current.updateSlideProps(0, { title: 'New Title' });
      });

      const props = result.current.slides[0].props;
      expect(props.title).toBe('New Title');
      expect(props.subtitle).toBeDefined(); // Other props preserved
      expect(props.author).toBeDefined();
    });

    it('should set action description', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'My Slide');
      });

      act(() => {
        result.current.updateSlideProps(0, { title: 'New Title' });
      });

      expect(result.current.lastActionDescription).toBe('Updated My Slide');
    });
  });

  describe('deleteSlide', () => {
    it('should delete a slide', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      act(() => {
        result.current.deleteSlide(0);
      });

      expect(result.current.slides).toHaveLength(1);
      expect(result.current.slides[0].name).toBe('Slide 2');
    });

    it('should handle deleting last slide', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      act(() => {
        result.current.deleteSlide(0);
      });

      expect(result.current.slides).toHaveLength(0);
    });

    it('should set action description', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'My Slide');
      });

      act(() => {
        result.current.deleteSlide(0);
      });

      expect(result.current.lastActionDescription).toBe('Deleted My Slide');
    });
  });

  describe('reorderSlides', () => {
    it('should reorder slides', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 3');
      });

      act(() => {
        result.current.reorderSlides(0, 2); // Move first to last
      });

      expect(result.current.slides[0].name).toBe('Slide 2');
      expect(result.current.slides[1].name).toBe('Slide 3');
      expect(result.current.slides[2].name).toBe('Slide 1');
    });

    it('should set action description', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'My Slide');
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Other Slide');
      });

      act(() => {
        result.current.reorderSlides(0, 1);
      });

      expect(result.current.lastActionDescription).toBe('Reordered My Slide');
    });
  });

  describe('duplicateSlide', () => {
    it('should duplicate a slide', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Original');
      });

      act(() => {
        result.current.duplicateSlide(0);
      });

      expect(result.current.slides).toHaveLength(2);
      expect(result.current.slides[1].name).toBe('Original (Copy)');
    });

    it('should generate new ID for duplicate', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Original');
      });

      act(() => {
        result.current.duplicateSlide(0);
      });

      expect(result.current.slides[0].id).not.toBe(result.current.slides[1].id);
    });

    it('should copy all props', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Original');
      });

      act(() => {
        result.current.updateSlideProps(0, { title: 'Custom Title' });
      });

      act(() => {
        result.current.duplicateSlide(0);
      });

      expect(result.current.slides[1].props.title).toBe('Custom Title');
    });

    it('should return new slide index', () => {
      const { result } = renderHook(() => useSlides());

      let newIndex: number;
      act(() => {
        result.current.addSlide('TitleSlide', 'Original');
      });

      act(() => {
        newIndex = result.current.duplicateSlide(0);
      });

      expect(newIndex!).toBe(1);
    });

    it('should set action description', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'My Slide');
      });

      act(() => {
        result.current.duplicateSlide(0);
      });

      expect(result.current.lastActionDescription).toBe('Duplicated My Slide');
    });
  });

  describe('undo/redo integration', () => {
    it('should support undo', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.slides).toHaveLength(1);
      expect(result.current.slides[0].name).toBe('Slide 1');
    });

    it('should support redo', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      act(() => {
        result.current.undo();
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.slides).toHaveLength(2);
    });

    it('should expose canUndo/canRedo flags', () => {
      const { result } = renderHook(() => useSlides());

      expect(result.current.canUndo).toBe(false);

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
      });

      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);
    });

    it('should expose history states', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      expect(result.current.historyStates).toHaveLength(3); // [], [slide1], [slide1, slide2]
    });

    it('should expose current history index', () => {
      const { result } = renderHook(() => useSlides());

      act(() => {
        result.current.addSlide('TitleSlide', 'Slide 1');
        result.current.addSlide('TitleSlide', 'Slide 2');
      });

      expect(result.current.currentHistoryIndex).toBe(2);

      act(() => {
        result.current.undo();
      });

      expect(result.current.currentHistoryIndex).toBe(1);
    });
  });

  describe('lastSaved tracking', () => {
    it('should update lastSaved after save', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSlides());

      expect(result.current.lastSaved).toBeUndefined();

      act(() => {
        result.current.addSlide('TitleSlide', 'Test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.lastSaved).toBeInstanceOf(Date);
      vi.useRealTimers();
    });
  });
});
