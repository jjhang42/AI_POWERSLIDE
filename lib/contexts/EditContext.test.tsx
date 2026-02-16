import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EditProvider, useEdit } from './EditContext';
import { ReactNode } from 'react';

describe('EditContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <EditProvider>{children}</EditProvider>
  );

  describe('useEdit', () => {
    it('should initialize with isEditMode as false', () => {
      const { result } = renderHook(() => useEdit(), { wrapper });

      expect(result.current.isEditMode).toBe(false);
    });

    it('should toggle edit mode', () => {
      const { result } = renderHook(() => useEdit(), { wrapper });

      expect(result.current.isEditMode).toBe(false);

      act(() => {
        result.current.toggleEditMode();
      });

      expect(result.current.isEditMode).toBe(true);

      act(() => {
        result.current.toggleEditMode();
      });

      expect(result.current.isEditMode).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      const { result } = renderHook(() => useEdit(), { wrapper });

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.toggleEditMode();
        });
        expect(result.current.isEditMode).toBe(true);

        act(() => {
          result.current.toggleEditMode();
        });
        expect(result.current.isEditMode).toBe(false);
      }
    });

    it('should throw error when used outside EditProvider', () => {
      expect(() => {
        renderHook(() => useEdit());
      }).toThrow('useEdit must be used within EditProvider');
    });

    it('should maintain state independently in separate provider instances', () => {
      const { result: result1 } = renderHook(() => useEdit(), { wrapper });
      const { result: result2 } = renderHook(() => useEdit(), { wrapper });

      // Each renderHook creates a new wrapper instance, so state is independent
      expect(result1.current.isEditMode).toBe(false);
      expect(result2.current.isEditMode).toBe(false);

      // Toggle in first hook
      act(() => {
        result1.current.toggleEditMode();
      });

      // result1 should be updated
      expect(result1.current.isEditMode).toBe(true);
      // result2 should remain false (separate provider instance)
      expect(result2.current.isEditMode).toBe(false);
    });
  });

  describe('EditProvider', () => {
    it('should render children', () => {
      const { result } = renderHook(() => useEdit(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.isEditMode).toBeDefined();
      expect(result.current.toggleEditMode).toBeDefined();
    });

    it('should provide toggleEditMode function', () => {
      const { result } = renderHook(() => useEdit(), { wrapper });

      expect(typeof result.current.toggleEditMode).toBe('function');
    });
  });
});
