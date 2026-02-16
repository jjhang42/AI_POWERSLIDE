"use client";

/**
 * ImageUploadField
 * 이미지 URL 입력 필드 (업로드는 나중에 추가 가능)
 */

import React from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
        />
        <button
          type="button"
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="이미지 미리보기"
        >
          <ImageIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
