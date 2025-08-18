"use client";

import * as React from "react";
import { Button } from './button';
import { Label } from './label';
import { Sparkles } from 'lucide-react';

interface GradientTemplate {
  id: string;
  name: string;
  gradient: string;
  stops: Array<{
    color: string;
    position: number;
  }>;
}

const gradientTemplates: GradientTemplate[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #ff512f 0%, #f09819 50%, #ffd89b 100%)',
    stops: [
      { color: '#ff512f', position: 0 },
      { color: '#f09819', position: 50 },
      { color: '#ffd89b', position: 100 }
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    gradient: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)',
    stops: [
      { color: '#2e3192', position: 0 },
      { color: '#1bffff', position: 100 }
    ]
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 50%, #a8edea 100%)',
    stops: [
      { color: '#ee9ca7', position: 0 },
      { color: '#ffdde1', position: 50 },
      { color: '#a8edea', position: 100 }
    ]
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    stops: [
      { color: '#134e5e', position: 0 },
      { color: '#71b280', position: 100 }
    ]
  },
  {
    id: 'candy',
    name: 'Candy',
    gradient: 'linear-gradient(135deg, #ff6b9d 0%, #feca57 50%, #48dbfb 100%)',
    stops: [
      { color: '#ff6b9d', position: 0 },
      { color: '#feca57', position: 50 },
      { color: '#48dbfb', position: 100 }
    ]
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    stops: [
      { color: '#0f0c29', position: 0 },
      { color: '#302b63', position: 50 },
      { color: '#24243e', position: 100 }
    ]
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    gradient: 'linear-gradient(135deg, #ff0000 0%, #ff7f00 17%, #ffff00 33%, #00ff00 50%, #0000ff 67%, #4b0082 83%, #9400d3 100%)',
    stops: [
      { color: '#ff0000', position: 0 },
      { color: '#ff7f00', position: 17 },
      { color: '#ffff00', position: 33 },
      { color: '#00ff00', position: 50 },
      { color: '#0000ff', position: 67 },
      { color: '#4b0082', position: 83 },
      { color: '#9400d3', position: 100 }
    ]
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    stops: [
      { color: '#c471f5', position: 0 },
      { color: '#fa71cd', position: 100 }
    ]
  }
];

interface GradientTemplatesProps {
  onSelectTemplate: (template: GradientTemplate) => void;
}

export function GradientTemplates({ onSelectTemplate }: GradientTemplatesProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Sparkles className="h-3 w-3" />
        Quick Templates
      </Label>
      <div className="grid grid-cols-4 gap-2">
        {gradientTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group relative h-16 rounded-lg border border-gray-700 overflow-hidden transition-all hover:border-gray-500 hover:scale-105"
            style={{ background: template.gradient }}
            title={template.name}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
              {template.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { gradientTemplates };
export type { GradientTemplate };