import React, { useCallback, useEffect, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import type { NarrativePhase } from "../../types/game";

interface Props {
  phase: NarrativePhase;
  onNext: () => void;
  onExit: () => void;
}

export function NarrativeScreen({ phase, onNext, onExit }: Props) {
  const [revealPosition, setRevealPosition] = useState<number>(0);

  // Reset animation when phase changes
  useEffect(() => {
    phase && setRevealPosition(0);
  }, [phase]);

  // Typewriter effect
  useEffect(() => {
    if (revealPosition < phase.content.length) {
      const timeoutId = setTimeout(() => {
        setRevealPosition((old) => old + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [revealPosition, phase.content]);

  // Keyboard controls
  const isFinished = revealPosition === phase.content.length;

  useKeyboard(
    useCallback(
      (event: KeyboardEvent) => {
        if (!isFinished) return; // Ignore keys while typing
        if (event.key === "Enter") onNext();
        if (event.key === "Escape") onExit();
      },
      [isFinished, onNext, onExit],
    ),
    [isFinished, onNext, onExit],
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
            <kbd>entrée</kbd>
          </dt>
          <dd>Continuer</dd>
          <dt>
            <kbd>échap</kbd>
          </dt>
          <dd>Revenir à la carte</dd>
        </dl>
      )}
    </>
  );
}
