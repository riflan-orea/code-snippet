"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, AlignJustify, X, ArrowLeftRight, Rows3, Columns3 } from "lucide-react";
import { EditorFrame } from "@/components/editor-frame";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import html2canvas from "html2canvas";
import { useCodeImageStore } from "@/lib/store";
import {
  debounce,
  calculateEstimatedWidth,
  forceSupportedColors,
} from "@/lib/utils";
import { createGradientCSS } from "@/lib/gradients";
import Image from "next/image";
import { ControlsPanel, SupportedLanguage } from "@/components/controls-panel";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { GradientSelector } from "@/components/ui/gradient-selector";
import { ColorPicker } from "@/components/ui/color-picker";
import { BackgroundImageSelector } from "@/components/ui/background-image-selector";

function getLanguageExtension(language: 'javascript' | 'html' | 'go' | 'java' | 'dart') {
  switch (language) {
    case 'html':
      return html();
    case 'go':
      return go();
    case 'java':
      return java();
    case 'dart':
      // Dart uses JavaScript highlighting as a fallback since no official support exists
      return javascript();
    case 'javascript':
    default:
      return javascript();
  }
}

// Helper function to create background style
function createBackgroundStyle(
  backgroundType: 'solid' | 'gradient' | 'image',
  backgroundColor: string,
  selectedGradient: string,
  gradientAngle: number,
  customGradient: string,
  backgroundImage: string,
  backgroundImageOpacity: number,
  backgroundImageSize: 'cover' | 'contain' | 'auto',
  backgroundImagePosition: string
): React.CSSProperties {
  switch (backgroundType) {
    case 'gradient':
      return {
        background: createGradientCSS(selectedGradient, gradientAngle, customGradient),
        backgroundColor: 'transparent',
      };
    case 'image':
      return { 
        backgroundColor: backgroundColor,
        position: 'relative',
      };
    case 'solid':
    default:
      return { backgroundColor };
  }
}

