import React, { useEffect, useState } from "react";
import { KeyboardHelp } from "../components/ui/KeyboardHelp";
import { useKeyboard } from "../hooks/useKeyboard";

interface Props {
  content: string;
  onSelectDungeon: (id: number) => void;
  onReset: () => void;
}

// Persiste entre les remounts du composant (contrairement à useRef)
let lastSeenContent = "";

export function TableOfContentsScreen({
  content,
  onSelectDungeon,
  onReset,
}: Props) {
  const alreadySeen =
    lastSeenContent.length > 0 && content.startsWith(lastSeenContent);
  const [revealPosition, setRevealPosition] = useState<number>(
    alreadySeen ? content.length : 0,
  );

  useEffect(() => {
    if (revealPosition < content.length) {
      const timeoutId = setTimeout(() => {
        setRevealPosition((old) => old + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
    // Mémorise le contenu une fois entièrement affiché
    lastSeenContent = content;
  }, [revealPosition, content]);

  const isFinished = revealPosition === content.length;

  useKeyboard(
    (event) => {
      if (!isFinished) return;

      if (event.key === "Delete") {
        if (
          window.confirm(
            "Veux-tu tout effacer et recommencer depuis le début ?",
          )
        ) {
          onReset();
        }
        return;
      }

      // Listen for numbers to trigger dungeons directly
      const num = parseInt(event.key, 10);
      if (!Number.isNaN(num)) {
        event.preventDefault();
        onSelectDungeon(num);
      }
    },
    [isFinished, onSelectDungeon],
  );

  return (
    <>
      {content
        .slice(0, revealPosition)
        .split("\n\n")
        .map((p, pIndex) => (
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
              keyNode: (
                <>
                  <kbd>0</kbd>, <kbd>1</kbd>, etc.
                </>
              ),
              description: "Ouvrir un chapitre",
            },
            {
              keys: ["suppr"],
              description: "Recommencer l'aventure",
              color: "#ff6b6b", // Un rouge doux
            },
          ]}
        />
      )}
    </>
  );
}
