import { useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import type { TypingChallengePhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: TypingChallengePhase;
  onNext: () => void;
  onExit: () => void;
}

export function TypingChallengeScreen({ phase, onNext, onExit }: Props) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Vérification de la progression
  const isFinishedAll = currentChallengeIndex >= phase.challenges.length;
  // Détermination de la chaîne active
  const currentChallenge = isFinishedAll
    ? ""
    : phase.challenges[currentChallengeIndex];

  useKeyboard(
    (event) => {
      // Touches système
      if (event.key === "Escape") {
        onExit();
        return;
      }

      if (isFinishedAll) {
        if (event.key === "Enter") {
          event.preventDefault();
          onNext();
        }
        return;
      }

      const targetChar = currentChallenge.charAt(currentCharIndex);

      // Ignorer les touches de modification (Shift, Ctrl, etc.)
      if (event.key.length > 1) {
        return;
      }

      if (event.key === targetChar) {
        setHasError(false);
        const nextCharIndex = currentCharIndex + 1;

        if (nextCharIndex >= currentChallenge.length) {
          // Ligne terminée !
          setCurrentChallengeIndex((i) => i + 1);
          setCurrentCharIndex(0);
        } else {
          setCurrentCharIndex(nextCharIndex);
        }
      } else {
        setErrors((e) => e + 1);
        setHasError(true);
      }
    },
    [isFinishedAll, currentChallenge, currentCharIndex, phase, onNext, onExit],
  );

  return (
    <div>
      <p style={{ color: "#8a2be2", marginBottom: "2rem" }}>
        <strong>=== Entraînement : {phase.concept} ===</strong>
      </p>

      {/* Render only the active challenge or the success state inside an IDE-like container */}
      <div
        className={hasError ? "mistyping-mode" : ""}
        style={{
          backgroundColor: "#1e1e1e",
          color: "#ccc",
          padding: "1rem",
          minHeight: "150px",
          border: "1px solid #333",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontStyle: "normal",
          fontSize: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {isFinishedAll ? (
          <p style={{ color: "#0f0", margin: 0 }}>Défi réussi !</p>
        ) : (
          <p style={{ margin: 0 }}>
            <span style={{ color: "#0f0" }}>
              {currentChallenge.slice(0, currentCharIndex)}
            </span>
            <span
              style={{
                backgroundColor: hasError ? "red" : "#ccc",
                color: "#000",
                display: "inline-block",
                minWidth: "10px", // Utile pour voir les espaces
              }}
            >
              {currentChallenge.charAt(currentCharIndex) === " "
                ? " "
                : currentChallenge.charAt(currentCharIndex)}
            </span>
            <span style={{ opacity: 0.5 }}>
              {currentChallenge.slice(currentCharIndex + 1)}
            </span>
          </p>
        )}
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.8rem", opacity: 0.5 }}>
        Erreurs: {errors}
      </div>

      <KeyboardHelp
        shortcuts={[
          isFinishedAll
            ? { keys: ["entrée"], description: "Continuer", color: "green" }
            : { keys: ["clavier"], description: "Taper le code" },
          { keys: ["échap"], description: "Revenir au sommaire" },
        ]}
      />
    </div>
  );
}
