import React, { useCallback } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useTypewriter } from "../../hooks/useTypewriter";
import type { NarrativePhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: NarrativePhase;
  onNext: () => void;
  onExit: () => void;
}

export function NarrativeScreen({ phase, onNext, onExit }: Props) {
  const { revealedText, isFinished } = useTypewriter(phase.content);

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
            { keys: ["entrée"], description: "Continuer" },
            { keys: ["échap"], description: "Revenir à la carte" },
          ]}
        />
      )}
    </>
  );
}
