import { create } from "zustand";

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
  // Gradient background options
  backgroundType: "solid" | "gradient";
  setBackgroundType: (type: "solid" | "gradient") => void;
  gradientDirection: string;
  setGradientDirection: (direction: string) => void;
  gradientStartColor: string;
  setGradientStartColor: (color: string) => void;
  gradientEndColor: string;
  setGradientEndColor: (color: string) => void;
  selectedGradient: string;
  setSelectedGradient: (gradient: string) => void;
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
  // Gradient background defaults
  backgroundType: "solid",
  setBackgroundType: (backgroundType: "solid" | "gradient") => set({ backgroundType }),
  gradientDirection: "to bottom right",
  setGradientDirection: (gradientDirection: string) => set({ gradientDirection }),
  gradientStartColor: "#667eea",
  setGradientStartColor: (gradientStartColor: string) => set({ gradientStartColor }),
  gradientEndColor: "#764ba2",
  setGradientEndColor: (gradientEndColor: string) => set({ gradientEndColor }),
  selectedGradient: "custom",
  setSelectedGradient: (selectedGradient: string) => set({ selectedGradient }),
}));
