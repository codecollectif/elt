import React, { useEffect, useState } from "react";
import { KeyboardHelp } from "../components/ui/KeyboardHelp";
import { useKeyboard } from "../hooks/useKeyboard";

interface Props {
  content: string;
  onSelectDungeon: (id: number) => void;
  onReset: () => void;
}

export function TableOfContentsScreen({ content, onSelectDungeon, onReset }: Props) {
  const [revealPosition, setRevealPosition] = useState<number>(0);

  useEffect(() => {
    if (revealPosition < content.length) {
      const timeoutId = setTimeout(() => {
        setRevealPosition((old) => old + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [revealPosition, content.length]);

  const isFinished = revealPosition === content.length;

  useKeyboard(
    (event) => {
      if (!isFinished) return;

      if (event.key === "Delete") {
        if (
          window.confirm("Veux-tu tout effacer et recommencer depuis le début ?")
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
