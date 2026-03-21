import React, { useEffect, useState } from "react";
import { KeyboardHelp } from "../components/ui/KeyboardHelp";
import { useKeyboard } from "../hooks/useKeyboard";

interface Props {
  content: string;
  onSelectDungeon: (id: number) => void;
}

export function MapScreen({ content, onSelectDungeon }: Props) {
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

      // Listen for numbers to trigger dungeons directly
      const num = parseInt(event.key, 10);
      if (!Number.isNaN(num)) {
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
          ]}
        />
      )}
    </>
  );
}
