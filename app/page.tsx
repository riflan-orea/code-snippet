"use client";

import { useState, useRef } from "react";
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
  const [padding] = useState(32);
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

  // Handle download
  const handleDownload = async () => {
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

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `code-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  // Render the code editor with frame
  const renderCodeEditor = () => {
    const codeEditor = (
      <div
        className="rounded-md overflow-hidden"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div style={{ backgroundColor: "#282c34" }}>
          <CodeMirror
            value={code}
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
          />
        </div>
      </div>
    );
    return (
      <EditorFrame
        type={editorFrameType}
        theme={editorFrameTheme}
        title={title}
        showControls={showControls}
      >
        {codeEditor}
      </EditorFrame>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#4F46E5"
                className="w-8 h-8 mr-2"
              >
                <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <h1 className="text-xl font-semibold text-gray-900">
                Code Image Generator
              </h1>
            </div>
            <a
              href="https://github.com/yourusername/code-image-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column: Code input and settings */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Code Input
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayTitle">
                        Display Title (optional)
                      </Label>
                      <Input
                        id="displayTitle"
                        value={displayTitle}
                        onChange={(e) => setDisplayTitle(e.target.value)}
                        placeholder="Enter a title to display above the code"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Window Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter window title"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showLineNumbers"
                      checked={showLineNumbers}
                      onChange={(e) => setShowLineNumbers(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="showLineNumbers">Show Line Numbers</Label>
                  </div>
                  <div>
                    <Label htmlFor="code" className="mb-2 block">
                      Code
                    </Label>
                    <div
                      ref={editorRef}
                      className="border rounded-md overflow-hidden"
                    >
                      <CodeMirror
                        value={code}
                        height="300px"
                        extensions={[javascript()]}
                        onChange={(value) => setCode(value)}
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
                  <div>
                    <Label htmlFor="watermark">Watermark (optional)</Label>
                    <Input
                      id="watermark"
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      placeholder="e.g. @yourhandle or yourwebsite.com"
                    />
                  </div>
                  {watermark && (
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="watermarkOpacity">
                          Watermark Opacity:{" "}
                          {Math.round(watermarkOpacity * 100)}%
                        </Label>
                      </div>
                      <Slider
                        id="watermarkOpacity"
                        min={0.1}
                        max={1}
                        step={0.1}
                        value={[watermarkOpacity]}
                        onValueChange={(value) => setWatermarkOpacity(value[0])}
                        className="py-4"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right column: Preview and download */}
            <div>
              <Card className="p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>

                <div
                  ref={previewRef}
                  className="overflow-hidden mb-4 rounded-xl"
                  style={{
                    backgroundColor: "#000000",
                    padding: `${padding}px`,
                    position: "relative",
                  }}
                >
                  {displayTitle && (
                    <div
                      className="mb-4 font-medium text-white"
                      style={{ fontSize: `${fontSize + 2}px` }}
                    >
                      {displayTitle}
                    </div>
                  )}

                  {renderCodeEditor()}

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
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </Button>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Code Image Generator - Create beautiful code screenshots for your
            presentations and social media
          </p>
        </div>
      </footer>
    </div>
  );
}
