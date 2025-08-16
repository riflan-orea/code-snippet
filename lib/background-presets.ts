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
    url: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  {
    id: 'grid',
    name: 'Grid',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40h39v1H0z' fill='%23ffffff' fill-opacity='0.2'/%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  {
    id: 'diagonal-lines',
    name: 'Diagonal',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-2l-40 40z'/%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  {
    id: 'hexagons',
    name: 'Hexagons',
    url: "data:image/svg+xml,%3Csvg width='56' height='28' viewBox='0 0 56 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-opacity='0.2' stroke-width='1' fill='none'%3E%3Cpath d='m28 0l14 8.1v16.2l-14 8.1-14-8.1v-16.2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'geometric'
  },
  
  // Organic patterns
  {
    id: 'bubbles',
    name: 'Bubbles',
    url: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3Ccircle cx='50' cy='50' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'organic'
  },
  {
    id: 'waves',
    name: 'Waves',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 40c13.3 0 20-13.3 20-20S26.7 0 40 0v2c-11.2 0-18 11.2-18 18s6.8 18 18 18v2z'/%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'organic'
  },
  
  // Tech patterns
  {
    id: 'circuit',
    name: 'Circuit',
    url: "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-opacity='0.2' stroke-width='1'%3E%3Crect x='0' y='0' width='40' height='40'/%3E%3Crect x='40' y='40' width='40' height='40'/%3E%3C/g%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'tech'
  },
  {
    id: 'binary',
    name: 'Binary',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ctext x='5' y='15' font-family='monospace' font-size='8'%3E01%3C/text%3E%3Ctext x='5' y='35' font-family='monospace' font-size='8'%3E10%3C/text%3E%3Ctext x='25' y='15' font-family='monospace' font-size='8'%3E11%3C/text%3E%3Ctext x='25' y='35' font-family='monospace' font-size='8'%3E00%3C/text%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'tech'
  },
  
  // Abstract patterns
  {
    id: 'triangles',
    name: 'Triangles',
    url: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-opacity='0.2' stroke-width='1' fill='none'%3E%3Cpolygon points='30 5 55 50 5 50'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    type: 'pattern',
    category: 'abstract'
  },
  {
    id: 'noise',
    name: 'Noise',
    url: "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E",
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