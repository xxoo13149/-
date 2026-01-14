export interface Blank {
  id: number;
  answers: string[]; // Array of acceptable answers
}

export interface LevelHelp {
  analysis: string;
  keywords: string[];
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  codeSnippet: string; // Contains placeholders like ___1___
  blanks: Blank[];
  help: LevelHelp;
  hint?: string;
}

export enum GameState {
  WELCOME,
  PLAYING,
  COMPLETED
}

export interface UserProgress {
  levelIndex: number;
  score: number;
}