// Simplified controls panel for comparison page - excludes inputs that don't work
function ComparisonControlsPanel() {
  const {
    showLineNumbers,
    setShowLineNumbers,
    displayTitle,
    setDisplayTitle,
    watermark,
    setWatermark,
    watermarkOpacity,
    setWatermarkOpacity,
    backgroundType,
    setBackgroundType,
    selectedGradient,
    setSelectedGradient,
    customGradient,
    setCustomGradient,
    gradientAngle,
    setGradientAngle,
    backgroundColor,
    setBackgroundColor,
    backgroundImage,
    setBackgroundImage,
    backgroundImageOpacity,
    setBackgroundImageOpacity,
    backgroundImageSize,
    setBackgroundImageSize,
    backgroundImagePosition,
    setBackgroundImagePosition,
  } = useCodeImageStore();

  return (
    <div className="space-y-6">
      {/* Watermark Text */}
      <div className="space-y-2">
        <Label htmlFor="watermark" className="text-xs font-medium text-muted-foreground">
          Watermark Text
        </Label>
        <Input
          id="watermark"
          value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
          placeholder="@yourhandle or yoursite.com"
          className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Display Title */}
      <div className="space-y-2">
        <Label htmlFor="displayTitle" className="text-xs font-medium text-muted-foreground">
          Display Title
        </Label>
        <Input
          id="displayTitle"
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
          placeholder="Optional title above comparison"
          className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Show Line Numbers */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showLineNumbers"
          checked={showLineNumbers}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowLineNumbers(e.target.checked)}
          className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary"
        />
        <Label htmlFor="showLineNumbers" className="text-sm text-gray-100">
          Show Line Numbers
        </Label>
      </div>

      {/* Background Section */}
      <div className="space-y-4">
        <Label className="text-xs font-medium text-muted-foreground">
          Background Settings
        </Label>

        {/* Background Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Background Type
          </Label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setBackgroundType('solid')}
              className={`px-3 py-2 text-xs rounded border transition-all ${
                backgroundType === 'solid'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => setBackgroundType('gradient')}
              className={`px-3 py-2 text-xs rounded border transition-all ${
                backgroundType === 'gradient'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              Gradient
            </button>
            <button
              onClick={() => setBackgroundType('image')}
              className={`px-3 py-2 text-xs rounded border transition-all ${
                backgroundType === 'image'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              Image
            </button>
          </div>
        </div>

        {/* Solid Color Options */}
        {backgroundType === 'solid' && (
          <div className="space-y-3">
            {/* Preset Colors */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Preset Colors
              </Label>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { name: 'Slate', value: '#1e293b' },
                  { name: 'Gray', value: '#374151' },
                  { name: 'Zinc', value: '#3f3f46' },
                  { name: 'Neutral', value: '#52525b' },
                  { name: 'Stone', value: '#57534e' },
                  { name: 'Red', value: '#7f1d1d' },
                  { name: 'Orange', value: '#9a3412' },
                  { name: 'Amber', value: '#92400e' },
                  { name: 'Yellow', value: '#a16207' },
                  { name: 'Lime', value: '#3f6212' },
                  { name: 'Green', value: '#14532d' },
                  { name: 'Emerald', value: '#064e3b' },
                  { name: 'Teal', value: '#134e4a' },
                  { name: 'Cyan', value: '#164e63' },
                  { name: 'Sky', value: '#0c4a6e' },
                  { name: 'Blue', value: '#1e3a8a' },
                  { name: 'Indigo', value: '#312e81' },
                  { name: 'Violet', value: '#4c1d95' },
                  { name: 'Purple', value: '#581c87' },
                  { name: 'Fuchsia', value: '#701a75' },
                  { name: 'Pink', value: '#831843' },
                  { name: 'Rose', value: '#9f1239' },
                ].map((color) => (
                  <div key={color.value} className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => setBackgroundColor(color.value)}
                      className={`w-8 h-8 rounded border transition-all ${
                        backgroundColor === color.value
                          ? 'border-primary ring-1 ring-primary'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={`Select ${color.name} background color`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <ColorPicker
              value={backgroundColor}
              onChange={setBackgroundColor}
              label="Custom Color"
            />
          </div>
        )}

        {/* Gradient Background Options */}
        {backgroundType === 'gradient' && (
          <GradientSelector
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            selectedGradient={selectedGradient}
            setSelectedGradient={setSelectedGradient}
            customGradient={customGradient}
            setCustomGradient={setCustomGradient}
            gradientAngle={gradientAngle}
            setGradientAngle={setGradientAngle}
          />
        )}

        {/* Background Image Options */}
        {backgroundType === 'image' && (
          <BackgroundImageSelector
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            backgroundImageOpacity={backgroundImageOpacity}
            setBackgroundImageOpacity={setBackgroundImageOpacity}
            backgroundImageSize={backgroundImageSize}
            setBackgroundImageSize={setBackgroundImageSize}
            backgroundImagePosition={backgroundImagePosition}
            setBackgroundImagePosition={setBackgroundImagePosition}
          />
        )}
      </div>

      {/* Watermark Opacity */}
      {watermark && (
        <div className="space-y-2">
          <Label htmlFor="watermarkOpacity" className="text-xs font-medium text-muted-foreground">
            Watermark Opacity: {Math.round(watermarkOpacity * 100)}%
          </Label>
          <Slider
            id="watermarkOpacity"
            min={0}
            max={1}
            step={0.1}
            value={[watermarkOpacity]}
            onValueChange={(value) => setWatermarkOpacity(value[0])}
            className="py-1"
          />
        </div>
      )}
    </div>
  );
}

export default function CodeComparison() {
  const {
    showLineNumbers,
    displayTitle,
    setDisplayTitle,
    watermark,
    watermarkOpacity,
    backgroundType,
    selectedGradient,
    customGradient,
    gradientAngle,
    backgroundColor,
    backgroundImage,
    backgroundImageOpacity,
    backgroundImageSize,
    backgroundImagePosition,
  } = useCodeImageStore();

  const previewRef = useRef<HTMLDivElement>(null);
  const editorFrameType = "vscode";
  const editorFrameTheme = "dark";
  const showControls = true;

  // State for left and right code snippets
  const [leftCode, setLeftCode] = useState(`// Java Example
public class Main {
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }
}`);

  const [rightCode, setRightCode] = useState(`// Dart Example
void main() {
  print(greet('World'));
}

String greet(String name) {
  return 'Hello, \$name!';
}`);

  const [leftTitle, setLeftTitle] = useState("Java");
  const [rightTitle, setRightTitle] = useState("Dart");
  const [leftLanguage, setLeftLanguage] = useState<SupportedLanguage>('java');
  const [rightLanguage, setRightLanguage] = useState<SupportedLanguage>('dart');

  // Debounce for code editors
  const debouncedSetLeftCode = debounce((value: string) => setLeftCode(value), 300);
  const debouncedSetRightCode = debounce((value: string) => setRightCode(value), 300);

  const handleLeftCodeChange = useCallback(
    (value: string) => {
      debouncedSetLeftCode(value);
    },
    [debouncedSetLeftCode]
  );

  const handleRightCodeChange = useCallback(
    (value: string) => {
      debouncedSetRightCode(value);
    },
    [debouncedSetRightCode]
  );

  // Responsive sizing for preview
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isSmallScreen = windowWidth < 768;

  const fontSize = 14;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'row' | 'column'>('row');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initial = window.innerWidth >= 768;
      setSidebarOpen(initial);
      const mq = window.matchMedia('(min-width: 768px)');
      const listener = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Set default display title for comparison page
  useEffect(() => {
    if (!displayTitle) {
      setDisplayTitle('Code Comparison');
    }
  }, [displayTitle, setDisplayTitle]);

  // Auto-switch to column layout on very small screens
  useEffect(() => {
    if (windowWidth < 640 && layoutMode === 'row') {
      // Don't auto-switch if user manually selected row mode on small screen
      // Only auto-switch on initial load or window resize
    }
  }, [windowWidth, layoutMode]);

  // Handle download
  const handleDownload = async () => {
    const container = previewRef.current;
    if (!container) return;

    try {
      const cloneContainer = container.cloneNode(true) as HTMLElement;
      cloneContainer.style.borderRadius = "0px";
      
      const backgroundStyle = createBackgroundStyle(
        backgroundType,
        backgroundColor,
        selectedGradient,
        gradientAngle,
        customGradient,
        backgroundImage,
        backgroundImageOpacity,
        backgroundImageSize,
        backgroundImagePosition
      );
      
      Object.assign(cloneContainer.style, backgroundStyle);
      
      if (backgroundType === 'image' && backgroundImage) {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundImage = `url(${backgroundImage})`;
        overlay.style.backgroundSize = backgroundImageSize;
        overlay.style.backgroundPosition = backgroundImagePosition;
        overlay.style.backgroundRepeat = 'repeat';
        overlay.style.opacity = backgroundImageOpacity.toString();
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '-1';
        cloneContainer.style.position = 'relative';
        cloneContainer.insertBefore(overlay, cloneContainer.firstChild);
      }
      
      cloneContainer.style.position = "fixed";
      cloneContainer.style.left = "-9999px";
      cloneContainer.style.top = "0";
      cloneContainer.style.zIndex = "9999";
      cloneContainer.style.width = `${container.offsetWidth}px`;
      cloneContainer.style.height = `${container.offsetHeight}px`;

      forceSupportedColors(cloneContainer);
      document.body.appendChild(cloneContainer);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const canvas = await html2canvas(cloneContainer, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      document.body.removeChild(cloneContainer);
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `code-comparison-${new Date().getTime()}.png`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const mainBackgroundStyle = createBackgroundStyle(
    backgroundType,
    backgroundColor,
    selectedGradient,
    gradientAngle,
    customGradient,
    backgroundImage,
    backgroundImageOpacity,
    backgroundImageSize,
    backgroundImagePosition
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-card/50 z-10 border-b-gray-800 border-b">
        <div className="px-4 md:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Code Snippet" width={28} height={28} priority placeholder="blur" blurDataURL="/logo.svg" />
            <h1 className="text-lg md:text-xl font-semibold text-foreground">
              Syntax Comparison
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                Single View
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayoutMode(layoutMode === 'row' ? 'column' : 'row')}
              className="inline-flex items-center gap-2"
              title={`Switch to ${layoutMode === 'row' ? 'column' : 'row'} layout`}
            >
              {layoutMode === 'row' ? <Rows3 className="w-4 h-4" /> : <Columns3 className="w-4 h-4" />}
              <span className="hidden sm:inline">{layoutMode === 'row' ? 'Column' : 'Row'}</span>
            </Button>
            <Button
              onClick={handleDownload}
              className="inline-flex items-center gap-2"
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2 md:hidden"
              aria-label="Open settings"
            >
              <AlignJustify className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas */}
        <main className="flex-1 bg-muted/20 overflow-hidden relative">
          <div className="h-full flex flex-col">
            {/* Canvas Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div className="flex items-center justify-center min-h-full">
                <div className={`w-full ${layoutMode === 'column' ? 'max-w-4xl' : 'max-w-7xl'}`}>
                  <div
                    ref={previewRef}
                    className="overflow-hidden rounded-xl bg-gray-900 relative mx-auto shadow-2xl max-w-full"
                    style={{
                      minHeight: "400px",
                      padding: layoutMode === 'column' ? "32px" : "40px",
                      ...mainBackgroundStyle,
                      "--background": backgroundColor,
                      "--foreground": "#f9fafb",
                      "--card": backgroundColor,
                      "--card-foreground": "#f9fafb",
                      "--popover": backgroundColor,
                      "--popover-foreground": "#f9fafb",
                      "--primary": "#4F46E5",
                      "--primary-foreground": "#fff",
                      "--border": "#22223b",
                      "--input": "#22223b",
                    } as React.CSSProperties}
                  >
                    {/* Background image overlay */}
                    {backgroundType === 'image' && backgroundImage && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `url(${backgroundImage})`,
                          backgroundSize: backgroundImageSize,
                          backgroundPosition: backgroundImagePosition,
                          backgroundRepeat: 'repeat',
                          opacity: backgroundImageOpacity,
                          zIndex: 1,
                        }}
                      />
                    )}
                    
                    <div className="relative z-10">
                      {displayTitle && (
                        <div
                          className="mb-6 font-bold text-white text-center text-2xl"
                          style={{ fontSize: `${fontSize + 8}px` }}
                        >
                          {displayTitle}
                        </div>
                      )}
                      
                      {/* Comparison Layout */}
                      <div className={`grid ${
                        layoutMode === 'row' 
                          ? 'gap-6 grid-cols-1 lg:grid-cols-2' 
                          : 'gap-4 grid-cols-1'
                      }`}>
                        {/* Left Code Block */}
                        <div className="space-y-2">
                          <EditorFrame
                            type={editorFrameType}
                            theme={editorFrameTheme}
                            title={leftTitle}
                            showControls={showControls}
                          >
                            <div
                              className="rounded-md overflow-hidden"
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              <div style={{ backgroundColor: "#282c34" }}>
                                <CodeMirror
                                  value={leftCode}
                                  extensions={[getLanguageExtension(leftLanguage)]}
                                  theme={vscodeDark}
                                  onChange={handleLeftCodeChange}
                                  basicSetup={{
                                    lineNumbers: showLineNumbers,
                                    highlightActiveLineGutter: false,
                                    highlightSpecialChars: true,
                                    foldGutter: false,
                                    dropCursor: false,
                                    allowMultipleSelections: false,
                                    indentOnInput: false,
                                    syntaxHighlighting: true,
                                    bracketMatching: false,
                                    closeBrackets: false,
                                    autocompletion: false,
                                    rectangularSelection: false,
                                    crosshairCursor: false,
                                    highlightActiveLine: false,
                                    highlightSelectionMatches: false,
                                    closeBracketsKeymap: false,
                                    searchKeymap: false,
                                    foldKeymap: false,
                                    completionKeymap: false,
                                    lintKeymap: false,
                                  }}
                                />
                              </div>
                            </div>
                          </EditorFrame>
                        </div>

                        {/* Right Code Block */}
                        <div className="space-y-2">
                          <EditorFrame
                            type={editorFrameType}
                            theme={editorFrameTheme}
                            title={rightTitle}
                            showControls={showControls}
                          >
                            <div
                              className="rounded-md overflow-hidden"
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              <div style={{ backgroundColor: "#282c34" }}>
                                <CodeMirror
                                  value={rightCode}
                                  extensions={[getLanguageExtension(rightLanguage)]}
                                  theme={vscodeDark}
                                  onChange={handleRightCodeChange}
                                  basicSetup={{
                                    lineNumbers: showLineNumbers,
                                    highlightActiveLineGutter: false,
                                    highlightSpecialChars: true,
                                    foldGutter: false,
                                    dropCursor: false,
                                    allowMultipleSelections: false,
                                    indentOnInput: false,
                                    syntaxHighlighting: true,
                                    bracketMatching: false,
                                    closeBrackets: false,
                                    autocompletion: false,
                                    rectangularSelection: false,
                                    crosshairCursor: false,
                                    highlightActiveLine: false,
                                    highlightSelectionMatches: false,
                                    closeBracketsKeymap: false,
                                    searchKeymap: false,
                                    foldKeymap: false,
                                    completionKeymap: false,
                                    lintKeymap: false,
                                  }}
                                />
                              </div>
                            </div>
                          </EditorFrame>
                        </div>
                      </div>

                      {watermark && (
                        <div
                          className="absolute bottom-2 right-4 font-medium text-white z-20"
                          style={{
                            opacity: watermarkOpacity,
                            fontSize: `${fontSize * 0.8}px`,
                            textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                          }}
                        >
                          {watermark}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar (Desktop) */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} hidden md:block transition-all duration-200 bg-card/50 backdrop-blur-sm overflow-hidden border-gray-800 border-l`}>
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Layout & Language Settings</h3>
                
                {/* Layout Toggle */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Layout Mode
                  </Label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setLayoutMode('row')}
                      className={`px-3 py-2 text-xs rounded border transition-all flex items-center justify-center gap-2 ${
                        layoutMode === 'row'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <Columns3 className="w-3 h-3" />
                      Row
                    </button>
                    <button
                      onClick={() => setLayoutMode('column')}
                      className={`px-3 py-2 text-xs rounded border transition-all flex items-center justify-center gap-2 ${
                        layoutMode === 'column'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <Rows3 className="w-3 h-3" />
                      Column
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="leftLanguage" className="text-xs font-medium text-muted-foreground">
                      Left Language
                    </Label>
                    <Select value={leftLanguage} onValueChange={(value) => setLeftLanguage(value as SupportedLanguage)}>
                      <SelectTrigger id="leftLanguage" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="javascript" className="text-gray-100 hover:bg-gray-700">JavaScript</SelectItem>
                        <SelectItem value="html" className="text-gray-100 hover:bg-gray-700">HTML</SelectItem>
                        <SelectItem value="go" className="text-gray-100 hover:bg-gray-700">Go</SelectItem>
                        <SelectItem value="java" className="text-gray-100 hover:bg-gray-700">Java</SelectItem>
                        <SelectItem value="dart" className="text-gray-100 hover:bg-gray-700">Dart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rightLanguage" className="text-xs font-medium text-muted-foreground">
                      Right Language
                    </Label>
                    <Select value={rightLanguage} onValueChange={(value) => setRightLanguage(value as SupportedLanguage)}>
                      <SelectTrigger id="rightLanguage" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="javascript" className="text-gray-100 hover:bg-gray-700">JavaScript</SelectItem>
                        <SelectItem value="html" className="text-gray-100 hover:bg-gray-700">HTML</SelectItem>
                        <SelectItem value="go" className="text-gray-100 hover:bg-gray-700">Go</SelectItem>
                        <SelectItem value="java" className="text-gray-100 hover:bg-gray-700">Java</SelectItem>
                        <SelectItem value="dart" className="text-gray-100 hover:bg-gray-700">Dart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="leftTitle" className="text-xs font-medium text-muted-foreground">
                      Left Window Title
                    </Label>
                    <Input
                      id="leftTitle"
                      value={leftTitle}
                      onChange={(e) => setLeftTitle(e.target.value)}
                      placeholder="Left window title"
                      className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rightTitle" className="text-xs font-medium text-muted-foreground">
                      Right Window Title
                    </Label>
                    <Input
                      id="rightTitle"
                      value={rightTitle}
                      onChange={(e) => setRightTitle(e.target.value)}
                      placeholder="Right window title"
                      className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
              
              {/* Simplified Controls Panel - excluding title and language inputs that don't work */}
              <ComparisonControlsPanel />
            </div>
          </div>
        </aside>

        {/* Mobile Settings Portal */}
        {sidebarOpen && typeof window !== 'undefined' && createPortal(
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute inset-x-4 top-4 bottom-4 rounded-2xl border border-gray-800 bg-card shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
                <span className="text-sm font-medium text-muted-foreground">Settings</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md bg-gray-800/60 border border-gray-700 hover:bg-gray-700"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4 text-gray-200" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Layout & Language Settings</h3>
                  
                  {/* Layout Toggle */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Layout Mode
                    </Label>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setLayoutMode('row')}
                        className={`px-3 py-2 text-xs rounded border transition-all flex items-center justify-center gap-2 ${
                          layoutMode === 'row'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <Columns3 className="w-3 h-3" />
                        Row
                      </button>
                      <button
                        onClick={() => setLayoutMode('column')}
                        className={`px-3 py-2 text-xs rounded border transition-all flex items-center justify-center gap-2 ${
                          layoutMode === 'column'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <Rows3 className="w-3 h-3" />
                        Column
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="leftLanguageMobile" className="text-xs font-medium text-muted-foreground">
                        Left Language
                      </Label>
                      <Select value={leftLanguage} onValueChange={(value) => setLeftLanguage(value as SupportedLanguage)}>
                        <SelectTrigger id="leftLanguageMobile" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="javascript" className="text-gray-100 hover:bg-gray-700">JavaScript</SelectItem>
                          <SelectItem value="html" className="text-gray-100 hover:bg-gray-700">HTML</SelectItem>
                          <SelectItem value="go" className="text-gray-100 hover:bg-gray-700">Go</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rightLanguageMobile" className="text-xs font-medium text-muted-foreground">
                        Right Language
                      </Label>
                      <Select value={rightLanguage} onValueChange={(value) => setRightLanguage(value as SupportedLanguage)}>
                        <SelectTrigger id="rightLanguageMobile" className="text-sm bg-gray-800 border-gray-700 text-gray-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="javascript" className="text-gray-100 hover:bg-gray-700">JavaScript</SelectItem>
                          <SelectItem value="html" className="text-gray-100 hover:bg-gray-700">HTML</SelectItem>
                          <SelectItem value="go" className="text-gray-100 hover:bg-gray-700">Go</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="leftTitleMobile" className="text-xs font-medium text-muted-foreground">
                        Left Window Title
                      </Label>
                      <Input
                        id="leftTitleMobile"
                        value={leftTitle}
                        onChange={(e) => setLeftTitle(e.target.value)}
                        placeholder="Left window title"
                        className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rightTitleMobile" className="text-xs font-medium text-muted-foreground">
                        Right Window Title
                      </Label>
                      <Input
                        id="rightTitleMobile"
                        value={rightTitle}
                        onChange={(e) => setRightTitle(e.target.value)}
                        placeholder="Right window title"
                        className="text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
                
                <ComparisonControlsPanel />
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
