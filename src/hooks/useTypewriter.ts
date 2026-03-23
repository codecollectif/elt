import { useEffect, useState } from "react";

export function useTypewriter(text: string, speedMs = 50) {
  const [revealPosition, setRevealPosition] = useState(0);

  // Réinitialise l'animation si le texte change
  useEffect(() => {
    text && setRevealPosition(0);
  }, [text]);

  // Effet typewriter
  useEffect(() => {
    if (revealPosition < text.length) {
      const timeoutId = setTimeout(() => {
        setRevealPosition((old) => old + 1);
      }, speedMs);
      return () => clearTimeout(timeoutId);
    }
  }, [revealPosition, text, speedMs]);

  const isFinished = revealPosition === text.length;
  const revealedText = text.slice(0, revealPosition);

  return { revealedText, isFinished };
}
