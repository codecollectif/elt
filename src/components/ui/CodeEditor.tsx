import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";

interface CodeEditorProps {
  /** Initial code displayed in the editor */
  initialCode?: string;
  /** Called after each execution with output string and error flag */
  onRun?: (output: string, hasError: boolean) => void;
  /** Called when Escape is pressed */
  onExit: () => void;
  /** Extra keyboard shortcuts handled inside the editor */
  extraKeyHandler?: (e: KeyboardEvent) => void;
  /** Mock prompt() return values, consumed in order. Last value repeats. */
  mockPromptReturns?: string[];
}

export function CodeEditor({
  initialCode,
  onRun,
  onExit,
  extraKeyHandler,
  mockPromptReturns,
}: CodeEditorProps) {
  const [output, setOutput] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const TIMEOUT_MS = 3000;

  const runCode = useCallback(() => {
    setOutput("⏳ Exécution...");

    const code = inputRef.current?.value ?? "";

    // Build a worker from an inline blob so we don't need a separate file
    const workerSource = `
      self.onmessage = function(e) {
        const { code, mockPromptReturns } = e.data;
        let logs = "";

        console.log = (...args) => {
          logs += args.join(" ") + "\\n";
        };

        if (mockPromptReturns) {
          let i = 0;
          self.prompt = () => {
            const res = i < mockPromptReturns.length
              ? mockPromptReturns[i]
              : mockPromptReturns[mockPromptReturns.length - 1];
            i++;
            return res;
          };
        }

        let hasError = false;
        try {
          eval(code);
        } catch (error) {
          hasError = true;
          logs += error + "\\n";
        }
        self.postMessage({ logs, hasError });
      };
    `;

    const blob = new Blob([workerSource], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      const msg = "⏱️ Boucle infinie détectée ! Le code a été interrompu.\n";
      setOutput(msg);
      onRun?.(msg, true);
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      const { logs, hasError } = e.data;
      setOutput(logs || "/* Exécution terminée sans log */");
      onRun?.(logs, hasError);
    };

    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      const msg = `${e.message}\n`;
      setOutput(msg);
      onRun?.(msg, true);
    };

    worker.postMessage({ code, mockPromptReturns });
  }, [mockPromptReturns, onRun]);

  // Native keydown listener on the code-input web component
  // (must intercept before React to prevent newline insertion on Ctrl+Enter)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const nativeKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        runCode();
      } else if (e.key === "Escape") {
        onExit();
      } else {
        extraKeyHandler?.(e);
      }
    };

    el.addEventListener("keydown", nativeKeyDown, { capture: true });
    return () =>
      el.removeEventListener("keydown", nativeKeyDown, { capture: true });
  }, [runCode, onExit, extraKeyHandler]);

  // Global fallback: shortcuts still work when the editor loses focus
  useKeyboard(
    useCallback(
      (e: KeyboardEvent) => {
        if (
          e.target === inputRef.current ||
          inputRef.current?.contains(e.target as Node)
        ) {
          return;
        }

        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          runCode();
        } else if (e.key === "Escape") {
          onExit();
        } else {
          extraKeyHandler?.(e);
        }
      },
      [runCode, onExit, extraKeyHandler],
    ),
    [runCode, onExit, extraKeyHandler],
  );

  return (
    <>
      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #333",
          borderRadius: "4px",
          fontStyle: "normal",
        }}
      >
        <code-input ref={inputRef} language="JavaScript" value={initialCode} />
      </div>

      <div
        style={{
          background: "#000",
          padding: "1rem",
          minHeight: "100px",
          border: "1px solid #444",
          fontFamily: "monospace",
          fontStyle: "normal",
          whiteSpace: "pre-wrap",
          color: "#ccc",
        }}
      >
        {output ?? "/* Résultat de l'exécution... */"}
      </div>
    </>
  );
}
