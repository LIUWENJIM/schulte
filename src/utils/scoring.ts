import type { GridSize, TrainingRecord } from '../types';

const TARGET_TIMES: Record<GridSize, number> = {
  3: 8,
  4: 15,
  5: 25,
  6: 40,
  7: 60,
};

export function calculateScore(
  gridSize: GridSize,
  totalTime: number,
  errors: number
): { score: number; grade: TrainingRecord['grade'] } {
  const totalCells = gridSize * gridSize;
  const baseScore = totalCells * 2;
  const targetTime = TARGET_TIMES[gridSize];
  const timeBonus = Math.max(0, targetTime - totalTime) * 4;
  const errorPenalty = errors * 5;
  const score = Math.max(0, Math.round(baseScore + timeBonus - errorPenalty));

  let grade: TrainingRecord['grade'];
  if (score >= 150) grade = 'S';
  else if (score >= 120) grade = 'A';
  else if (score >= 90) grade = 'B';
  else if (score >= 60) grade = 'C';
  else grade = 'D';

  return { score, grade };
}

export function getTargetTime(gridSize: GridSize): number {
  return TARGET_TIMES[gridSize];
}

export function getGradeColor(grade: TrainingRecord['grade']): string {
  switch (grade) {
    case 'S': return '#f59e0b';
    case 'A': return '#22c55e';
    case 'B': return '#6366f1';
    case 'C': return '#94a3b8';
    case 'D': return '#ef4444';
  }
}

export function getGradeLabel(grade: TrainingRecord['grade']): string {
  switch (grade) {
    case 'S': return '大师级';
    case 'A': return '优秀';
    case 'B': return '良好';
    case 'C': return '一般';
    case 'D': return '需加强';
  }
}
