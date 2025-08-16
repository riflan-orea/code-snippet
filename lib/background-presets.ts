export interface BackgroundPreset {
  id: string;
  name: string;
  url: string;
  type: 'pattern' | 'image';
  category: 'geometric' | 'organic' | 'tech' | 'abstract';
}

export const backgroundPresets: BackgroundPreset[] = [
  // Geometric patterns
  {
    id: 'dots',
    name: 'Dots',
    url: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  {
    id: 'grid',
    name: 'Grid',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='m0 40h40v-40h-40z'/%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  {
    id: 'diagonal-lines',
    name: 'Diagonal',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  {
    id: 'hexagons',
    name: 'Hexagons',
    url: "data:image/svg+xml,%3Csvg width='56' height='28' viewBox='0 0 56 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='m28 0l14 8.1v16.2l-14 8.1-14-8.1v-16.2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  
  // Organic patterns
  {
    id: 'bubbles',
    name: 'Bubbles',
    url: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3Ccircle cx='50' cy='50' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'organic'
  },
  {
    id: 'waves',
    name: 'Waves',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40c13.3 0 20-13.3 20-20S26.7 0 40 0v40z'/%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'organic'
  },
  
  // Tech patterns
  {
    id: 'circuit',
    name: 'Circuit',
    url: "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3Ccircle cx='60' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'tech'
  },
  {
    id: 'binary',
    name: 'Binary',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ctext x='5' y='15' font-family='monospace' font-size='8'%3E01%3C/text%3E%3Ctext x='5' y='35' font-family='monospace' font-size='8'%3E10%3C/text%3E%3Ctext x='25' y='15' font-family='monospace' font-size='8'%3E11%3C/text%3E%3Ctext x='25' y='35' font-family='monospace' font-size='8'%3E00%3C/text%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'tech'
  },
  
  // Abstract patterns
  {
    id: 'triangles',
    name: 'Triangles',
    url: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpolygon points='30 0 60 52 0 52'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'abstract'
  },
  {
    id: 'noise',
    name: 'Noise',
    url: "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E",
    type: 'pattern',
    category: 'abstract'
  }
];

export function getBackgroundPresetsByCategory(category: string): BackgroundPreset[] {
  return backgroundPresets.filter(preset => preset.category === category);
}

export function getBackgroundPresetById(id: string): BackgroundPreset | undefined {
  return backgroundPresets.find(preset => preset.id === id);
}