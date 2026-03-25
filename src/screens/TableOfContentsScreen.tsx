import { useEffect, useState } from "react";
import { KeyboardHelp } from "../components/ui/KeyboardHelp";
import { TextBlock } from "../components/ui/TextBlock";
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

      // Écoute les touches numériques pour lancer les donjons
      const num = parseInt(event.key, 10);
      if (!Number.isNaN(num)) {
        event.preventDefault();
        onSelectDungeon(num);
      }
    },
    [isFinished, onSelectDungeon],
  );

  return (
    <main>
      <TextBlock text={content.slice(0, revealPosition)} />

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
    </main>
  );
}
