"use client";

import * as React from "react";
import { Button } from './button';
import { Label } from './label';
import { Slider } from './slider';
import { Plus, Copy, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { GradientTemplates, GradientTemplate } from './gradient-templates';
import { GradientStopEditor } from './gradient-stop-editor';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

interface GradientBuilderProps {
  value: string;
  onChange: (gradient: string) => void;
  angle: number;
  onAngleChange: (angle: number) => void;
}

export function GradientBuilder({ 
  value, 
  onChange, 
  angle,
  onAngleChange 
}: GradientBuilderProps) {
  const [gradientType, setGradientType] = React.useState<'linear' | 'radial' | 'conic'>('linear');
  const [stops, setStops] = React.useState<GradientStop[]>([
    { id: '1', color: '#667eea', position: 0 },
    { id: '2', color: '#764ba2', position: 100 }
  ]);
  const [selectedStopId, setSelectedStopId] = React.useState<string>('1');
  const [copied, setCopied] = React.useState(false);

  // Parse existing gradient value on mount
  React.useEffect(() => {
    if (value) {
      parseGradient(value);
    }
  }, []);

  // Update gradient when stops or angle change
  React.useEffect(() => {
    const gradient = generateGradient();
    onChange(gradient);
  }, [stops, angle, gradientType]);

  const parseGradient = (gradientString: string) => {
    try {
      // Detect gradient type
      if (gradientString.startsWith('radial-gradient')) {
        setGradientType('radial');
      } else if (gradientString.startsWith('conic-gradient')) {
        setGradientType('conic');
      } else {
        setGradientType('linear');
      }

      // Extract angle for linear gradients
      const angleMatch = gradientString.match(/(\d+)deg/);
      if (angleMatch) {
        onAngleChange(parseInt(angleMatch[1]));
      }

      // Extract color stops
      const colorStopRegex = /(#[0-9a-f]{3,6}|rgb[a]?\([^)]+\)|[a-z]+)\s+(\d+)%/gi;
      const matches = [...gradientString.matchAll(colorStopRegex)];
      
      if (matches.length > 0) {
        const newStops = matches.map((match, index) => ({
          id: String(index + 1),
          color: match[1],
          position: parseInt(match[2])
        }));
        setStops(newStops);
        if (newStops.length > 0) {
          setSelectedStopId(newStops[0].id);
        }
      }
    } catch (error) {
      console.error('Error parsing gradient:', error);
    }
  };

  const generateGradient = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'radial':
        return `radial-gradient(circle, ${stopString})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stopString})`;
      default:
        return `linear-gradient(${angle}deg, ${stopString})`;
    }
  };

  const addStop = () => {
    const newStop: GradientStop = {
      id: String(Date.now()),
      color: '#888888',
      position: 50
    };
    setStops([...stops, newStop]);
    setSelectedStopId(newStop.id);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      const newStops = stops.filter(stop => stop.id !== id);
      setStops(newStops);
      if (selectedStopId === id && newStops.length > 0) {
        setSelectedStopId(newStops[0].id);
      }
    }
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, ...updates } : stop
    ));
  };

  const duplicateStop = (stopToDuplicate: GradientStop) => {
    const newStop: GradientStop = {
      id: String(Date.now()),
      color: stopToDuplicate.color,
      position: Math.min(100, stopToDuplicate.position + 5)
    };
    setStops([...stops, newStop]);
    setSelectedStopId(newStop.id);
  };

  const selectedStop = stops.find(stop => stop.id === selectedStopId);

  const copyGradient = () => {
    navigator.clipboard.writeText(generateGradient());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyTemplate = (template: GradientTemplate) => {
    // Parse the template gradient to extract angle and type
    const angleMatch = template.gradient.match(/(\d+)deg/);
    if (angleMatch) {
      onAngleChange(parseInt(angleMatch[1]));
    }
    
    // Set gradient type
    if (template.gradient.startsWith('radial')) {
      setGradientType('radial');
    } else if (template.gradient.startsWith('conic')) {
      setGradientType('conic');
    } else {
      setGradientType('linear');
    }
    
    // Apply stops
    const newStops = template.stops.map((stop, index) => ({
      id: String(index + 1),
      color: stop.color,
      position: stop.position
    }));
    setStops(newStops);
    if (newStops.length > 0) {
      setSelectedStopId(newStops[0].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Templates */}
      <GradientTemplates onSelectTemplate={applyTemplate} />
      
      {/* Gradient Type Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Gradient Type
        </Label>
        <Select value={gradientType} onValueChange={(value: any) => setGradientType(value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
            <SelectItem value="conic">Conic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Angle Control (for linear and conic gradients) */}
      {(gradientType === 'linear' || gradientType === 'conic') && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            {gradientType === 'linear' ? 'Angle' : 'Starting Angle'}: {angle}°
          </Label>
          <Slider
            min={0}
            max={360}
            step={1}
            value={[angle]}
            onValueChange={(value) => onAngleChange(value[0])}
            className="py-1"
          />
        </div>
      )}

      {/* Visual Gradient Bar with Stops */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Color Stops
        </Label>
        <div className="relative">
          {/* Gradient Preview Bar */}
          <div 
            className="h-12 rounded-lg border border-gray-600 relative overflow-hidden"
            style={{ background: generateGradient() }}
          >
            {/* Stop Markers */}
            <div className="absolute inset-0">
              {stops.map(stop => (
                <button
                  key={stop.id}
                  className={`absolute top-0 bottom-0 w-1 transform -translate-x-1/2 transition-all ${
                    selectedStopId === stop.id 
                      ? 'ring-2 ring-primary ring-offset-1 ring-offset-gray-900' 
                      : 'hover:ring-1 hover:ring-gray-400'
                  }`}
                  style={{ 
                    left: `${stop.position}%`,
                    backgroundColor: stop.color
                  }}
                  onClick={() => setSelectedStopId(stop.id)}
                  title={`${stop.color} at ${stop.position}%`}
                />
              ))}
            </div>
          </div>

          {/* Stop Indicators Below */}
          <div className="relative h-6 mt-1">
            {stops.map(stop => (
              <div
                key={stop.id}
                className={`absolute transform -translate-x-1/2 cursor-pointer transition-all ${
                  selectedStopId === stop.id ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{ left: `${stop.position}%` }}
                onClick={() => setSelectedStopId(stop.id)}
              >
                <div 
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedStopId === stop.id 
                      ? 'border-primary shadow-lg' 
                      : 'border-gray-500'
                  }`}
                  style={{ backgroundColor: stop.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Stop Controls */}
      {selectedStop && (
        <GradientStopEditor
          stop={selectedStop}
          stops={stops}
          onUpdate={updateStop}
          onRemove={removeStop}
          onDuplicate={duplicateStop}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addStop}
          className="flex-1 text-xs border-gray-700 hover:bg-gray-800"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Stop
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyGradient}
          className="flex-1 text-xs border-gray-700 hover:bg-gray-800"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy CSS
            </>
          )}
        </Button>
      </div>

      {/* CSS Output */}
      <div className="p-2 rounded bg-gray-900 border border-gray-700">
        <code className="text-xs text-gray-400 font-mono break-all">
          {generateGradient()}
        </code>
      </div>
    </div>
  );
}