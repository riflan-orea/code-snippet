"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { GradientSelector } from "@/components/ui/gradient-selector";
import { ColorPicker } from "@/components/ui/color-picker";
import { BackgroundImageSelector } from "@/components/ui/background-image-selector";
import { useCodeImageStore } from "@/lib/store";

export type SupportedLanguage = 'javascript' | 'html' | 'go' | 'java' | 'dart';

type ControlsPanelProps = {
  selectedLanguage: SupportedLanguage;
  onSelectedLanguageChange: (lang: SupportedLanguage) => void;
};

export function ControlsPanel({ selectedLanguage, onSelectedLanguageChange }: ControlsPanelProps) {
  const {
    showLineNumbers,
    setShowLineNumbers,
    title,
    setTitle,
    displayTitle,
    setDisplayTitle,
    watermark,
    setWatermark,
    watermarkOpacity,
    setWatermarkOpacity,
    backgroundType,
    setBackgroundType,
    selectedGradient,
    setSelectedGradient,
    customGradient,
    setCustomGradient,
    gradientAngle,
    setGradientAngle,
    backgroundColor,
    setBackgroundColor,
    backgroundImage,
    setBackgroundImage,
    backgroundImageOpacity,
    setBackgroundImageOpacity,
    backgroundImageSize,
    setBackgroundImageSize,
    backgroundImagePosition,
    setBackgroundImagePosition,
  } = useCodeImageStore();

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">

      {/* Watermark Text */}
      <div className="space-y-2">
        <Label htmlFor="watermark" className="text-xs font-medium text-muted-foreground">
          Watermark Text
        </Label>
        <Input
          id="watermark"
          value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
          placeholder="@yourhandle or yoursite.com"
          className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Display Title */}
      <div className="space-y-2">
        <Label htmlFor="displayTitle" className="text-xs font-medium text-muted-foreground">
          Display Title
        </Label>
        <Input
          id="displayTitle"
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
          placeholder="Optional title above code"
          className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Window Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs font-medium text-muted-foreground">
          Window Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Window title"
          className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Programming Language */}
      <div className="space-y-2">
        <Label htmlFor="language" className="text-xs font-medium text-muted-foreground">
          Programming Language
        </Label>
        <Select value={selectedLanguage} onValueChange={(value) => onSelectedLanguageChange(value as SupportedLanguage)}>
          <SelectTrigger id="language" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="javascript" className="text-gray-100 hover:bg-gray-700">JavaScript</SelectItem>
            <SelectItem value="html" className="text-gray-100 hover:bg-gray-700">HTML</SelectItem>
            <SelectItem value="go" className="text-gray-100 hover:bg-gray-700">Go</SelectItem>
            <SelectItem value="java" className="text-gray-100 hover:bg-gray-700">Java</SelectItem>
            <SelectItem value="dart" className="text-gray-100 hover:bg-gray-700">Dart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show Line Numbers */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showLineNumbers"
          checked={showLineNumbers}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowLineNumbers(e.target.checked)}
          className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary"
        />
        <Label htmlFor="showLineNumbers" className="text-sm text-gray-100">
          Show Line Numbers
        </Label>
      </div>

      {/* Background Section */}
      <div className="space-y-4">
        <Label className="text-xs font-medium text-muted-foreground">
          Background Settings
        </Label>

        {/* Background Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Background Type
          </Label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setBackgroundType('solid')}
              className={`px-3 py-2 text-xs rounded border transition-all ${
                backgroundType === 'solid'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => setBackgroundType('gradient')}
              className={`px-3 py-2 text-xs rounded border transition-all ${
                backgroundType === 'gradient'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              Gradient
            </button>
            <button
              onClick={() => setBackgroundType('image')}
              className={`px-3 py-2 text-xs rounded border transition-all ${
                backgroundType === 'image'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              Image
            </button>
          </div>
        </div>

        {/* Solid Color Options */}
        {backgroundType === 'solid' && (
          <div className="space-y-3">
            {/* Preset Colors */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Preset Colors
              </Label>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { name: 'Slate', value: '#1e293b' },
                  { name: 'Gray', value: '#374151' },
                  { name: 'Zinc', value: '#3f3f46' },
                  { name: 'Neutral', value: '#52525b' },
                  { name: 'Stone', value: '#57534e' },
                  { name: 'Red', value: '#7f1d1d' },
                  { name: 'Orange', value: '#9a3412' },
                  { name: 'Amber', value: '#92400e' },
                  { name: 'Yellow', value: '#a16207' },
                  { name: 'Lime', value: '#3f6212' },
                  { name: 'Green', value: '#14532d' },
                  { name: 'Emerald', value: '#064e3b' },
                  { name: 'Teal', value: '#134e4a' },
                  { name: 'Cyan', value: '#164e63' },
                  { name: 'Sky', value: '#0c4a6e' },
                  { name: 'Blue', value: '#1e3a8a' },
                  { name: 'Indigo', value: '#312e81' },
                  { name: 'Violet', value: '#4c1d95' },
                  { name: 'Purple', value: '#581c87' },
                  { name: 'Fuchsia', value: '#701a75' },
                  { name: 'Pink', value: '#831843' },
                  { name: 'Rose', value: '#9f1239' },
                ].map((color) => (
                  <div key={color.value} className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => setBackgroundColor(color.value)}
                      className={`w-8 h-8 rounded border transition-all ${
                        backgroundColor === color.value
                          ? 'border-primary ring-1 ring-primary'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={`Select ${color.name} background color`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <ColorPicker
              value={backgroundColor}
              onChange={setBackgroundColor}
              label="Custom Color"
            />
          </div>
        )}

        {/* Gradient Background Options */}
        {backgroundType === 'gradient' && (
          <GradientSelector
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            selectedGradient={selectedGradient}
            setSelectedGradient={setSelectedGradient}
            customGradient={customGradient}
            setCustomGradient={setCustomGradient}
            gradientAngle={gradientAngle}
            setGradientAngle={setGradientAngle}
          />
        )}

        {/* Background Image Options */}
        {backgroundType === 'image' && (
          <BackgroundImageSelector
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            backgroundImageOpacity={backgroundImageOpacity}
            setBackgroundImageOpacity={setBackgroundImageOpacity}
            backgroundImageSize={backgroundImageSize}
            setBackgroundImageSize={setBackgroundImageSize}
            backgroundImagePosition={backgroundImagePosition}
            setBackgroundImagePosition={setBackgroundImagePosition}
          />
        )}
      </div>

      {/* Watermark Opacity */}
      {watermark && (
        <div className="space-y-2">
          <Label htmlFor="watermarkOpacity" className="text-xs font-medium text-muted-foreground">
            Watermark Opacity: {Math.round(watermarkOpacity * 100)}%
          </Label>
          <Slider
            id="watermarkOpacity"
            min={0}
            max={1}
            step={0.1}
            value={[watermarkOpacity]}
            onValueChange={(value) => setWatermarkOpacity(value[0])}
            className="py-1"
          />
        </div>
      )}
    </div>
  );
}