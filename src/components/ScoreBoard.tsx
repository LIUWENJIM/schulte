import type { TrainingRecord } from '../types';
import { getGradeColor, getGradeLabel, getTargetTime } from '../utils/scoring';
import type { GridSize } from '../types';

interface ScoreBoardProps {
  record: TrainingRecord;
  gridSize: GridSize;
}

export default function ScoreBoard({ record, gridSize }: ScoreBoardProps) {
  const gradeColor = getGradeColor(record.grade);
  const gradeLabel = getGradeLabel(record.grade);
  const targetTime = getTargetTime(gridSize);
  const isUnderTarget = record.totalTime <= targetTime;
  const isPerfect = record.errors === 0 && isUnderTarget;

  return (
    <div className="text-center space-y-5">
      {/* Grade */}
      <div className="space-y-2">
        <div className="relative inline-block">
          {isPerfect && (
            <div className="absolute inset-0 rounded-full animate-ping opacity-15" style={{ background: gradeColor }} />
          )}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl font-semibold text-white mx-auto"
            style={{
              background: gradeColor,
              boxShadow: `0 12px 32px ${gradeColor}30`,
            }}
          >
            {record.grade}
          </div>
        </div>
        <div className="text-lg font-semibold" style={{ color: gradeColor }}>
          {gradeLabel}
        </div>
        {isPerfect && (
          <div className="text-xs font-medium px-3 py-1 rounded-full inline-block" style={{ background: 'rgba(212,160,23,0.1)', color: 'var(--color-warning)', border: '1px solid rgba(212,160,23,0.2)' }}>
            完美通关
          </div>
        )}
      </div>

      {/* Score */}
      <div>
        <div className="text-5xl font-semibold tracking-tight" style={{ color: 'var(--color-ink)', letterSpacing: '-1px' }}>
          {record.score}
        </div>
        <div className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>总分</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
        <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
          <div className="text-xl font-semibold" style={{ color: isUnderTarget ? 'var(--color-success)' : 'var(--color-ink)' }}>
            {record.totalTime.toFixed(1)}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>
            秒 {isUnderTarget ? '✓' : `/ ${targetTime}s`}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
          <div className="text-xl font-semibold" style={{ color: record.errors === 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {record.errors}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>错误</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
          <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
            {record.gridSize}×{record.gridSize}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>网格</div>
        </div>
      </div>
    </div>
  );
}
