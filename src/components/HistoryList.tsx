import type { TrainingRecord } from '../types';
import { getGradeColor } from '../utils/scoring';

interface HistoryListProps {
  records: TrainingRecord[];
}

export default function HistoryList({ records }: HistoryListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-10 rounded-lg" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)' }}>
        <div className="text-4xl mb-2">📊</div>
        <div className="text-sm" style={{ color: 'var(--color-muted)' }}>暂无训练记录</div>
        <div className="text-xs mt-1" style={{ color: 'var(--color-muted-soft)' }}>开始你的第一次训练吧</div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `今天 ${time}`;
    if (isYesterday) return `昨天 ${time}`;
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + ' ' + time;
  };

  return (
    <div className="space-y-1.5">
      {records.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-3 rounded-lg transition-colors"
          style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: getGradeColor(record.grade) }}
            >
              {record.grade}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                {record.gridSize}×{record.gridSize} 网格
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>
                {formatDate(record.date)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
              {record.score}<span className="text-[11px] font-normal ml-0.5" style={{ color: 'var(--color-muted-soft)' }}>分</span>
            </div>
            <div className="text-[11px]" style={{ color: 'var(--color-muted-soft)' }}>
              {record.totalTime.toFixed(1)}s · {record.errors}错
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
