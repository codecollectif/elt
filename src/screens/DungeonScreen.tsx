import { useState } from "react";
import { ActionScreen } from "../components/phases/ActionScreen";
import { BossScreen } from "../components/phases/BossScreen";
import { NarrativeScreen } from "../components/phases/NarrativeScreen";
import { TypingTrainerScreen } from "../components/phases/TypingTrainerScreen";
import type { Dungeon } from "../types/game";

interface Props {
  dungeon: Dungeon;
  onExit: () => void;
  onComplete: () => void;
}

export function DungeonScreen({ dungeon, onExit, onComplete }: Props) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const phase = dungeon.phases[currentPhaseIndex];

  if (!phase) {
    // Ne devrait théoriquement pas arriver
    return <div>Dungeon Erreur: Phase {currentPhaseIndex} introuvable.</div>;
  }

  const handleNextPhase = () => {
    if (currentPhaseIndex + 1 < dungeon.phases.length) {
      setCurrentPhaseIndex((prev) => prev + 1);
    } else {
      onComplete(); // Fin du donjon, retour au sommaire
    }
  };

  const renderPhase = () => {
    switch (phase.type) {
      case "NARRATIVE":
        return (
          <NarrativeScreen
            key={phase.id}
            phase={phase}
            onNext={handleNextPhase}
            onExit={onExit}
          />
        );
      case "ACTION":
        return (
          <ActionScreen
            key={phase.id}
            phase={phase}
            onNext={handleNextPhase}
            onExit={onExit}
          />
        );
      case "TYPING_TRAINER":
        return (
          <TypingTrainerScreen
            key={phase.id}
            phase={phase}
            onNext={handleNextPhase}
            onExit={onExit}
          />
        );
      case "BOSS":
        return (
          <BossScreen
            key={phase.id}
            phase={phase}
            onNext={handleNextPhase}
            onExit={onExit}
          />
        );
    }
  };

  return (
    <main className="dungeon-container" style={{ padding: "2rem" }}>
      {renderPhase()}
    </main>
  );
}
