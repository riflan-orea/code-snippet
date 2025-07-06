"use client";

import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Settings, Code, Palette, Type, Image as ImageIcon } from "lucide-react";
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import Image from "next/image";

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

  // Carbon-style: dynamic width based on longest line, min 600px, max 1000px
  const minWidth = 600;
  const maxWidth = 1000;
  const carbonMaxHeight = 900;
  const carbonPadding = 40;
  // Calculate width based on longest line
  const estimatedWidth = calculateEstimatedWidth(
    code,
    minWidth,
    maxWidth,
    carbonPadding
  );

  const fontSize = 14;

  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'html' | 'go'>('javascript');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle download
  const handleDownload = async () => {
    const container = previewRef.current;
    if (!container) return;

    try {
      // Create a clone of the container to modify for export
      const cloneContainer = container.cloneNode(true) as HTMLElement;

      // Set border radius to 0 for export
      cloneContainer.style.borderRadius = "0px";
      // Set background color to match preview
      cloneContainer.style.background = "#111827";
      cloneContainer.style.backgroundColor = "#111827";
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

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="border-b border-border bg-card shadow-sm z-10">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Code Snippet" width={28} height={28} priority placeholder="blur" blurDataURL="/logo.svg" />
            <h1 className="text-xl font-semibold text-foreground">
              Code Snippet
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-200 border-r border-border bg-card/50 backdrop-blur-sm overflow-hidden`}>
          <div className="p-4 space-y-6 h-full overflow-y-auto">
            
            {/* Content Section */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayTitle" className="text-xs font-medium text-muted-foreground">
                    Display Title
                  </Label>
                  <Input
                    id="displayTitle"
                    value={displayTitle}
                    onChange={(e) => setDisplayTitle(e.target.value)}
                    placeholder="Optional title above code"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-medium text-muted-foreground">
                    Window Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Window title"
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language Section */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-xs font-medium text-muted-foreground">
                    Programming Language
                  </Label>
                  <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'javascript' | 'html' | 'go')}>
                    <SelectTrigger id="language" className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="showLineNumbers"
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="showLineNumbers" className="text-sm">
                    Show Line Numbers
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Watermark Section */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Watermark
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="watermark" className="text-xs font-medium text-muted-foreground">
                    Watermark Text
                  </Label>
                  <Input
                    id="watermark"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    placeholder="@yourhandle or yoursite.com"
                    className="text-sm"
                  />
                </div>
                {watermark && (
                  <div className="space-y-2">
                    <Label htmlFor="watermarkOpacity" className="text-xs font-medium text-muted-foreground">
                      Opacity: {Math.round(watermarkOpacity * 100)}%
                    </Label>
                    <Slider
                      id="watermarkOpacity"
                      min={0.1}
                      max={1}
                      step={0.1}
                      value={[watermarkOpacity]}
                      onValueChange={(value) => setWatermarkOpacity(value[0])}
                      className="py-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 bg-muted/20 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Canvas Header */}
            <div className="px-6 py-4 border-b border-border bg-card/30 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Canvas</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {estimatedWidth} × {carbonMaxHeight}px
                </div>
              </div>
            </div>

            {/* Canvas Content */}
            <div className="flex-1 overflow-auto p-8">
              <div className="flex items-center justify-center min-h-full">
                <div className="w-full max-w-6xl">
                  <div
                    ref={previewRef}
                    className="overflow-hidden rounded-xl bg-gray-900 relative mx-auto shadow-2xl"
                    style={
                      {
                        width: `${estimatedWidth}px`,
                        minHeight: "120px",
                        maxHeight: `${carbonMaxHeight}px`,
                        padding: `${carbonPadding}px`,
                        background: "#111827",
                        "--background": "#111827",
                        "--foreground": "#f9fafb",
                        "--card": "#111827",
                        "--card-foreground": "#f9fafb",
                        "--popover": "#111827",
                        "--popover-foreground": "#f9fafb",
                        "--primary": "#4F46E5",
                        "--primary-foreground": "#fff",
                        "--border": "#22223b",
                        "--input": "#22223b",
                      } as React.CSSProperties
                    }
                  >
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
                        className="absolute bottom-2 right-4 font-medium text-white"
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
        </main>
      </div>
    </div>
  );
}
