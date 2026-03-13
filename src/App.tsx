import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useLocalStorage from "./useLocalStorage";

type KeyboardEventListener = (event: KeyboardEvent) => void;

type Step = {
  id: number;
  content: string;
  listener?: (
    stateActions: {
      setChapterId: (value: number) => void;
      setStepIndex: (value: number) => void;
      setRevealPosition: (value: number) => void;
    },
    fallback: KeyboardEventListener,
  ) => KeyboardEventListener;
  help?: ReactNode;
};

type Chapter = {
  id: number;
  steps: Step[];
  next: number;
};

const chapters: Chapter[] = [
  {
    id: 0,
    steps: [
      {
        id: 1,
        content: `Tu es devant un clavier.

Les touches sont visibles.
Ce qu’elles déclenchent ne l’est pas.

Entre les touches, il y a un monde.
Entre.`,
        help: (
          <>
            <dt>
              <kbd>entrée</kbd>
            </dt>
            <dd>Continuer</dd>
          </>
        ),
      },
      {
        id: 2,
        content: `=== Entre les touches ===

- Introduction : l'épreuve du clavier.
- Chapitre 1 : la première parole.
- Chapitre 2 : la grotte de l'écho.
- Chapitre 3 : le temple des choix.
- Chapitre 4 : la tour du temps.
`,
        listener:
          (stateActions, fallback: KeyboardEventListener) =>
          (event: KeyboardEvent) => {
            if (event.key === "0") {
              stateActions.setChapterId(1);
              stateActions.setStepIndex(0);
              stateActions.setRevealPosition(0);
            } else {
              fallback(event);
            }
          },
        help: (
          <>
            <dt>
              <kbd>0</kbd>
            </dt>
            <dd>Commencer l'introduction</dd>
            <dt>
              <kbd>1</kbd>
            </dt>
            <dd>Commencer le chapitre 1</dd>
            <dt>
              <kbd>2</kbd>
            </dt>
            <dd>Commencer le chapitre 2</dd>
            <dt>
              <kbd>3</kbd>
            </dt>
            <dd>Commencer le chapitre 3</dd>
            <dt>
              <kbd>4</kbd>
            </dt>
            <dd>Commencer le chapitre 4</dd>
          </>
        ),
      },
    ],
    next: 1,
  },
  {
    id: 1,
    steps: [
      {
        id: 1,
        content: `Avant d’entrer,
tu dois prouver une chose.

Sais-tu parler avec un clavier,
symbole par symbole ?

Ici, aucun code.
Seulement des touches.

Cette épreuve se déroule ailleurs.

Lis. Tape. Observe.

Quand tu te sentiras à l'aise, reviens.`,
      },
      {
        id: 2,
        content: `🗝️ L'épreuve du Clavier

Ouvre le lieu d’entraînement :

https://www.keybr.com/fr

Objectifs :
- regarder et taper
- accepter l’erreur
- viser la précision, pas la vitesse

Durée recommandée :
10 à 15 minutes`,
        listener:
          (_stateActions, fallback: KeyboardEventListener) =>
          (event: KeyboardEvent) => {
            if (event.key === "Enter") {
              window.open("https://www.keybr.com/fr", "_blank")?.focus();
            } else {
              fallback(event);
            }
          },
        help: (
          <>
            <dt>
              <kbd>entrée</kbd>
            </dt>
            <dd>Ouvrir le lien</dd>
            <dt>
              <kbd>échap</kbd>
            </dt>
            <dd>Revenir à la carte</dd>
          </>
        ),
      },
    ],
    next: 0,
  },
];

function App() {
  const [revealPosition, setRevealPosition] = useState<number>(0);
  const [chapterId, setChapterId] = useLocalStorage<number>("chapterId", 0);
  const [stepIndex, setStepIndex] = useLocalStorage<number>("stepIndex", 0);

  const chapter = useMemo(
    () => chapters.find((chapter) => chapter.id === chapterId),
    [chapterId],
  );

  if (chapter == null) {
    throw new Error();
  }

  const step = useMemo(() => chapter.steps[stepIndex], [chapter, stepIndex]);

  const revealText = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setRevealPosition((old) => old + 1);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  const addKeyboardEventListener = useCallback(() => {
    const fallback = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (stepIndex + 1 < chapter.steps.length) {
          setStepIndex((old) => old + 1);
          setRevealPosition(0);
        }
      } else if (event.key === "Escape") {
        setChapterId(0);
        setStepIndex(1);
        setRevealPosition(0);
      }
    };

    const listener = step.listener
      ? step.listener(
          { setChapterId, setStepIndex, setRevealPosition },
          fallback,
        )
      : fallback;

    window.addEventListener("keydown", listener);
    window.focus();

    return () => window.removeEventListener("keydown", listener);
  }, [chapter, setChapterId, step, stepIndex, setStepIndex]);

  useEffect(() => {
    if (revealPosition < step.content.length) {
      return revealText();
    } else {
      return addKeyboardEventListener();
    }
  }, [revealPosition, revealText, addKeyboardEventListener, step]);

  return (
    <>
      {step.content
        .slice(0, revealPosition)
        .split("\n\n")
        .map((p) => (
          <p key={`p-${p}`}>
            {p.split("\n").map((line, i) => (
              <React.Fragment key={`l-${line}`}>
                {i !== 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        ))}
      {revealPosition === step.content.length && (
        <dl style={{ position: "absolute", top: 0, right: 0 }}>
          {step.help ?? (
            <>
              <dt>
                <kbd>entrée</kbd>
              </dt>
              <dd>Continuer</dd>
              <dt>
                <kbd>échap</kbd>
              </dt>
              <dd>Revenir à la carte</dd>
            </>
          )}
        </dl>
      )}
    </>
  );
}

export default App;
