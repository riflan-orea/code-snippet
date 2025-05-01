"use client";

import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, Settings } from "lucide-react";
import { EditorFrame } from "@/components/code-editor-frame";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import html2canvas from "html2canvas";

export default function CodeImageGenerator() {
  const [code, setCode] = useState(
    `// JavaScript Example\nfunction greet(name) {\n  return ` +
      "`Hello, " +
      "${name}!`" +
      `;\n}\nconsole.log(greet('World'));`
  );
  const [fontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [title, setTitle] = useState("");
  const [displayTitle, setDisplayTitle] = useState("");
  const [watermark, setWatermark] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorFrameType = "vscode";
  const editorFrameTheme = "dark";
  const showControls = true;

  // Debounce for code editor
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleCodeChange = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCode(value);
    }, 300);
  }, []);

  // Carbon-style: fixed width, auto height, max 900px
  const carbonWidth = 600;
  const carbonMaxHeight = 900;
  const carbonPadding = 40;

  // Auto-resize code editor height based on content
  const [editorHeight, setEditorHeight] = useState(200);
  const codeLineCount = code.split("\n").length;
  useLayoutEffect(() => {
    // Each line is about 24px (fontSize 14 + padding/margin), clamp to preview
    const min = 120;
    const max = carbonMaxHeight - carbonPadding * 2 - 60; // leave space for title/watermark
    const ideal = codeLineCount * 24 + 32;
    setEditorHeight(Math.max(min, Math.min(max, ideal)));
  }, [code]);

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
      // Ensure the clone is visible and rendered
      cloneContainer.style.position = "fixed";
      cloneContainer.style.left = "-9999px";
      cloneContainer.style.top = "0";
      cloneContainer.style.zIndex = "9999";
      // Match width and height
      cloneContainer.style.width = `${container.offsetWidth}px`;
      cloneContainer.style.height = `${container.offsetHeight}px`;

      // Recursively force supported background and text colors on all descendants
      function forceSupportedColors(node: Element) {
        if (node.nodeType !== 1) return;
        const el = node as HTMLElement;
        // Only override if computed style uses oklch or is transparent
        const computed = window.getComputedStyle(el);
        if (
          computed.backgroundColor.includes("oklch") ||
          computed.backgroundColor === "transparent"
        ) {
          el.style.backgroundColor = "#111827";
        }
        if (computed.color.includes("oklch")) {
          el.style.color = "#f9fafb";
        }
        Array.from(el.children).forEach(forceSupportedColors);
      }
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

  // Handle copy to clipboard
  const handleCopy = async () => {
    const container = previewRef.current;
    if (!container) return;

    try {
      // Create a clone of the container to modify for export
      const cloneContainer = container.cloneNode(true) as HTMLElement;

      // Set border radius to 0 for export
      cloneContainer.style.borderRadius = "0px";

      // Temporarily add to document (hidden) for html2canvas to work
      cloneContainer.style.position = "absolute";
      cloneContainer.style.left = "-9999px";
      document.body.appendChild(cloneContainer);

      const canvas = await html2canvas(cloneContainer, {
        scale: 2, // Higher resolution
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      // Remove the clone
      document.body.removeChild(cloneContainer);

      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create a ClipboardItem
        const item = new ClipboardItem({ "image/png": blob });

        // Copy to clipboard
        navigator.clipboard
          .write([item])
          .then(() => alert("Image copied to clipboard!"))
          .catch((err) => console.error("Failed to copy image: ", err));
      });
    } catch (error) {
      console.error("Error copying image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#4F46E5"
              className="w-8 h-8 mr-3"
            >
              <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Code Image Generator
            </h1>
          </div>
          <a
            href="https://github.com/yourusername/code-image-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-base font-medium"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex flex-col gap-10">
          <Card className="p-8 rounded-xl shadow-md bg-white border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
              <Settings className="w-5 h-5 text-indigo-500" />
              Code Input
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Label
                    htmlFor="displayTitle"
                    className="text-gray-700 font-medium mb-1"
                  >
                    Display Title (optional)
                  </Label>
                  <Input
                    id="displayTitle"
                    value={displayTitle}
                    onChange={(e) => setDisplayTitle(e.target.value)}
                    placeholder="Enter a title to display above the code"
                    className="mt-1 rounded-lg border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="title"
                    className="text-gray-700 font-medium mb-1"
                  >
                    Window Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter window title"
                    className="mt-1 rounded-lg border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showLineNumbers"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded border-gray-300 focus:ring-indigo-400"
                />
                <Label htmlFor="showLineNumbers" className="text-gray-700">
                  Show Line Numbers
                </Label>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Label
                    htmlFor="watermark"
                    className="text-gray-700 font-medium mb-1"
                  >
                    Watermark (optional)
                  </Label>
                  <Input
                    id="watermark"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    placeholder="e.g. @yourhandle or yourwebsite.com"
                    className="mt-1 rounded-lg border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                {watermark && (
                  <div className="flex-1 flex flex-col justify-end">
                    <Label
                      htmlFor="watermarkOpacity"
                      className="text-gray-700 font-medium mb-1"
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
              <div>
                <Label
                  htmlFor="code"
                  className="text-gray-700 font-medium mb-1 block"
                >
                  Code
                </Label>
                <div
                  ref={editorRef}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <CodeMirror
                    value={code}
                    height="300px"
                    extensions={[javascript()]}
                    onChange={handleCodeChange}
                    theme={vscodeDark}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: true,
                      highlightSpecialChars: true,
                      foldGutter: true,
                      dropCursor: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      syntaxHighlighting: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      rectangularSelection: true,
                      crosshairCursor: true,
                      highlightActiveLine: true,
                      highlightSelectionMatches: true,
                      closeBracketsKeymap: true,
                      searchKeymap: true,
                      foldKeymap: true,
                      completionKeymap: true,
                      lintKeymap: true,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-xl shadow-md bg-white border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">
              Preview
            </h2>
            <div
              ref={previewRef}
              className="overflow-hidden mb-6 rounded-xl bg-gray-900 relative mx-auto"
              style={
                {
                  width: `${carbonWidth}px`,
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
                        height={`${editorHeight}px`}
                        extensions={[javascript()]}
                        theme={vscodeDark}
                        editable={false}
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
                        style={{ overflowY: "auto" }}
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
            <div className="flex gap-4">
              <Button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                Download Image
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex items-center justify-center gap-2 border-gray-300 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <p className="text-center text-gray-400 text-base">
            Code Image Generator – Create beautiful code screenshots for your
            presentations and social media
          </p>
        </div>
      </footer>
    </div>
  );
}
