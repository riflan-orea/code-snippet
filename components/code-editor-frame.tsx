"use client";

import type React from "react";

interface EditorFrameProps {
  children: React.ReactNode;
  type: "vscode" | "jetbrains" | "sublime" | "atom" | "terminal" | "browser";
  theme: "light" | "dark";
  title?: string;
  showControls?: boolean;
  accentColor?: string;
  backgroundColor?: string;
}

export function EditorFrame({
  children,
  type = "vscode",
  theme = "dark",
  title = "code.tsx",
  showControls = true,
  accentColor,
  backgroundColor,
}: EditorFrameProps) {
  // Base styles for frame elements
  const frameStyles = {
    vscode: {
      dark: {
        background: backgroundColor || "#1e1e1e",
        titlebar: backgroundColor || "#333333",
        text: "#cccccc",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
      light: {
        background: backgroundColor || "#ffffff",
        titlebar: backgroundColor || "#f3f3f3",
        text: "#333333",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
    },
    jetbrains: {
      dark: {
        background: backgroundColor || "#2b2b2b",
        titlebar: backgroundColor || "#3c3f41",
        text: "#cccccc",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
      light: {
        background: backgroundColor || "#ffffff",
        titlebar: backgroundColor || "#e0e0e0",
        text: "#333333",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
    },
    sublime: {
      dark: {
        background: backgroundColor || "#272822",
        titlebar: backgroundColor || "#333333",
        text: "#cccccc",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
      light: {
        background: backgroundColor || "#ffffff",
        titlebar: backgroundColor || "#e0e0e0",
        text: "#333333",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
    },
    atom: {
      dark: {
        background: backgroundColor || "#282c34",
        titlebar: backgroundColor || "#21252b",
        text: "#abb2bf",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
      light: {
        background: backgroundColor || "#ffffff",
        titlebar: backgroundColor || "#ececec",
        text: "#383a42",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
    },
    terminal: {
      dark: {
        background: backgroundColor || "#000000",
        titlebar: backgroundColor || "#333333",
        text: "#f8f8f2",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
      light: {
        background: backgroundColor || "#ffffff",
        titlebar: backgroundColor || "#e0e0e0",
        text: "#000000",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
    },
    browser: {
      dark: {
        background: backgroundColor || "#1e1e1e",
        titlebar: backgroundColor || "#333333",
        text: "#cccccc",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
      light: {
        background: backgroundColor || "#ffffff",
        titlebar: backgroundColor || "#f3f3f3",
        text: "#333333",
        controls: {
          close: "#ff5f56",
          minimize: "#ffbd2e",
          maximize: "#27c93f",
        },
      },
    },
  };

  // Get current style based on type and theme
  const currentStyle = frameStyles[type][theme];

  // Generate title based on type
  const getTitle = () => {
    switch (type) {
      case "browser":
        return title.startsWith("http") ? title : `https://${title}`;
      case "terminal":
        return `${title.toLowerCase() === "bash" ? "bash" : "zsh"} - ${title}`;
      default:
        return title;
    }
  };

  // Controls component
  const Controls = () => {
    if (!showControls) return null;

    return (
      <div className="flex items-center gap-1.5 ml-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: currentStyle.controls.close }}
        ></div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: currentStyle.controls.minimize }}
        ></div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: currentStyle.controls.maximize }}
        ></div>
      </div>
    );
  };

  // Browser URL bar
  const BrowserBar = () => {
    if (type !== "browser") return null;

    return (
      <div
        className="flex items-center mx-2 my-1.5 px-2 py-1 rounded text-xs"
        style={{ backgroundColor: theme === "dark" ? "#444" : "#e0e0e0" }}
      >
        <span className="truncate">{getTitle()}</span>
      </div>
    );
  };

  // Terminal prompt
  const TerminalPrompt = () => {
    if (type !== "terminal") return null;

    return (
      <div
        className="px-2 pt-1 pb-0 text-xs font-mono"
        style={{ color: accentColor || "#4CAF50" }}
      >
        {title.toLowerCase() === "bash" ? "user@machine:~$" : "machine%"}
      </div>
    );
  };

  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg border"
      style={{
        backgroundColor: currentStyle.background,
        borderColor: theme === "dark" ? "#555" : "#ddd",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ backgroundColor: currentStyle.titlebar }}
      >
        <Controls />

        <div
          className="flex-1 text-center text-xs font-medium truncate px-2"
          style={{ color: currentStyle.text }}
        >
          {getTitle()}
        </div>

        <div className="w-14"></div>
      </div>

      {/* Browser-specific URL bar */}
      <BrowserBar />

      {/* Terminal-specific prompt */}
      <TerminalPrompt />

      {/* Content area */}
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
