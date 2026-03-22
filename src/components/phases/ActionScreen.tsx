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
        else if (event.key === "Enter" && !event.shiftKey) {
          phase.onAction();
        }
        // Escape returns to the table of contents
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
      {revealedText.split("\n\n").map((p, pIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: statique
        <p key={`p-${pIndex}`}>
          {p.split("\n").map((line, lIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: statique
            <React.Fragment key={`l-${lIndex}`}>
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
              keys: ["entrée"],
              description: phase.actionDescription,
            },
            {
              keys: ["shift", "entrée"],
              description: "Continuer",
              color: "green",
            },
            { keys: ["échap"], description: "Revenir au sommaire" },
          ]}
        />
      )}
    </>
  );
}
