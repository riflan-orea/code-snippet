"use client";

import * as React from "react";
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Slider } from './slider';
import { Switch } from './switch';
import { gradientPresets, createGradientCSS, getGradientPreview } from '@/lib/gradients';

interface GradientSelectorProps {
  backgroundType: 'solid' | 'gradient';
  setBackgroundType: (type: 'solid' | 'gradient') => void;
  selectedGradient: string;
  setSelectedGradient: (gradient: string) => void;
  customGradient: string;
  setCustomGradient: (gradient: string) => void;
  gradientAngle: number;
  setGradientAngle: (angle: number) => void;
}

export function GradientSelector({
  backgroundType,
  setBackgroundType,
  selectedGradient,
  setSelectedGradient,
  customGradient,
  setCustomGradient,
  gradientAngle,
  setGradientAngle,
}: GradientSelectorProps) {
  const [showCustomGradient, setShowCustomGradient] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch 
          id="gradient-toggle"
          checked={backgroundType === 'gradient'}
          onCheckedChange={(checked) => setBackgroundType(checked ? 'gradient' : 'solid')}
        />
        <Label htmlFor="gradient-toggle" className="text-gray-300">
          Use Gradient Background
        </Label>
      </div>

      {backgroundType === 'gradient' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 font-medium">Gradient Presets</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomGradient(!showCustomGradient)}
              className="text-xs"
            >
              {showCustomGradient ? 'Use Presets' : 'Custom Gradient'}
            </Button>
          </div>

          {!showCustomGradient && (
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset) => (
                <div key={preset.id} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setSelectedGradient(preset.id)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedGradient === preset.id
                        ? 'border-indigo-400 ring-2 ring-indigo-100'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    style={{ background: getGradientPreview(preset.id) }}
                    title={preset.name}
                  />
                  <span className="text-xs text-gray-400 text-center">{preset.name}</span>
                </div>
              ))}
            </div>
          )}

          {showCustomGradient && (
            <div className="space-y-2">
              <Label htmlFor="custom-gradient" className="text-gray-300 font-medium">
                Custom Gradient CSS
              </Label>
              <Input
                id="custom-gradient"
                value={customGradient}
                onChange={(e) => setCustomGradient(e.target.value)}
                placeholder="e.g., linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)"
                className="font-mono text-sm bg-gray-700 border-gray-600 text-gray-100"
              />
              <p className="text-xs text-gray-400">
                Enter a valid CSS gradient (linear-gradient, radial-gradient, etc.)
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="gradient-angle" className="text-gray-300 font-medium">
              Gradient Angle: {gradientAngle}°
            </Label>
            <Slider
              id="gradient-angle"
              min={0}
              max={360}
              step={1}
              value={[gradientAngle]}
              onValueChange={(value) => setGradientAngle(value[0])}
              className="py-2"
            />
          </div>

          <div className="p-4 rounded-lg border border-gray-600 bg-gray-700">
            <Label className="text-gray-300 font-medium mb-2 block">Preview</Label>
            <div
              className="w-full h-16 rounded-lg border border-gray-600"
              style={{
                background: createGradientCSS(selectedGradient, gradientAngle, customGradient),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}