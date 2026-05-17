export interface TrainingRecord {
  id: string;
  date: number;
  gridSize: number;
  totalTime: number;
  errors: number;
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export type GridSize = 3 | 4 | 5 | 6 | 7;

export interface GameState {
  gridSize: GridSize;
  numbers: number[];
  nextNumber: number;
  errors: number;
  startTime: number | null;
  endTime: number | null;
  isRunning: boolean;
  isFinished: boolean;
}
