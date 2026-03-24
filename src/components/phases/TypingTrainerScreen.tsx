import { useLayoutEffect, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import type { TypingPhase } from "../../types/game";
import { KeyboardHelp } from "../ui/KeyboardHelp";

interface Props {
  phase: TypingPhase;
  onNext: () => void;
  onExit: () => void;
}

export function TypingTrainerScreen({ phase, onNext, onExit }: Props) {
  const {
    lines,
    concept,
    headerLabel = "Entraînement",
    headerColor = "#8a2be2",
    helpLabel = "Taper le code",
    errorLabel = "Erreurs",
    fontSize = "20px",
    letterSpacing = "1px",
  } = phase;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hasError, setHasError] = useState(false);

  const isFinishedAll = currentIndex >= lines.length;
  const currentLine = isFinishedAll ? "" : lines[currentIndex];
  const currentChar = isFinishedAll ? "" : currentLine.charAt(currentCharIndex);

  // Auto-skip characters like \n
  useLayoutEffect(() => {
    if (!isFinishedAll && currentLine.charAt(currentCharIndex) === "\n") {
      setCurrentCharIndex((prev) => prev + 1);
    }
  }, [currentCharIndex, currentLine, isFinishedAll]);

  useKeyboard(
    (event) => {
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

      if (event.key.length > 1) {
        return;
      }

      if (event.key === currentChar) {
        setHasError(false);
        const nextCharIndex = currentCharIndex + 1;

        if (nextCharIndex >= currentLine.length) {
          setCurrentIndex((i) => i + 1);
          setCurrentCharIndex(0);
        } else {
          setCurrentCharIndex(nextCharIndex);
        }
      } else {
        setErrors((e) => e + 1);
        setHasError(true);
      }
    },
    [isFinishedAll, currentLine, currentChar, onNext, onExit],
  );

  return (
    <div>
      <p style={{ color: headerColor, marginBottom: "2rem" }}>
        <strong>
          === {headerLabel} : {concept} ===
        </strong>
      </p>

      <div
        className={hasError ? "mistyping-mode" : ""}
        style={{
          backgroundColor: "#111",
          color: "#eee",
          padding: "2rem",
          minHeight: "150px",
          border: "2px solid #333",
          borderRadius: "8px",
          fontFamily: "monospace",
          fontStyle: "normal",
          fontSize: fontSize,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          whiteSpace: "pre-wrap",
          transition: "border-color 0.2s ease",
        }}
      >
        {isFinishedAll ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#0f0", margin: 0 }}>Défi réussi !</p>
          </div>
        ) : (
          <p style={{ margin: 0, letterSpacing: letterSpacing }}>
            <span style={{ color: "#0f0" }}>
              {currentLine.slice(0, currentCharIndex)}
            </span>
            <span
              style={{
                backgroundColor: hasError ? "red" : "#555",
                color: "#fff",
                display: "inline-block",
                minWidth: "12px",
                padding: "0 2px",
              }}
            >
              {currentChar === " " ? " " : currentChar}
            </span>
            <span style={{ opacity: 0.3 }}>
              {currentLine.slice(currentCharIndex + 1)}
            </span>
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.9rem",
          opacity: 0.6,
        }}
      >
        <div>
          Progression : {currentIndex} / {lines.length}
        </div>
        <div>
          {errorLabel} : {errors}
        </div>
      </div>

      <KeyboardHelp
        shortcuts={[
          isFinishedAll
            ? { keys: ["entrée"], description: "Continuer", color: "green" }
            : { keys: ["clavier"], description: helpLabel },
          { keys: ["échap"], description: "Revenir au sommaire" },
        ]}
      />
    </div>
  );
}
