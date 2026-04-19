"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // Block devtools keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, metaKey } = e;

      // F12
      if (key === "F12") { e.preventDefault(); return; }

      // Ctrl/Cmd + Shift + I (Elements/Inspector)
      if ((ctrlKey || metaKey) && shiftKey && key.toLowerCase() === "i") { e.preventDefault(); return; }

      // Ctrl/Cmd + Shift + J (Console)
      if ((ctrlKey || metaKey) && shiftKey && key.toLowerCase() === "j") { e.preventDefault(); return; }

      // Ctrl/Cmd + Shift + C (Inspect element)
      if ((ctrlKey || metaKey) && shiftKey && key.toLowerCase() === "c") { e.preventDefault(); return; }

      // Ctrl/Cmd + Shift + K (Firefox console)
      if ((ctrlKey || metaKey) && shiftKey && key.toLowerCase() === "k") { e.preventDefault(); return; }

      // Ctrl/Cmd + U (View source)
      if ((ctrlKey || metaKey) && key.toLowerCase() === "u") { e.preventDefault(); return; }

      // Ctrl/Cmd + S (Save page)
      if ((ctrlKey || metaKey) && key.toLowerCase() === "s") { e.preventDefault(); return; }
    };

    // Continuously clear the console
    const clearConsole = () => {
      try { console.clear(); } catch { /* noop */ }
    };
    const consoleInterval = setInterval(clearConsole, 100);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(consoleInterval);
    };
  }, []);

  return null;
}
