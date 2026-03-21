import React, { useCallback } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useTypewriter } from "../../hooks/useTypewriter";
import type { ActionPhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: ActionPhase;
  onNext: () => void;
  onExit: () => void;
}

export function ActionScreen({ phase, onNext, onExit }: Props) {
  const { revealedText, isFinished } = useTypewriter(phase.content);

  useKeyboard(
    useCallback(
      (event: KeyboardEvent) => {
        if (!isFinished) return;

        // Shift + Enter to complete the phase
        if (event.key === "Enter" && event.shiftKey) {
          event.preventDefault();
          onNext();
        }
        // Action key without Shift
        else if (event.key === phase.actionKey && !event.shiftKey) {
          phase.onAction();
        }
        // Escape returns to the map
        else if (event.key === "Escape") {
          onExit();
        }
      },
      [isFinished, phase, onNext, onExit],
    ),
    [isFinished, phase, onNext, onExit],
  );

  return (
    <>
      {revealedText.split("\n\n").map((p) => (
        <p key={`p-${p}`}>
          {p.split("\n").map((line, lIndex) => (
            <React.Fragment key={`l-${line}`}>
              {lIndex !== 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      ))}

      {isFinished && (
        <KeyboardHelp
          shortcuts={[
            {
              keys: [phase.actionKey.toLowerCase()],
              description: "Ouvrir le lien",
            },
            {
              keys: ["shift", "entrée"],
              description: "Continuer",
              color: "green",
            },
            { keys: ["échap"], description: "Revenir à la carte" },
          ]}
        />
      )}
    </>
  );
}
