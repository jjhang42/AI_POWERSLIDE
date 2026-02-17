/**
 * Higher-Order Component for adding draggable positioning to any template
 *
 * Usage:
 * ```tsx
 * const EnhancedTemplate = withDraggableElements(BaseTemplate, {
 *   title: 'text',
 *   subtitle: 'text',
 *   image: 'custom'
 * });
 * ```
 */

import { ComponentType, ReactElement, cloneElement, isValidElement } from 'react';
import { DraggableElement, Position } from './DraggableElement';
import { EditableText } from '../editor/EditableText';

/**
 * Configuration for draggable elements
 * Maps prop names to their draggable behavior
 */
export type DraggableConfig = {
  [key: string]: 'text' | 'custom';
};

/**
 * Props injected by the HOC
 */
export interface WithDraggableProps {
  positions?: { [key: string]: Position };
  onUpdate?: (newProps: any) => void;
  isPositioningEnabled?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
}

/**
 * HOC that wraps specified props with DraggableElement
 */
export function withDraggableElements<P extends object>(
  WrappedComponent: ComponentType<P>,
  draggableConfig: DraggableConfig
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithDraggable = (props: P & WithDraggableProps) => {
    const {
      positions = {},
      onUpdate,
      isPositioningEnabled = false,
      selectedElementId = null,
      onSelectElement,
      ...componentProps
    } = props as any;

    const handlePositionChange = (key: string, position: Position) => {
      onUpdate?.({
        positions: {
          ...positions,
          [key]: position,
        },
      });
    };

    /**
     * Wraps a value with DraggableElement
     */
    const wrapWithDraggable = (key: string, value: any, type: 'text' | 'custom') => {
      const position = positions[key] || { x: 0, y: 0 };

      if (type === 'text') {
        // Keynote-style: DraggableElement handles click-to-select/drag, EditableText handles double-click-to-edit
        return (
          <DraggableElement
            key={key}
            position={position}
            onPositionChange={(pos) => handlePositionChange(key, pos)}
            isSelected={selectedElementId === key}
            onSelect={() => onSelectElement?.(key)}
          >
            <EditableText
              value={value}
              onChange={(newValue) => onUpdate?.({ [key]: newValue })}
              disabled={false}
            />
          </DraggableElement>
        );
      } else if (type === 'custom') {
        return (
          <DraggableElement
            key={key}
            position={position}
            onPositionChange={(pos) => handlePositionChange(key, pos)}
            isSelected={selectedElementId === key}
            onSelect={() => onSelectElement?.(key)}
          >
            {value}
          </DraggableElement>
        );
      }

      return value;
    };

    /**
     * Process props to wrap configured items with DraggableElement
     */
    const enhancedProps: any = { ...componentProps };

    Object.entries(draggableConfig).forEach(([key, type]) => {
      const value = (componentProps as any)[key];
      if (value !== undefined && value !== null) {
        enhancedProps[key] = wrapWithDraggable(key, value, type);
      }
    });

    // Add positioning-related props
    enhancedProps.positions = positions;
    enhancedProps.onUpdate = onUpdate;
    enhancedProps.isPositioningEnabled = isPositioningEnabled;
    enhancedProps.selectedElementId = selectedElementId;
    enhancedProps.onSelectElement = onSelectElement;

    return <WrappedComponent {...(enhancedProps as P)} />;
  };

  WithDraggable.displayName = `withDraggableElements(${displayName})`;

  return WithDraggable;
}

/**
 * Utility hook for manual wrapping (alternative to HOC)
 */
export function useDraggableWrapper(
  elementId: string,
  positions: { [key: string]: Position } = {},
  onUpdate?: (newProps: any) => void,
  isPositioningEnabled = false,
  selectedElementId: string | null = null,
  onSelectElement?: (id: string | null) => void
) {
  const handlePositionChange = (position: Position) => {
    onUpdate?.({
      positions: {
        ...positions,
        [elementId]: position,
      },
    });
  };

  const wrapWithDraggable = (children: React.ReactNode) => (
    <DraggableElement
      position={positions[elementId] || { x: 0, y: 0 }}
      onPositionChange={handlePositionChange}
      isSelected={selectedElementId === elementId}
      onSelect={() => onSelectElement?.(elementId)}
      disabled={!isPositioningEnabled}
    >
      {children}
    </DraggableElement>
  );

  return {
    wrapWithDraggable,
    position: positions[elementId] || { x: 0, y: 0 },
    isSelected: selectedElementId === elementId,
  };
}
