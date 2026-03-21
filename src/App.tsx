import { useState } from "react";
import { KeyboardHelp } from "./components/ui/KeyboardHelp";
import { campaign } from "./data/campaign";
import useLocalStorage from "./hooks/useLocalStorage";
import { DungeonScreen } from "./screens/DungeonScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { MapScreen } from "./screens/MapScreen";

export default function App() {
  const [hasSeenIntro, setHasSeenIntro] = useLocalStorage<boolean>(
    "hasSeenIntro",
    false,
  );
  const [currentScreen, setCurrentScreen] = useState<"MAP" | "DUNGEON">("MAP");
  const [selectedDungeonId, setSelectedDungeonId] = useState<number | null>(
    null,
  );
  const [maxUnlockedDungeon, setMaxUnlockedDungeon] = useLocalStorage<number>(
    "maxUnlockedDungeon",
    0,
  );

  if (!hasSeenIntro) {
    return <IntroScreen onComplete={() => setHasSeenIntro(true)} />;
  }

  if (currentScreen === "DUNGEON" && selectedDungeonId !== null) {
    const dungeon = campaign.dungeons.find((d) => d.id === selectedDungeonId);
    if (!dungeon) {
      // If the dungeon doesn't exist yet, we just go back to the map
      return (
        <div>
          <p>Ce donjon n'existe pas encore.</p>
          <KeyboardHelp
            shortcuts={[{ keys: ["échap"], description: "Revenir à la carte" }]}
          />
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
