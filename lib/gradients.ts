import { GradientPreset } from './store';

export const gradientPresets: GradientPreset[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  },
  {
    id: 'royal',
    name: 'Royal',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
  },
  {
    id: 'candy',
    name: 'Candy',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  {
    id: 'ember',
    name: 'Ember',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
  },
  {
    id: 'spring',
    name: 'Spring',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    id: 'volcano',
    name: 'Volcano',
    gradient: 'linear-gradient(135deg, #ff4b1f 0%, #ff9068 100%)',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    gradient: 'linear-gradient(135deg, #e3ffe7 0%, #d9e7ff 100%)',
  },
];

export function createGradientCSS(gradientId: string, angle: number, customGradient?: string): string {
  if (customGradient) {
    return customGradient;
  }
  
  const preset = gradientPresets.find(p => p.id === gradientId);
  if (!preset) {
    return gradientPresets[0].gradient; // fallback to ocean
  }
  
  // Replace the angle in the gradient
  const gradientWithAngle = preset.gradient.replace(/\d+deg/, `${angle}deg`);
  return gradientWithAngle;
}

export function getGradientPreview(gradientId: string): string {
  const preset = gradientPresets.find(p => p.id === gradientId);
  return preset?.gradient || gradientPresets[0].gradient;
}

export function parseGradientColors(gradient: string): string[] {
  const colorRegex = /#[0-9a-f]{6}|#[0-9a-f]{3}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/gi;
  return gradient.match(colorRegex) || [];
}