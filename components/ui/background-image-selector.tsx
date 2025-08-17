"use client";

import * as React from "react";
import { Button } from './button';
import { Label } from './label';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Upload, X } from 'lucide-react';

interface BackgroundImageSelectorProps {
  backgroundType: 'solid' | 'gradient' | 'image';
  setBackgroundType: (type: 'solid' | 'gradient' | 'image') => void;
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  backgroundImageOpacity: number;
  setBackgroundImageOpacity: (opacity: number) => void;
  backgroundImageSize: 'cover' | 'contain' | 'auto';
  setBackgroundImageSize: (size: 'cover' | 'contain' | 'auto') => void;
  backgroundImagePosition: string;
  setBackgroundImagePosition: (position: string) => void;
}

export function BackgroundImageSelector({
  backgroundType,
  setBackgroundType,
  backgroundImage,
  setBackgroundImage,
  backgroundImageOpacity,
  setBackgroundImageOpacity,
  backgroundImageSize,
  setBackgroundImageSize,
  backgroundImagePosition,
  setBackgroundImagePosition,
}: BackgroundImageSelectorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Section */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Upload Background Image</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-xs h-8"
          >
            <Upload className="w-3 h-3" />
            Choose Image
          </Button>
          {backgroundImage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="text-xs h-8 px-2"
            >
              <X className="w-3 h-3" />
              Remove
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">
          Upload JPG, PNG, or SVG images for your background
        </p>
      </div>

      {/* Image Controls */}
      {backgroundImage && (
        <>
          {/* Opacity */}
          <div className="space-y-2">
            <Label htmlFor="image-opacity" className="text-xs font-medium text-muted-foreground">
              Opacity: {Math.round(backgroundImageOpacity * 100)}%
            </Label>
            <Slider
              id="image-opacity"
              min={0}
              max={1}
              step={0.1}
              value={[backgroundImageOpacity]}
              onValueChange={(value) => setBackgroundImageOpacity(value[0])}
              className="py-1"
            />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="image-size" className="text-xs font-medium text-muted-foreground">
              Size
            </Label>
            <Select value={backgroundImageSize} onValueChange={(value: 'cover' | 'contain' | 'auto') => setBackgroundImageSize(value)}>
              <SelectTrigger id="image-size" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="cover" className="text-gray-100 hover:bg-gray-700">Cover</SelectItem>
                <SelectItem value="contain" className="text-gray-100 hover:bg-gray-700">Contain</SelectItem>
                <SelectItem value="auto" className="text-gray-100 hover:bg-gray-700">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="image-position" className="text-xs font-medium text-muted-foreground">
              Position
            </Label>
            <Select value={backgroundImagePosition} onValueChange={setBackgroundImagePosition}>
              <SelectTrigger id="image-position" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="center" className="text-gray-100 hover:bg-gray-700">Center</SelectItem>
                <SelectItem value="top" className="text-gray-100 hover:bg-gray-700">Top</SelectItem>
                <SelectItem value="bottom" className="text-gray-100 hover:bg-gray-700">Bottom</SelectItem>
                <SelectItem value="left" className="text-gray-100 hover:bg-gray-700">Left</SelectItem>
                <SelectItem value="right" className="text-gray-100 hover:bg-gray-700">Right</SelectItem>
                <SelectItem value="top left" className="text-gray-100 hover:bg-gray-700">Top Left</SelectItem>
                <SelectItem value="top right" className="text-gray-100 hover:bg-gray-700">Top Right</SelectItem>
                <SelectItem value="bottom left" className="text-gray-100 hover:bg-gray-700">Bottom Left</SelectItem>
                <SelectItem value="bottom right" className="text-gray-100 hover:bg-gray-700">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-2 rounded border border-gray-700 bg-gray-800/50">
            <Label className="text-xs font-medium text-muted-foreground mb-1 block">Preview</Label>
            <div
              className="w-full h-12 rounded border border-gray-600"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: backgroundImageSize,
                backgroundPosition: backgroundImagePosition,
                backgroundRepeat: 'no-repeat',
                opacity: backgroundImageOpacity,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}