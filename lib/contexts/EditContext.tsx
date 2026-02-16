"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EditContextValue {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const EditContext = createContext<EditContextValue | undefined>(undefined);

export function EditProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <EditContext.Provider
      value={{
        isEditMode,
        toggleEditMode: () => setIsEditMode(!isEditMode),
      }}
    >
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const context = useContext(EditContext);
  if (!context) throw new Error("useEdit must be used within EditProvider");
  return context;
}
