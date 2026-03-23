import { useState } from "react";
import { campaign } from "./data/campaign";
import useLocalStorage from "./hooks/useLocalStorage";
import { DungeonScreen } from "./screens/DungeonScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { SandboxScreen } from "./screens/SandboxScreen";
import { TableOfContentsScreen } from "./screens/TableOfContentsScreen";

export default function App() {
  const [hasSeenIntro, setHasSeenIntro, clearHasSeenIntro] =
    useLocalStorage<boolean>("hasSeenIntro", false);
  const [currentScreen, setCurrentScreen] = useState<
    "TABLE_OF_CONTENTS" | "DUNGEON" | "SANDBOX"
  >("TABLE_OF_CONTENTS");
  const [selectedDungeonId, setSelectedDungeonId] = useState<number | null>(
    null,
  );
  const [maxUnlockedDungeon, setMaxUnlockedDungeon, clearMaxUnlockedDungeon] =
    useLocalStorage<number>("maxUnlockedDungeon", 0);

  if (!hasSeenIntro) {
    return <IntroScreen onComplete={() => setHasSeenIntro(true)} />;
  }

  if (currentScreen === "DUNGEON" && selectedDungeonId !== null) {
    const dungeon = campaign.dungeons.find((d) => d.id === selectedDungeonId);

    if (dungeon == null) {
      throw new Error("Dungeon not found");
    }

    return (
      <DungeonScreen
        dungeon={dungeon}
        onExit={() => setCurrentScreen("TABLE_OF_CONTENTS")}
        onComplete={() => {
          setMaxUnlockedDungeon((prev) =>
            Math.max(prev ?? 0, selectedDungeonId + 1),
          );
          setCurrentScreen("TABLE_OF_CONTENTS");
        }}
      />
    );
  }

  if (currentScreen === "SANDBOX") {
    return (
      <SandboxScreen onExit={() => setCurrentScreen("TABLE_OF_CONTENTS")} />
    );
  }

  const tableOfContentsText =
    campaign.tableOfContentsScreenText +
    "\n\n" +
    campaign.dungeons
      .filter((d) => d.id <= (maxUnlockedDungeon ?? 0))
      .map((d) => `[${d.id}] ${d.title}`)
      .join("\n") +
    ((maxUnlockedDungeon ?? 0) >= 6 ? "\n\n[7] Le bac à sable" : "");

  return (
    <TableOfContentsScreen
      content={tableOfContentsText}
      onSelectDungeon={(id) => {
        // Empêche de lancer un donjon verrouillé
        if (id === 7 && (maxUnlockedDungeon ?? 0) >= 6) {
          setCurrentScreen("SANDBOX");
        } else if (id <= (maxUnlockedDungeon ?? 0)) {
          setSelectedDungeonId(id);
          setCurrentScreen("DUNGEON");
        }
      }}
      onReset={() => {
        clearHasSeenIntro();
        clearMaxUnlockedDungeon();
      }}
    />
  );
}
