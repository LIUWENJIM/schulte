import type { TrainingRecord } from '../types';

const STORAGE_KEY = 'schulte_records';

export function getRecords(): TrainingRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: TrainingRecord): void {
  const records = getRecords();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function clearRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getBestScore(gridSize: number): TrainingRecord | null {
  const records = getRecords().filter(r => r.gridSize === gridSize);
  if (records.length === 0) return null;
  return records.reduce((best, r) => r.score > best.score ? r : best);
}

export function getRecentRecords(count: number): TrainingRecord[] {
  return getRecords().slice(0, count);
}
