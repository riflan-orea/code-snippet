import { GradientPreset } from './store';

export const gradientPresets: GradientPreset[] = [
  // Existing gradients
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
  
  // New gradients
  {
    id: 'neon',
    name: 'Neon',
    gradient: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)',
  },
  {
    id: 'citrus',
    name: 'Citrus',
    gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)',
  },
  {
    id: 'ice',
    name: 'Ice',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
  },
  {
    id: 'fire',
    name: 'Fire',
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)',
  },
  {
    id: 'mint',
    name: 'Mint',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
  },
  {
    id: 'purple',
    name: 'Purple',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
  },
  {
    id: 'gold',
    name: 'Gold',
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    gradient: 'linear-gradient(135deg, #55a3ff 0%, #003d82 100%)',
  },
  {
    id: 'rose',
    name: 'Rose',
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
  },
  {
    id: 'steel',
    name: 'Steel',
    gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
  },
  {
    id: 'coral',
    name: 'Coral',
    gradient: 'linear-gradient(135deg, #fab1a0 0%, #e17055 100%)',
  },
  {
    id: 'teal',
    name: 'Teal',
    gradient: 'linear-gradient(135deg, #81ecec 0%, #00b894 100%)',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    gradient: 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
  },
  {
    id: 'amber',
    name: 'Amber',
    gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
  },
  {
    id: 'navy',
    name: 'Navy',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
  },
  {
    id: 'lime',
    name: 'Lime',
    gradient: 'linear-gradient(135deg, #00b894 0%, #55a3ff 100%)',
  },
  {
    id: 'magenta',
    name: 'Magenta',
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)',
  },
  {
    id: 'bronze',
    name: 'Bronze',
    gradient: 'linear-gradient(135deg, #e17055 0%, #636e72 100%)',
  },
  {
    id: 'peachy',
    name: 'Peachy',
    gradient: 'linear-gradient(135deg, #fab1a0 0%, #ffeaa7 100%)',
  },
  {
    id: 'aqua',
    name: 'Aqua',
    gradient: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)',
  },
  {
    id: 'berry',
    name: 'Berry',
    gradient: 'linear-gradient(135deg, #e84393 0%, #6c5ce7 100%)',
  },
  {
    id: 'copper',
    name: 'Copper',
    gradient: 'linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)',
  },
  {
    id: 'sage',
    name: 'Sage',
    gradient: 'linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)',
  },
  {
    id: 'plum',
    name: 'Plum',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #fd79a8 100%)',
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