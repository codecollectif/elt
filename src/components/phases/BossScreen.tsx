import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import type { BossPhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: BossPhase;
  onNext: () => void;
  onExit: () => void;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "code-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTextAreaElement> & {
          language: string;
          value?: string;
        },
        HTMLTextAreaElement
      >;
    }
  }
}

export function BossScreen({ phase, onNext, onExit }: Props) {
  // Contournement TypeScript pour le composant web personnalisé
  const [output, setOutput] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the code editor on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const runCode = useCallback(() => {
    setOutput("");
    let logs = "";

    // Temporarily hijack console.log
    const originalLog = console.log;
    console.log = (...args) => {
      logs += `${args.join(" ")}\n`;
      // We deliberately do not call originalLog to keep the real console clean,
      // or we could if requested.
    };

    const originalPrompt = window.prompt;
    if (phase.mockPromptReturns) {
      let promptIndex = 0;
      window.prompt = (_msg?: string) => {
        const returns = phase.mockPromptReturns ?? [];
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
      // Le composant web "code-input" expose directement une propriété .value
      // qui contient le vrai texte du textarea interne.
      const code = inputRef.current?.value ?? "";
      // biome-ignore lint/security/noGlobalEval: it's done on purpose
      eval(code);
    } catch (error) {
      hasError = true;
      logs += `${error}\n`;
    } finally {
      console.log = originalLog;
      if (phase.mockPromptReturns) {
        window.prompt = originalPrompt;
      }
      setOutput(logs);

      // Check win condition if one was provided
      if (phase.expectedOutput) {
        if (logs.trim() === phase.expectedOutput.trim()) {
          setIsSuccess(true);
        }
      } else {
        // Si aucun expectedOutput n'est fourni (ex: Donjon 2 avec un prompt dynamique),
        // on valide l'épreuve tant que le code s'exécute sans crasher et trace un log.
        if (!hasError && logs.trim().length > 0) {
          setIsSuccess(true);
        }
      }
    }
  }, [phase.expectedOutput, phase.mockPromptReturns]);

  // Ecouteur natif pour empêcher le comportement par défaut (nouvelle ligne) du WebComponent code-input
  // qui intercepte l'événement avant React.
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
      } else if (e.key === "Enter" && e.shiftKey && isSuccess) {
        e.preventDefault();
        e.stopPropagation();
        onNext();
      }
    };

    el.addEventListener("keydown", nativeKeyDown, { capture: true });
    return () =>
      el.removeEventListener("keydown", nativeKeyDown, { capture: true });
  }, [runCode, onExit, onNext, isSuccess]);

  // Fallback global : si l'utilisateur perd le focus de l'éditeur, les raccourcis fonctionnent toujours
  useKeyboard(
    useCallback(
      (e: KeyboardEvent) => {
        // Ignorer si l'événement provient de l'éditeur (déjà géré par l'écouteur natif ci-dessus)
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
        } else if (e.key === "Enter" && e.shiftKey && isSuccess) {
          e.preventDefault();
          onNext();
        }
      },
      [runCode, onExit, onNext, isSuccess],
    ),
    [runCode, onExit, onNext, isSuccess],
  );

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <p
        style={{
          color: isSuccess ? "green" : "#ff4500",
          marginBottom: "1rem",
          fontWeight: "bold",
        }}
      >
        === Épreuve : {phase.concept} ===
      </p>

      {/* The custom code-input element we injected in index.html */}
      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      >
        <code-input
          ref={inputRef}
          language="JavaScript"
          value={phase.initialCode}
        />
      </div>

      <div
        style={{
          background: "#000",
          padding: "1rem",
          minHeight: "100px",
          border: "1px solid #444",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          color: isSuccess ? "#0f0" : "#ccc",
        }}
      >
        {output ?? "/* Résultat de l'exécution... */"}
      </div>

      <KeyboardHelp
        shortcuts={[
          ...(isSuccess
            ? [
                {
                  keys: ["shift", "entrée"],
                  description: "Continuer",
                  color: "green",
                },
              ]
            : [
                {
                  keys: ["ctrl", "entrée"],
                  description: "Exécuter le code",
                },
              ]),
          { keys: ["échap"], description: "Revenir à la carte" },
        ]}
      />
    </div>
  );
}
