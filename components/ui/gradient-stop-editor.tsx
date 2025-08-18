"use client";

import * as React from "react";
import { Button } from './button';
import { Label } from './label';
import { Slider } from './slider';
import { ColorPicker } from './color-picker';
import { Input } from './input';
import { Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

interface GradientStopEditorProps {
  stop: GradientStop;
  stops: GradientStop[];
  onUpdate: (id: string, updates: Partial<GradientStop>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (stop: GradientStop) => void;
}

export function GradientStopEditor({
  stop,
  stops,
  onUpdate,
  onRemove,
  onDuplicate
}: GradientStopEditorProps) {
  const [positionInput, setPositionInput] = React.useState(String(stop.position));

  React.useEffect(() => {
    setPositionInput(String(stop.position));
  }, [stop.position]);

  const handlePositionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPositionInput(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onUpdate(stop.id, { position: numValue });
    }
  };

  const handlePositionInputBlur = () => {
    const numValue = parseFloat(positionInput);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      setPositionInput(String(stop.position));
    }
  };

  const nudgePosition = (delta: number) => {
    const newPosition = Math.max(0, Math.min(100, stop.position + delta));
    onUpdate(stop.id, { position: newPosition });
  };

  return (
    <div className="space-y-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">
          Edit Color Stop
        </Label>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(stop)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
            title="Duplicate stop"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(stop.id)}
            disabled={stops.length <= 2}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
            title="Remove stop"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ColorPicker
        value={stop.color}
        onChange={(color) => onUpdate(stop.id, { color })}
        label="Color"
      />

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Position
        </Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nudgePosition(-1)}
            className="h-7 w-7 p-0 border-gray-700"
            title="Move left"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <div className="flex-1 flex items-center gap-2">
            <Slider
              min={0}
              max={100}
              step={0.1}
              value={[stop.position]}
              onValueChange={(value) => onUpdate(stop.id, { position: value[0] })}
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={positionInput}
                onChange={handlePositionInputChange}
                onBlur={handlePositionInputBlur}
                min={0}
                max={100}
                step={0.1}
                className="w-16 h-7 text-xs bg-gray-800 border-gray-700 text-gray-100"
              />
              <span className="text-xs text-gray-400">%</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => nudgePosition(1)}
            className="h-7 w-7 p-0 border-gray-700"
            title="Move right"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Quick Position Presets */}
      <div className="flex gap-1">
        <Label className="text-xs font-medium text-muted-foreground mr-2">
          Quick:
        </Label>
        {[0, 25, 50, 75, 100].map((pos) => (
          <Button
            key={pos}
            variant={stop.position === pos ? "secondary" : "outline"}
            size="sm"
            onClick={() => onUpdate(stop.id, { position: pos })}
            className="h-6 px-2 text-xs border-gray-700"
          >
            {pos}%
          </Button>
        ))}
      </div>
    </div>
  );
}