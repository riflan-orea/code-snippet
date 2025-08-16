import { create } from "zustand";

export interface GradientPreset {
  id: string;
  name: string;
  gradient: string;
  angle?: number;
}

interface CodeImageState {
  code: string;
  setCode: (code: string) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (show: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  displayTitle: string;
  setDisplayTitle: (title: string) => void;
  watermark: string;
  setWatermark: (watermark: string) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (opacity: number) => void;
  backgroundType: 'solid' | 'gradient' | 'image';
  setBackgroundType: (type: 'solid' | 'gradient' | 'image') => void;
  selectedGradient: string;
  setSelectedGradient: (gradient: string) => void;
  customGradient: string;
  setCustomGradient: (gradient: string) => void;
  gradientAngle: number;
  setGradientAngle: (angle: number) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  backgroundImageOpacity: number;
  setBackgroundImageOpacity: (opacity: number) => void;
  backgroundImageSize: 'cover' | 'contain' | 'auto';
  setBackgroundImageSize: (size: 'cover' | 'contain' | 'auto') => void;
  backgroundImagePosition: string;
  setBackgroundImagePosition: (position: string) => void;
}

export const useCodeImageStore = create<CodeImageState>((set) => ({
  code:
    `// JavaScript Example\nfunction greet(name) {\n  return ` +
    "`Hello, " +
    "${name}!`" +
    `;\n}\nconsole.log(greet('World'));`,
  setCode: (code) => set({ code }),
  showLineNumbers: true,
  setShowLineNumbers: (show) => set({ showLineNumbers: show }),
  title: "",
  setTitle: (title) => set({ title }),
  displayTitle: "",
  setDisplayTitle: (displayTitle) => set({ displayTitle }),
  watermark: "",
  setWatermark: (watermark) => set({ watermark }),
  watermarkOpacity: 0.5,
  setWatermarkOpacity: (opacity) => set({ watermarkOpacity: opacity }),
  backgroundType: 'solid',
  setBackgroundType: (type: 'solid' | 'gradient' | 'image') => set({ backgroundType: type }),
  selectedGradient: 'ocean',
  setSelectedGradient: (gradient: string) => set({ selectedGradient: gradient }),
  customGradient: '',
  setCustomGradient: (gradient: string) => set({ customGradient: gradient }),
  gradientAngle: 45,
  setGradientAngle: (angle: number) => set({ gradientAngle: angle }),
  backgroundColor: '#374151',
  setBackgroundColor: (color: string) => set({ backgroundColor: color }),
  backgroundImage: '',
  setBackgroundImage: (image: string) => set({ backgroundImage: image }),
  backgroundImageOpacity: 1,
  setBackgroundImageOpacity: (opacity: number) => set({ backgroundImageOpacity: opacity }),
  backgroundImageSize: 'cover',
  setBackgroundImageSize: (size: 'cover' | 'contain' | 'auto') => set({ backgroundImageSize: size }),
  backgroundImagePosition: 'center',
  setBackgroundImagePosition: (position: string) => set({ backgroundImagePosition: position }),
}));
