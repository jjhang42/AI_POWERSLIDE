"use client";

import { useState } from "react";
import { useEdit } from "@/lib/contexts/EditContext";
import { EditableText } from "./EditableText";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableListProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  className?: string;
  itemClassName?: string;
}

export function EditableList({
  items,
  onChange,
  className,
  itemClassName,
}: EditableListProps) {
  const { isEditMode } = useEdit();

  const handleItemChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  const handleAddItem = () => {
    onChange([...items, "New item"]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <EditableText
            value={item}
            onChange={(newValue) => handleItemChange(index, newValue)}
            className={itemClassName}
          />
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteItem(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}

      {isEditMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      )}
    </div>
  );
}
