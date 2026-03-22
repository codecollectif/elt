import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardHelp } from "../components/ui/KeyboardHelp";
import { useKeyboard } from "../hooks/useKeyboard";

interface Props {
  onExit: () => void;
}

export function SandboxScreen({ onExit }: Props) {
  const [output, setOutput] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const runCode = useCallback(() => {
    setOutput("");
    let logs = "";

    const originalLog = console.log;
    console.log = (...args) => {
      logs += `${args.join(" ")}\n`;
    };

    try {
      const code = inputRef.current?.value ?? "";
      // biome-ignore lint/security/noGlobalEval: it's a sandbox
      eval(code);
    } catch (error) {
      logs += `${error}\n`;
    } finally {
      console.log = originalLog;
      setOutput(logs || "/* Exécution terminée sans log */");
    }
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const nativeKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        runCode();
      } else if (e.key === "Escape") {
        onExit();
      }
    };

    el.addEventListener("keydown", nativeKeyDown, { capture: true });
    return () =>
      el.removeEventListener("keydown", nativeKeyDown, { capture: true });
  }, [runCode, onExit]);

  useKeyboard(
    useCallback(
      (e: KeyboardEvent) => {
        if (
          e.target === inputRef.current ||
          inputRef.current?.contains(e.target as Node)
        ) {
          return;
        }

        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          runCode();
        } else if (e.key === "Escape") {
          onExit();
        }
      },
      [runCode, onExit],
    ),
    [runCode, onExit],
  );

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

      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #333",
          borderRadius: "4px",
        }}
      >
        <code-input
          ref={inputRef}
          language="JavaScript"
          value={`// Ce que tu connais :
// console.log(expression);
// const answer = prompt(question);
// if (condition) { doSomething(); }
// while (condition) { repeatSomething(); }

// Ton espace de code libre. Aucun objectif, aucune restriction.

console.log("Amuse-toi bien !");
`}
        />
      </div>

      <div
        style={{
          background: "#000",
          padding: "1rem",
          minHeight: "100px",
          border: "1px solid #444",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          color: "#ccc",
        }}
      >
        {output ?? "/* Résultat de l'exécution... */"}
      </div>

      <KeyboardHelp
        shortcuts={[
          {
            keys: ["ctrl", "entrée"],
            description: "Exécuter le code",
          },
          { keys: ["échap"], description: "Revenir à la carte" },
        ]}
      />
    </div>
  );
}
