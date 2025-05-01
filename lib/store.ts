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
}));
