import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";

interface CodeEditorProps {
  /** Code initial affiché dans l'éditeur */
  initialCode?: string;
  /** Appelé après chaque exécution avec le résultat et un flag d'erreur */
  onRun?: (output: string, hasError: boolean) => void;
  /** Appelé à l'appui sur Échap */
  onExit: () => void;
  /** Gestionnaire de touches supplémentaire */
  extraKeyHandler?: (e: KeyboardEvent) => void;
  /** Valeurs de retour simulées pour prompt() */
  mockPromptReturns?: string[];
  /** Afficher le bouton de téléchargement */
  showDownloadButton?: boolean;
}

export function CodeEditor({
  initialCode,
  onRun,
  onExit,
  extraKeyHandler,
  mockPromptReturns,
  showDownloadButton,
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

    // Création d'un Worker inline pour l'exécution du code
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

  const handleDownload = useCallback(() => {
    const code = inputRef.current?.value ?? "";
    const blob = new Blob([code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entre_les_touches.js";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Écouteur natif pour intercepter Ctrl+Entrée avant React
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

  // Fallback global pour les raccourcis clavier
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
          position: "relative",
        }}
      >
        {showDownloadButton && (
          <button
            type="button"
            onClick={handleDownload}
            className="download-button"
          >
            Télécharger .js
          </button>
        )}
        {output ?? "/* Résultat de l'exécution... */"}
      </div>
    </>
  );
}
