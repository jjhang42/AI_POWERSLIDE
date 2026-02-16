import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn (className merger)', () => {
    it('should merge multiple class names', () => {
      const result = cn('px-4', 'py-2', 'text-white');
      expect(result).toBe('px-4 py-2 text-white');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('should filter out falsy values', () => {
      const result = cn('visible', false, null, undefined, 'show');
      expect(result).toBe('visible show');
    });

    it('should merge conflicting Tailwind classes correctly', () => {
      // twMerge should keep the last conflicting class
      const result = cn('px-4', 'px-8');
      expect(result).toBe('px-8');
    });

    it('should handle array inputs', () => {
      const result = cn(['flex', 'items-center'], 'justify-between');
      expect(result).toBe('flex items-center justify-between');
    });

    it('should handle object inputs', () => {
      const result = cn({
        'text-white': true,
        'bg-blue-500': true,
        'hidden': false,
      });
      expect(result).toBe('text-white bg-blue-500');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle complex real-world scenarios', () => {
      const variant = 'primary';
      const size = 'large';
      const disabled = false;

      const result = cn(
        'btn',
        variant === 'primary' && 'btn-primary',
        size === 'large' && 'btn-lg',
        disabled && 'btn-disabled'
      );

      expect(result).toBe('btn btn-primary btn-lg');
    });

    it('should merge duplicate classes', () => {
      const result = cn('flex flex items-center');
      expect(result).toBe('flex items-center');
    });

    it('should handle Tailwind modifiers correctly', () => {
      const result = cn('hover:bg-blue-500', 'dark:bg-gray-800');
      expect(result).toBe('hover:bg-blue-500 dark:bg-gray-800');
    });

    it('should override conflicting responsive classes', () => {
      const result = cn('sm:px-4', 'sm:px-8');
      expect(result).toBe('sm:px-8');
    });

    it('should handle mixed types', () => {
      const result = cn(
        'base',
        ['array-class-1', 'array-class-2'],
        { 'object-class': true },
        false && 'conditional-class',
        'final-class'
      );
      expect(result).toBe('base array-class-1 array-class-2 object-class final-class');
    });
  });
});
