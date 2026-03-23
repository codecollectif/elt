import { useCallback } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useTypewriter } from "../../hooks/useTypewriter";
import type { NarrativePhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";
import { TextBlock } from "../ui/TextBlock";

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
      <TextBlock text={revealedText} />

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
