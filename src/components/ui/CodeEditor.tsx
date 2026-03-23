import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";

interface RunOptions {
  /** Mock prompt() return values, consumed in order. Last value repeats. */
  mockPromptReturns?: string[];
}

interface CodeEditorProps {
  /** Initial code displayed in the editor */
  initialCode?: string;
  /** Called after each execution with output string and error flag */
  onRun?: (output: string, hasError: boolean) => void;
  /** Called when Escape is pressed */
  onExit: () => void;
  /** Extra keyboard shortcuts handled inside the editor */
  extraKeyHandler?: (e: KeyboardEvent) => void;
  /** Options passed to the code runner */
  runOptions?: RunOptions;
}

export function CodeEditor({
  initialCode,
  onRun,
  onExit,
  extraKeyHandler,
  runOptions,
}: CodeEditorProps) {
  const [output, setOutput] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the code editor on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const runCode = useCallback(() => {
    let logs = "";

    // Temporarily hijack console.log
    const originalLog = console.log;
    console.log = (...args) => {
      logs += `${args.join(" ")}\n`;
    };

    // Optionally hijack prompt
    const originalPrompt = window.prompt;
    if (runOptions?.mockPromptReturns) {
      let promptIndex = 0;
      window.prompt = (_msg?: string) => {
        const returns = runOptions.mockPromptReturns ?? [];
        const res =
          returns[promptIndex] !== undefined
            ? returns[promptIndex]
            : returns[returns.length - 1];
        promptIndex++;
        return res;
      };
    }

    let hasError = false;

    try {
      const code = inputRef.current?.value ?? "";
      // biome-ignore lint/security/noGlobalEval: intentional sandbox execution
      eval(code);
    } catch (error) {
      hasError = true;
      logs += `${error}\n`;
    } finally {
      console.log = originalLog;
      if (runOptions?.mockPromptReturns) {
        window.prompt = originalPrompt;
      }
      setOutput(logs || "/* Exécution terminée sans log */");
      onRun?.(logs, hasError);
    }
  }, [runOptions?.mockPromptReturns, onRun]);

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
