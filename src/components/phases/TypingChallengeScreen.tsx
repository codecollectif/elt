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
  const [hasErrorBlink, setHasErrorBlink] = useState(false);

  // Safety check if we exceeded the challenges array
  const isFinishedAll = currentChallengeIndex >= phase.challenges.length;
  // Deriving the active string (can be undefined if finished)
  const currentChallenge = isFinishedAll
    ? ""
    : phase.challenges[currentChallengeIndex];

  useKeyboard(
    (event) => {
      // System keys routing
      if (event.key === "Escape") {
        onExit();
        return;
      }

      if (isFinishedAll) {
        if (event.key === "Enter") {
          onNext();
        }
        return;
      }

      const targetChar = currentChallenge.charAt(currentCharIndex);

      // Ignore modifier keys and other non-printable characters
      if (event.key.length > 1) {
        return;
      }

      if (event.key === targetChar) {
        // Correct character typed
        setHasErrorBlink(false);
        const nextCharIndex = currentCharIndex + 1;

        if (nextCharIndex >= currentChallenge.length) {
          // Finished the line!
          setCurrentChallengeIndex((i) => i + 1);
          setCurrentCharIndex(0);
        } else {
          // Just move to the next character in string
          setCurrentCharIndex(nextCharIndex);
        }
      } else {
        // Error
        setErrors((e) => e + 1);
        setHasErrorBlink(true);
        // Clear the blink effect quickly to allow another error flash
        setTimeout(() => setHasErrorBlink(false), 150);
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
        style={{
          backgroundColor: "#1e1e1e",
          color: "#ccc",
          padding: "1rem",
          minHeight: "150px",
          border: "1px solid #333",
          borderRadius: "4px",
          fontFamily: "monospace",
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
                backgroundColor: hasErrorBlink ? "red" : "#ccc",
                color: "#000",
                display: "inline-block",
                minWidth: "10px", // Just enough to see space chars
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
          { keys: ["échap"], description: "Revenir à la carte" },
        ]}
      />
    </div>
  );
}
