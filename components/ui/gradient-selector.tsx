"use client";

import * as React from "react";
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Slider } from './slider';
import { gradientPresets, createGradientCSS, getGradientPreview } from '@/lib/gradients';

interface GradientSelectorProps {
  backgroundType: 'solid' | 'gradient' | 'image';
  setBackgroundType: (type: 'solid' | 'gradient' | 'image') => void;
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
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Presets</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomGradient(!showCustomGradient)}
            className="text-xs h-6 px-2"
          >
            {showCustomGradient ? 'Presets' : 'Custom'}
          </Button>
        </div>

        {!showCustomGradient && (
          <div className="grid grid-cols-6 gap-1">
            {gradientPresets.map((preset) => (
              <div key={preset.id} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setSelectedGradient(preset.id)}
                  className={`w-8 h-8 rounded border transition-all ${
                    selectedGradient === preset.id
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ background: getGradientPreview(preset.id) }}
                  title={preset.name}
                />
                <span className="text-xs text-gray-500 text-center leading-3">{preset.name}</span>
              </div>
            ))}
          </div>
        )}

        {showCustomGradient && (
          <div className="space-y-2">
            <Label htmlFor="custom-gradient" className="text-xs font-medium text-muted-foreground">
              Custom CSS
            </Label>
            <Input
              id="custom-gradient"
              value={customGradient}
              onChange={(e) => setCustomGradient(e.target.value)}
              placeholder="linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)"
              className="font-mono text-xs bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="gradient-angle" className="text-xs font-medium text-muted-foreground">
            Angle: {gradientAngle}°
          </Label>
          <Slider
            id="gradient-angle"
            min={0}
            max={360}
            step={1}
            value={[gradientAngle]}
            onValueChange={(value) => setGradientAngle(value[0])}
            className="py-1"
          />
        </div>

        <div className="p-2 rounded border border-gray-700 bg-gray-800/50">
          <Label className="text-xs font-medium text-muted-foreground mb-1 block">Preview</Label>
          <div
            className="w-full h-12 rounded border border-gray-600"
            style={{
              background: createGradientCSS(selectedGradient, gradientAngle, customGradient),
            }}
          />
        </div>
      </div>
    </div>
  );
}