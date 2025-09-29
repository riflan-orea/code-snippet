"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, AlignJustify, X, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { EditorFrame } from "@/components/editor-frame";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { StreamLanguage } from "@codemirror/language";
import { swift } from "@codemirror/legacy-modes/mode/swift";
import { kotlin } from "@codemirror/legacy-modes/mode/clike";
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

function getLanguageExtension(language: 'javascript' | 'html' | 'go' | 'java' | 'dart' | 'kotlin' | 'swift' | 'php') {
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
    case 'kotlin':
      return StreamLanguage.define(kotlin);
    case 'swift':
      return StreamLanguage.define(swift);
    case 'php':
      return php();
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
      // For images, we only set the fallback color here
      // The actual image will be rendered as an overlay for opacity control
      return { 
        backgroundColor: backgroundColor,
        position: 'relative',
      };
    case 'solid':
    default:
      return { backgroundColor };
  }
}

export default function CodeImageGenerator() {
  const {
    code,
    setCode,
    showLineNumbers,
    setShowLineNumbers,
    title,
    setTitle,
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
  const previewRef = useRef<HTMLDivElement>(null);
  const editorFrameType = "vscode";
  const editorFrameTheme = "dark";
  const showControls = true;

  // Debounce for code editor
  const debouncedSetCode = debounce((value: string) => setCode(value), 300);
  const handleCodeChange = useCallback(
    (value: string) => {
      debouncedSetCode(value);
    },
    [debouncedSetCode]
  );

  // Responsive sizing for preview
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isSmallScreen = windowWidth < 768;

  // Carbon-style: dynamic width based on longest line, responsive for mobile
  const baseMinWidth = 600;
  const smallScreenMinWidth = 280;
  const carbonMaxHeight = 900;
  const carbonPadding = 40;
  const responsiveMinWidth = isSmallScreen ? smallScreenMinWidth : baseMinWidth;
  const viewportMaxWidth = Math.max(320, windowWidth - carbonPadding * 2);
  const responsiveMaxWidth = isSmallScreen ? Math.min(1000, viewportMaxWidth) : 1000;
  const estimatedWidth = calculateEstimatedWidth(
    code,
    responsiveMinWidth,
    responsiveMaxWidth,
    carbonPadding
  );

  const fontSize = 14;

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('javascript');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Handle download
  const handleDownload = async () => {
    const container = previewRef.current;
    if (!container) return;

    try {
      // Create a clone of the container to modify for export
      const cloneContainer = container.cloneNode(true) as HTMLElement;

      // Set border radius to 0 for export
      cloneContainer.style.borderRadius = "0px";
      
      // Set background to match preview
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
      
      // Handle image background opacity
      if (backgroundType === 'image' && backgroundImage) {
        // Create a pseudo-element overlay for opacity
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
      
      // Add extra bottom padding to the code area for screenshot
      const cmContent = cloneContainer.querySelector('.cm-content');
      if (cmContent) {
        (cmContent as HTMLElement).style.paddingBottom = '10px';
        // Add a dummy div to ensure padding is visible in screenshot
        const dummyDiv = document.createElement('div');
        dummyDiv.style.height = '10px';
        dummyDiv.style.pointerEvents = 'none';
        dummyDiv.style.background = 'transparent';
        cmContent.appendChild(dummyDiv);
      }
      // Ensure the clone is visible and rendered
      cloneContainer.style.position = "fixed";
      cloneContainer.style.left = "-9999px";
      cloneContainer.style.top = "0";
      cloneContainer.style.zIndex = "9999";
      // Match width and height
      cloneContainer.style.width = `${container.offsetWidth}px`;
      cloneContainer.style.height = `${container.offsetHeight}px`;

      // Recursively force supported background and text colors on all descendants
      forceSupportedColors(cloneContainer);

      document.body.appendChild(cloneContainer);

      // Wait for the browser to render the clone
      await new Promise((resolve) => setTimeout(resolve, 50));

      const canvas = await html2canvas(cloneContainer, {
        scale: 2, // Higher resolution
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      // Remove the clone
      document.body.removeChild(cloneContainer);

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `code-${new Date().getTime()}.png`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      // Remove the link after a short delay to ensure download
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // Create the main background style
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
    <div className="h-screen flex flex-col overflow-hidden" >
      {/* Top Bar */}
      <header className="bg-card/50 z-10 border-b-gray-800 border-b">
        <div className="px-4 md:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Code Snippet" width={28} height={28} priority placeholder="blur" blurDataURL="/logo.svg" />
            <h1 className="text-lg md:text-xl font-semibold text-foreground">
              Code Snippet
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/comparison">
              <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </Button>
            </Link>
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
            {/* Canvas Header */}
            <div className=" absolute top-2 right-2 z-10">
              <div className="hidden md:flex items-center gap-2">
                {/* Settings button removed for desktop view */}
              </div>
            </div>

            {/* Canvas Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div className="flex items-center justify-center min-h-full">
                <div className="w-full max-w-6xl">
                  <div
                    ref={previewRef}
                    className="overflow-hidden rounded-xl bg-gray-900 relative mx-auto shadow-2xl max-w-full"
                    style={{
                      width: `${estimatedWidth}px`,
                      minHeight: "120px",
                      maxHeight: `${carbonMaxHeight}px`,
                      padding: `${carbonPadding}px`,
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
                    {/* Background image overlay for opacity control */}
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
                          className="mb-4 font-medium text-white text-center"
                          style={{ fontSize: `${fontSize + 2}px` }}
                        >
                          {displayTitle}
                        </div>
                      )}
                      <div>
                        <EditorFrame
                          type={editorFrameType}
                          theme={editorFrameTheme}
                          title={title}
                          showControls={showControls}
                        >
                          <div
                            className="rounded-md overflow-hidden"
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            <div style={{ backgroundColor: "#282c34" }}>
                              <CodeMirror
                                value={code}
                                extensions={[getLanguageExtension(selectedLanguage)]}
                                theme={vscodeDark}
                                onChange={handleCodeChange}
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
          <ControlsPanel selectedLanguage={selectedLanguage} onSelectedLanguageChange={setSelectedLanguage} />
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
              <div className="flex-1 overflow-y-auto min-h-0">
                <ControlsPanel selectedLanguage={selectedLanguage} onSelectedLanguageChange={setSelectedLanguage} />
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
