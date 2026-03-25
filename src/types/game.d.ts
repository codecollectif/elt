export interface BasePhase {
  id: string;
  type: "NARRATIVE" | "ACTION" | "BOSS" | "TYPING_TRAINER";
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

export interface BossPhase extends BasePhase {
  type: "BOSS";
  concept: string;
  initialCode?: string;
  expectedOutput?: string;
  mockPromptReturns?: string[];
}

export interface TypingPhase extends BasePhase {
  type: "TYPING_TRAINER";
  concept: string;
  lines: string[];
  helpLabel?: string;
  fontSize?: string;
  letterSpacing?: string;
}

export type Phase = NarrativePhase | ActionPhase | TypingPhase | BossPhase;

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
