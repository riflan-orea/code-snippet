"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Handle paste event
  const handlePaste = () => {
    // Default paste behavior is fine
    // This is just to ensure the paste event is properly handled
  };

  // Focus the editor when language changes
  useEffect(() => {
    if (editorRef.current) {
      // Keep the focus if it was already focused
      if (isFocused) {
        editorRef.current.focus();
      }
    }
  }, [language, isFocused]);

  return (
    <div className="relative border rounded-md overflow-hidden">
      <div className="absolute top-2 right-2 text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded z-10">
        {language}
      </div>

      <textarea
        ref={editorRef}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full min-h-[300px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-md resize-none outline-none"
        placeholder={`// Add your ${language} code here`}
        spellCheck="false"
      />

      {isFocused && (
        <div className="absolute bottom-2 right-2 text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded">
          Editing
        </div>
      )}
    </div>
  );
}
