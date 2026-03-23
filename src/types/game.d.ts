export interface BasePhase {
  id: string;
  type: "NARRATIVE" | "ACTION" | "TYPING_CHALLENGE" | "BOSS";
}

export interface NarrativePhase extends BasePhase {
  type: "NARRATIVE";
  content: string; // The text to reveal
}

export interface ActionPhase extends BasePhase {
  type: "ACTION";
  content: string;
  actionDescription: string; // The UI representation (e.g. "Ouvrir le lien")
  onAction: () => void;
}

export interface TypingChallengePhase extends BasePhase {
  type: "TYPING_CHALLENGE";
  concept: string; // Technical concept ("console.log")
  challenges: string[]; // List of strings to type perfectly
}

export interface BossPhase extends BasePhase {
  type: "BOSS";
  concept: string; // E.g., "Mets en pratique ce que tu as appris"
  initialCode?: string; // E.g., "// Écris ton code\n"
  expectedOutput?: string; // If provided, the code must log this exactly to proceed
  mockPromptReturns?: string[]; // E.g., ["non", "jamais", "oui"]
}

export type Phase =
  | NarrativePhase
  | ActionPhase
  | TypingChallengePhase
  | BossPhase;

export interface Dungeon {
  id: number;
  title: string;
  concept?: string;
  phases: Phase[];
}

export interface Campaign {
  intro: Phase[];
  tableOfContentsScreenText: string;
  dungeons: Dungeon[];
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "code-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTextAreaElement> & {
          language: string;
          value?: string;
        },
        HTMLTextAreaElement
      >;
    }
  }
}
