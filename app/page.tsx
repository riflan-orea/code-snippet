"use client";

import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
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
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Code Snippet" width={32} height={32} priority placeholder="blur" blurDataURL="/logo.svg" />
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#4F46E5"
              className="w-8 h-8 mr-3"
            >
              <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg> */}
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
              Code Snippet
            </h1>
          </div>
          {/* <a
            href="https://github.com/yourusername/code-image-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-base font-medium"
          >
            GitHub
          </a> */}
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="md:p-8 rounded-xl md:shadow-md bg-gray-800 md:border md:border-gray-700">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Label
                    htmlFor="displayTitle"
                    className="text-gray-300 font-medium mb-1"
                  >
                    Display Title (optional)
                  </Label>
                  <Input
                    id="displayTitle"
                    value={displayTitle}
                    onChange={(e) => setDisplayTitle(e.target.value)}
                    placeholder="Enter a title to display above the code"
                    className="mt-1 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="title"
                    className="text-gray-300 font-medium mb-1"
                  >
                    Window Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter window title"
                    className="mt-1 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Label
                    htmlFor="watermark"
                    className="text-gray-300 font-medium mb-1"
                  >
                    Watermark (optional)
                  </Label>
                  <Input
                    id="watermark"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    placeholder="e.g. @yourhandle or yourwebsite.com"
                    className="mt-1 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                {watermark && (
                  <div className="flex-1 flex flex-col justify-end">
                    <Label
                      htmlFor="watermarkOpacity"
                      className="text-gray-300 font-medium mb-1"
                    >
                      Watermark Opacity: {Math.round(watermarkOpacity * 100)}%
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
              </div>

              <div className="flex-1 flex flex-col w-full gap-1">
                <Label htmlFor="language" className="text-gray-300 font-medium">Programming Language</Label>
                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'javascript' | 'html' | 'go')} >
                  <SelectTrigger id="language" className="w-full bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="javascript" className="text-gray-100 hover:bg-gray-600">JavaScript</SelectItem>
                    <SelectItem value="html" className="text-gray-100 hover:bg-gray-600">HTML</SelectItem>
                    <SelectItem value="go" className="text-gray-100 hover:bg-gray-600">Go</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showLineNumbers"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-indigo-400 focus:ring-indigo-400"
                />
                <Label htmlFor="showLineNumbers" className="text-gray-300">
                  Show Line Numbers
                </Label>
              </div>

              <div className="flex flex-col gap-1 w-full overflow-auto">
                <Label
                  htmlFor="code"
                  className="text-gray-300 font-medium mb-1 block"
                >
                  Code
                </Label>
                <div
                  ref={previewRef}
                  className="overflow-hidden mb-6 rounded-xl bg-gray-900 relative mx-auto"
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

              <Button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 ml-auto cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </Button>
                
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 mt-auto flex">
        <div className="max-w-5xl mx-auto py-8 px-4">
          <p className="text-center text-gray-400 text-base">
            Code Snippet – Create beautiful code screenshots for your
            presentations and social media
          </p>
        </div>
      </footer>
    </div>
  );
}
