import { useState } from "react";
import { NarrativeScreen } from "../components/phases/NarrativeScreen";
import { campaign } from "../data/campaign";

interface Props {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: Props) {
  const [introIndex, setIntroIndex] = useState(0);
  const phase = campaign.intro[introIndex];

  if (!phase || phase.type !== "NARRATIVE") {
    // Safety fallback
    onComplete();
    return null;
  }

  return (
    <NarrativeScreen
      key={phase.id}
      phase={phase}
      hideEscape
      onNext={() => {
        if (introIndex + 1 < campaign.intro.length) {
          setIntroIndex((i) => i + 1);
        } else {
          onComplete();
        }
      }}
      onExit={() => {
        // Passe l'intro sur ÉCHAP
        onComplete();
      }}
    />
  );
}
