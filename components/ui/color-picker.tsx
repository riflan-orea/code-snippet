"use client";

import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Validate hex color format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // If the input is not a valid hex color, revert to the last valid value
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-10 h-8 rounded border border-gray-600 cursor-pointer bg-transparent"
          title="Pick a color"
        />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="#000000"
          className="flex-1 font-mono text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
          maxLength={7}
        />
      </div>
    </div>
  );
}