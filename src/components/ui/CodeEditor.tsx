import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { CodeInput } from "./CodeInput";

const TIMEOUT_MS = 3000;

const WORKER_SOURCE = `
  self.onmessage = function(e) {
    const { code, mockPromptReturns, sharedBuffer } = e.data;
    let logs = "";
    let i = 0;

    console.log = (...args) => {
      self.postMessage({ type: "LOG", msg: args.join(" ") + "\\n" });
    };

    self.prompt = (question) => {
      if (mockPromptReturns && mockPromptReturns.length > 0) {
        const res = i < mockPromptReturns.length
          ? mockPromptReturns[i]
          : mockPromptReturns[mockPromptReturns.length - 1];
        i++;
        return res;
      }

      if (sharedBuffer) {
        const flagArray = new Int32Array(sharedBuffer, 0, 1);
        const dataArray = new Uint8Array(sharedBuffer, 4);
        
        self.postMessage({ type: "PROMPT", question });
        Atomics.wait(flagArray, 0, 0); // Attend que flagArray[0] != 0
        
        const len = Atomics.load(flagArray, 0) - 1;
        const res = new TextDecoder().decode(dataArray.slice(0, len));
        
        Atomics.store(flagArray, 0, 0); // Reset le flag
        return res;
      }

      return null;
    };

    let hasError = false;
    try {
      eval(code);
    } catch (error) {
      hasError = true;
      self.postMessage({ type: "LOG", msg: error + "\\n" });
    }
    self.postMessage({ type: "DONE", hasError });
  };
`;

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputDivRef = useRef<HTMLDivElement>(null);

  const lastOutputRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const workerUrlRef = useRef<string | null>(null);

  const [promptConfig, setPromptConfig] = useState<{
    question: string;
    flagArray: Int32Array;
    dataArray: Uint8Array;
  } | null>(null);

  const cleanupWorker = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (workerUrlRef.current) {
      URL.revokeObjectURL(workerUrlRef.current);
      workerUrlRef.current = null;
    }
  }, []);

  const stopExecution = useCallback(
    (message: string, isError = false) => {
      cleanupWorker();
      if (outputDivRef.current) {
        outputDivRef.current.textContent = message;
      }
      lastOutputRef.current = message;
      onRun?.(message, isError);
    },
    [cleanupWorker, onRun],
  );

  useEffect(() => {
    inputRef.current?.focus();
    if (outputDivRef.current) {
      outputDivRef.current.textContent = "/* Résultat de l'exécution... */";
    }
    return cleanupWorker;
  }, [cleanupWorker]);

  const runCode = useCallback(() => {
    if (outputDivRef.current) {
      outputDivRef.current.textContent = "⏳ Exécution...\n";
    }

    const code = inputRef.current?.value ?? "";
    let logs = "";

    // Préparation du buffer partagé pour prompt() synchrone
    const sharedBuffer = window.crossOriginIsolated
      ? new SharedArrayBuffer(2048)
      : null;
    const flagArray = sharedBuffer ? new Int32Array(sharedBuffer, 0, 1) : null;
    const dataArray = sharedBuffer ? new Uint8Array(sharedBuffer, 4) : null;

    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    workerUrlRef.current = url;
    workerRef.current = worker;
    timerRef.current = setTimeout(() => {
      stopExecution(
        "⏱️ Boucle infinie détectée ! Le code a été interrompu.\n",
        true,
      );
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      const { type, msg, question, hasError } = e.data;

      if (type === "LOG") {
        logs += msg;
        if (outputDivRef.current) {
          outputDivRef.current.textContent = logs;
        }
      } else if (type === "PROMPT") {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (flagArray && dataArray) {
          setPromptConfig({ question, flagArray, dataArray });
        }
      } else if (type === "DONE") {
        const finalLogs = logs || "/* Exécution terminée sans log */";
        stopExecution(finalLogs, hasError);
      }
    };

    worker.onerror = (e) => {
      stopExecution(`${e.message}\n`, true);
    };

    worker.postMessage({ code, mockPromptReturns, sharedBuffer });
  }, [mockPromptReturns, stopExecution]);

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

  const handlePromptSubmit = (value: string) => {
    if (promptConfig) {
      const { flagArray, dataArray } = promptConfig;
      const encoded = new TextEncoder().encode(value);
      dataArray.set(encoded);
      Atomics.store(flagArray, 0, encoded.length + 1);
      Atomics.notify(flagArray, 0);
      setPromptConfig(null);

      // On relance le timer !
      timerRef.current = setTimeout(() => {
        stopExecution(
          "⏱️ Boucle infinie détectée ! Le code a été interrompu.\n",
          true,
        );
      }, TIMEOUT_MS);
    }
  };

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
        <CodeInput ref={inputRef} language="JavaScript" value={initialCode} />
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
        <div ref={outputDivRef} />
      </div>

      {promptConfig && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #333",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <p style={{ marginBottom: "1rem", color: "#fff" }}>
              {promptConfig.question}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = (
                  e.currentTarget.elements.namedItem(
                    "promptInput",
                  ) as HTMLInputElement
                ).value;
                handlePromptSubmit(val);
              }}
            >
              <input
                // biome-ignore lint/a11y/noAutofocus: C'est une pop-up, on veut que le focus soit dessus.
                autoFocus
                name="promptInput"
                type="text"
                style={{
                  width: "100%",
                  background: "#000",
                  border: "1px solid #444",
                  color: "#fff",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  style={{
                    background: "#444",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1.5rem",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
