"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, AlignJustify, X, ArrowLeftRight } from "lucide-react";
import { EditorFrame } from "@/components/editor-frame";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { go } from "@codemirror/lang-go";
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

function getLanguageExtension(language: 'javascript' | 'html' | 'go') {
  switch (language) {
    case 'html':
      return html();
    case 'go':
      return go();
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

export default function CodeComparison() {
  const {
    showLineNumbers,
    displayTitle,
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
  const [leftCode, setLeftCode] = useState(`// Erlang
-module(hello_module).
-export([some_fun/0, some_fun/1]).

% A "Hello world" function
some_fun() ->
    io:format("~s~n", ["Hello world!"]).

% This one works only with Lists
some_fun(List) when is_list(List) ->
    io:format("~s~n", List).

% Non-exported functions are private
priv() ->
    secret_info.`);

  const [rightCode, setRightCode] = useState(`# Elixir
defmodule Hello do
  # A "Hello world" function
  def some_fun do
    IO.puts "Hello world!"
  end

  # This one works only with Lists
  def some_fun(list) when is_list(list) do
    IO.inspect list
  end

  # A private function
  defp priv do
    :secret_info
  end
end`);

  const [leftTitle, setLeftTitle] = useState("Erlang");
  const [rightTitle, setRightTitle] = useState("Elixir");
  const [leftLanguage, setLeftLanguage] = useState<SupportedLanguage>('javascript');
  const [rightLanguage, setRightLanguage] = useState<SupportedLanguage>('javascript');

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
                <div className="w-full max-w-7xl">
                  <div
                    ref={previewRef}
                    className="overflow-hidden rounded-xl bg-gray-900 relative mx-auto shadow-2xl max-w-full"
                    style={{
                      minHeight: "400px",
                      padding: "40px",
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
                          Syntax Comparison
                        </div>
                      )}
                      
                      {/* Comparison Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Code Block */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold text-lg">{leftTitle}</h3>
                            <div className="text-xs text-gray-400">Influenced by Prolog and Smalltalk</div>
                          </div>
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
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold text-lg">{rightTitle}</h3>
                            <div className="text-xs text-gray-400">Influenced by Ruby and Clojure</div>
                          </div>
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
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Language Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Left Language</label>
                  <select
                    value={leftLanguage}
                    onChange={(e) => setLeftLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="go">Go</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Right Language</label>
                  <select
                    value={rightLanguage}
                    onChange={(e) => setRightLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Left Title</label>
                  <input
                    type="text"
                    value={leftTitle}
                    onChange={(e) => setLeftTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    placeholder="Left code title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Right Title</label>
                  <input
                    type="text"
                    value={rightTitle}
                    onChange={(e) => setRightTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                    placeholder="Right code title"
                  />
                </div>
              </div>
            </div>
            
            <ControlsPanel selectedLanguage={leftLanguage} onSelectedLanguageChange={() => {}} />
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
                  <h3 className="text-sm font-medium text-muted-foreground">Language Settings</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Left Language</label>
                      <select
                        value={leftLanguage}
                        onChange={(e) => setLeftLanguage(e.target.value as SupportedLanguage)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="html">HTML</option>
                        <option value="go">Go</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Right Language</label>
                      <select
                        value={rightLanguage}
                        onChange={(e) => setRightLanguage(e.target.value as SupportedLanguage)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="html">HTML</option>
                        <option value="go">Go</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Left Title</label>
                      <input
                        type="text"
                        value={leftTitle}
                        onChange={(e) => setLeftTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                        placeholder="Left code title"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Right Title</label>
                      <input
                        type="text"
                        value={rightTitle}
                        onChange={(e) => setRightTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                        placeholder="Right code title"
                      />
                    </div>
                  </div>
                </div>
                
                <ControlsPanel selectedLanguage={leftLanguage} onSelectedLanguageChange={() => {}} />
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}