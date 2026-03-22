import React, { useCallback } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useTypewriter } from "../../hooks/useTypewriter";
import type { NarrativePhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: NarrativePhase;
  onNext: () => void;
  onExit: () => void;
  hideEscape?: boolean;
}

export function NarrativeScreen({ phase, onNext, onExit, hideEscape }: Props) {
  const { revealedText, isFinished } = useTypewriter(phase.content);

  useKeyboard(
    useCallback(
      (event: KeyboardEvent) => {
        if (!isFinished) return; // Ignore keys while typing
        if (event.key === "Enter") {
          event.preventDefault();
          onNext();
        }
        if (event.key === "Escape") onExit();
      },
      [isFinished, onNext, onExit],
    ),
    [isFinished, onNext, onExit],
  );

  return (
    <>
      {revealedText.split("\n\n").map((p, pIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: texte statique
        <p key={`p-${pIndex}`}>
          {p.split("\n").map((line, lIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: texte statique
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
            { keys: ["entrée"], description: "Continuer" },
            ...(hideEscape
              ? []
              : [{ keys: ["échap"], description: "Revenir au sommaire" }]),
          ]}
        />
      )}
    </>
  );
}
