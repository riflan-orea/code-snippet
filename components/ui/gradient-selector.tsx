"use client";

import * as React from "react";
import { Button } from './button';
import { Label } from './label';
import { Slider } from './slider';
import { GradientBuilder } from './gradient-builder';
import { gradientPresets, createGradientCSS, getGradientPreview } from '@/lib/gradients';
import { Palette, Wand2 } from 'lucide-react';

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
          <Label className="text-xs font-medium text-muted-foreground">
            {showCustomGradient ? 'Custom Builder' : 'Presets'}
          </Label>
          <div className="flex gap-1">
            <Button
              variant={!showCustomGradient ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowCustomGradient(false)}
              className="text-xs h-6 px-2"
              title="Use preset gradients"
            >
              <Palette className="h-3 w-3 mr-1" />
              Presets
            </Button>
            <Button
              variant={showCustomGradient ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowCustomGradient(true)}
              className="text-xs h-6 px-2"
              title="Build custom gradient"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Builder
            </Button>
          </div>
        </div>

        {!showCustomGradient && (
          <>
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
                </div>
              ))}
            </div>

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
          </>
        )}

        {showCustomGradient && (
          <GradientBuilder
            value={customGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
            onChange={setCustomGradient}
            angle={gradientAngle}
            onAngleChange={setGradientAngle}
          />
        )}
      </div>
    </div>
  );
}