import { CodeEditor } from "../components/ui/CodeEditor";
import { KeyboardHelp } from "../components/ui/KeyboardHelp";

interface Props {
  onExit: () => void;
}

export function SandboxScreen({ onExit }: Props) {
  return (
    <div
      style={{
        padding: "2rem",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <p style={{ color: "#aaa", marginBottom: "1rem", fontWeight: "bold" }}>
        === Le bac à sable (mode libre) ===
      </p>

      <CodeEditor
        initialCode={`// Ce que tu connais :
// console.log(expression);
// const answer = prompt(question);
// if (condition) { doSomething(); }
// while (condition) { repeatSomething(); }

// Ton espace de code libre. Aucun objectif, aucune restriction.

console.log("Amuse-toi bien !");
`}
        onExit={onExit}
        showDownloadButton
        useMainThread
      />

      <KeyboardHelp
        shortcuts={[
          {
            keys: ["ctrl", "entrée"],
            description: "Exécuter le code",
          },
          { keys: ["échap"], description: "Revenir au sommaire" },
        ]}
      />
    </div>
  );
}
