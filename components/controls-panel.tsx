"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { GradientSelector } from "@/components/ui/gradient-selector";
import { useCodeImageStore } from "@/lib/store";

export type SupportedLanguage = 'javascript' | 'html' | 'go';

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
  } = useCodeImageStore();

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
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

      {/* Gradient Background Options */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Background Style
        </Label>
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
      </div>

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

      {/* Watermark Opacity */}
      {watermark && (
        <div className="space-y-2">
          <Label htmlFor="watermarkOpacity" className="text-xs font-medium text-muted-foreground">
            Opacity: {Math.round(watermarkOpacity * 100)}%
          </Label>
          <Slider
            id="watermarkOpacity"
            min={0.1}
            max={1}
            step={0.1}
            value={[watermarkOpacity]}
            onValueChange={(value) => setWatermarkOpacity(value[0])}
            className="py-2"
          />
        </div>
      )}
    </div>
  );
}