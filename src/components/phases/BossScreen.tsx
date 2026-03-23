import { useCallback, useState } from "react";
import type { BossPhase } from "../../types/game";
import { CodeEditor } from "../ui/CodeEditor";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: BossPhase;
  onNext: () => void;
  onExit: () => void;
}

export function BossScreen({ phase, onNext, onExit }: Props) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRun = useCallback(
    (logs: string, hasError: boolean) => {
      if (phase.expectedOutput) {
        if (logs.trim() === phase.expectedOutput.trim()) {
          setIsSuccess(true);
        }
      } else {
        // Si aucun expectedOutput n'est fourni,
        // on valide tant que le code s'exécute sans crasher et trace un log.
        if (!hasError && logs.trim().length > 0) {
          setIsSuccess(true);
        }
      }
    },
    [phase.expectedOutput],
  );

  const extraKeyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey && isSuccess) {
        e.preventDefault();
        e.stopPropagation();
        onNext();
      }
    },
    [isSuccess, onNext],
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

      <CodeEditor
        initialCode={phase.initialCode}
        onRun={handleRun}
        onExit={onExit}
        extraKeyHandler={extraKeyHandler}
        runOptions={{ mockPromptReturns: phase.mockPromptReturns }}
      />

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
          { keys: ["échap"], description: "Revenir au sommaire" },
        ]}
      />
    </div>
  );
}
