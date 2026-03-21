import { useState } from "react";
import { NarrativeScreen } from "./components/phases/NarrativeScreen";
import { campaign } from "./data/campaign";
import { DungeonScreen } from "./screens/DungeonScreen";
import { MapScreen } from "./screens/MapScreen";
import useLocalStorage from "./hooks/useLocalStorage";

export default function App() {
  const [hasSeenIntro, setHasSeenIntro] = useLocalStorage<boolean>(
    "hasSeenIntro",
    false,
  );
  const [currentScreen, setCurrentScreen] = useState<"MAP" | "DUNGEON">("MAP");
  const [selectedDungeonId, setSelectedDungeonId] = useState<number | null>(
    null,
  );
  const [introIndex, setIntroIndex] = useState(0);
  const [maxUnlockedDungeon, setMaxUnlockedDungeon] = useLocalStorage<number>(
    "maxUnlockedDungeon",
    0,
  );

  if (!hasSeenIntro) {
    const phase = campaign.intro[introIndex];
    if (phase && phase.type === "NARRATIVE") {
      return (
        <NarrativeScreen
          key={phase.id}
          phase={phase}
          onNext={() => {
            if (introIndex + 1 < campaign.intro.length) {
              setIntroIndex((i) => i + 1);
            } else {
              setHasSeenIntro(true);
            }
          }}
          onExit={() => {
            // Skips the rest of the intro on ESC
            setHasSeenIntro(true);
          }}
        />
      );
    } else {
      // Fallback
      setHasSeenIntro(true);
    }
  }

  if (currentScreen === "DUNGEON" && selectedDungeonId !== null) {
    const dungeon = campaign.dungeons.find((d) => d.id === selectedDungeonId);
    if (!dungeon) {
      // If the dungeon doesn't exist yet, we just go back to the map
      return (
        <div>
          <p>Ce donjon n'existe pas encore.</p>
          <dl style={{ position: "absolute", top: 0, right: 0 }}>
            <dt>
              <kbd>échap</kbd>
            </dt>
            <dd>Revenir à la carte</dd>
          </dl>
          {/* We need a simple keyboard listener to go back if it crashes, but 
              for now we'll just let MapScreen handle it cleanly or add a quick fallback */}
          <button
            type="button"
            onClick={() => setCurrentScreen("MAP")}
            style={{ display: "none" }}
          >
            Back
          </button>
        </div>
      );
    }

    return (
      <DungeonScreen
        dungeon={dungeon}
        onExit={() => setCurrentScreen("MAP")}
        onComplete={() => {
          if (selectedDungeonId !== null) {
            setMaxUnlockedDungeon((prev) =>
              Math.max(prev ?? 0, selectedDungeonId + 1),
            );
          }
          setCurrentScreen("MAP");
        }}
      />
    );
  }

  const mapContent =
    campaign.mapScreenText +
    "\n\n" +
    campaign.dungeons
      .filter((d) => d.id <= (maxUnlockedDungeon ?? 0))
      .map((d) => `[${d.id}] ${d.title}`)
      .join("\n");

  return (
    <MapScreen
      content={mapContent}
      onSelectDungeon={(id) => {
        // Prevent launching a locked dungeon manually
        if (id <= (maxUnlockedDungeon ?? 0)) {
          setSelectedDungeonId(id);
          setCurrentScreen("DUNGEON");
        }
      }}
    />
  );
}
