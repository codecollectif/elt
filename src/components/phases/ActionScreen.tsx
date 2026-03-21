import React, { useCallback, useEffect, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import type { ActionPhase } from "../../types/game";

interface Props {
  phase: ActionPhase;
  onNext: () => void;
  onExit: () => void;
}

export function ActionScreen({ phase, onNext, onExit }: Props) {
  const [revealPosition, setRevealPosition] = useState<number>(0);

  useEffect(() => {
    phase && setRevealPosition(0);
  }, [phase]);

  useEffect(() => {
    if (revealPosition < phase.content.length) {
      const timeoutId = setTimeout(() => {
        setRevealPosition((old) => old + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [revealPosition, phase.content]);

  const isFinished = revealPosition === phase.content.length;

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
      {phase.content
        .slice(0, revealPosition)
        .split("\n\n")
        .map((p) => (
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
        <dl style={{ position: "absolute", top: 0, right: 0 }}>
          <dt>
            <kbd>{phase.actionKey.toLowerCase()}</kbd>
          </dt>
          <dd>Ouvrir le lien</dd>
          <dt>
            <kbd>shift</kbd> + <kbd>entrée</kbd>
          </dt>
          <dd style={{ color: "green" }}>Continuer</dd>
          <dt>
            <kbd>échap</kbd>
          </dt>
          <dd>Revenir à la carte</dd>
        </dl>
      )}
    </>
  );
}
