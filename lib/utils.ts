import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce utility
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Calculate estimated width for code preview
export function calculateEstimatedWidth(
  code: string,
  minWidth: number,
  maxWidth: number,
  padding: number
) {
  const longestLine = code
    .split("\n")
    .reduce((max, line) => Math.max(max, line.length), 0);
  return Math.min(
    maxWidth,
    Math.max(minWidth, Math.round(longestLine * 9 + padding * 2))
  );
}

// Calculate editor height based on code line count
export function calculateEditorHeight(
  codeLineCount: number,
  carbonMaxHeight: number,
  carbonPadding: number
) {
  const min = 80;
  const max = carbonMaxHeight - carbonPadding * 2 - 60;
  const ideal = codeLineCount * 18 + 20;
  return Math.max(min, Math.min(max, ideal));
}

// Recursively force supported background and text colors on all descendants
export function forceSupportedColors(node: Element) {
  if (node.nodeType !== 1) return;
  const el = node as HTMLElement;
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
