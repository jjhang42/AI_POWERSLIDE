"use client";

import { useReducer, useCallback } from "react";

interface UseHistoryOptions<T> {
  maxHistorySize?: number;
}

interface HistoryState<T> {
  history: T[];
  index: number;
}

type HistoryAction<T> =
  | { type: "SET"; payload: T }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "GOTO"; payload: number };

function createHistoryReducer<T>(maxHistorySize: number) {
  return (state: HistoryState<T>, action: HistoryAction<T>): HistoryState<T> => {
    switch (action.type) {
      case "SET": {
        // Remove any redo history after current index
        const newHistory = state.history.slice(0, state.index + 1);

        // Add new state
        newHistory.push(action.payload);

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          // Index stays the same when we shift
          return {
            history: newHistory,
            index: state.index,
          };
        }

        // Move to the new end of history
        return {
          history: newHistory,
          index: newHistory.length - 1,
        };
      }

      case "UNDO": {
        if (state.index > 0) {
          return {
            ...state,
            index: state.index - 1,
          };
        }
        return state;
      }

      case "REDO": {
        if (state.index < state.history.length - 1) {
          return {
            ...state,
            index: state.index + 1,
          };
        }
        return state;
      }

      case "GOTO": {
        const targetIndex = action.payload;
        if (targetIndex >= 0 && targetIndex < state.history.length) {
          return {
            ...state,
            index: targetIndex,
          };
        }
        return state;
      }

      default:
        return state;
    }
  };
}

export function useHistory<T>(
  initialState: T,
  options: UseHistoryOptions<T> = {}
) {
  const { maxHistorySize = 50 } = options;

  const [{ history, index }, dispatch] = useReducer(
    createHistoryReducer<T>(maxHistorySize),
    {
      history: [initialState],
      index: 0,
    }
  );

  const state = history[index];

  const set = useCallback(
    (newState: T | ((prev: T) => T)) => {
      if (typeof newState === "function") {
        // For function updates, we need to pass a function to the reducer
        // Since reducers can't handle async or function payloads directly,
        // we get the current state and compute the new state here
        const nextState = (newState as (prev: T) => T)(history[index]);
        dispatch({ type: "SET", payload: nextState });
      } else {
        dispatch({ type: "SET", payload: newState });
      }
    },
    [history, index]
  );

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const goToIndex = useCallback((targetIndex: number) => {
    dispatch({ type: "GOTO", payload: targetIndex });
  }, []);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return {
    state,
    set,
    undo,
    redo,
    goToIndex,
    canUndo,
    canRedo,
    history,
    currentIndex: index,
  };
}
