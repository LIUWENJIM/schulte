import { useState, useMemo } from 'react';
import type { GridSize, TrainingRecord } from '../types';
import { getRecords, clearRecords } from '../utils/storage';
import { getGradeColor } from '../utils/scoring';
import Layout from '../components/Layout';

const GRID_SIZES: GridSize[] = [3, 4, 5, 6, 7];

export default function History() {
  const [filter, setFilter] = useState<GridSize | 0>(0);
  const [records, setRecords] = useState<TrainingRecord[]>(getRecords());

  const filteredRecords = useMemo(() => {
    if (filter === 0) return records;
    return records.filter(r => r.gridSize === filter);
  }, [records, filter]);

  const stats = useMemo(() => {
    const data = filter === 0 ? records : records.filter(r => r.gridSize === filter);
    if (data.length === 0) return null;

    const avgScore = Math.round(data.reduce((s, r) => s + r.score, 0) / data.length);
    const avgTime = (data.reduce((s, r) => s + r.totalTime, 0) / data.length).toFixed(1);
    const bestScore = Math.max(...data.map(r => r.score));
    const gradeCount = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    data.forEach(r => gradeCount[r.grade]++);

    return { total: data.length, avgScore, avgTime, bestScore, gradeCount };
  }, [records, filter]);

  const handleClear = () => {
    if (confirm('确定要清空所有训练记录吗？此操作不可撤销。')) {
      clearRecords();
      setRecords([]);
    }
  };

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
    <Layout>
      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {/* Filters */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 animate-fade-in-up">
          <button
            onClick={() => setFilter(0)}
            className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150"
            style={{
              background: filter === 0 ? 'var(--color-surface-card)' : 'transparent',
              color: filter === 0 ? 'var(--color-ink)' : 'var(--color-muted)',
              border: `1px solid ${filter === 0 ? 'var(--color-hairline)' : 'transparent'}`,
            }}
          >
            全部
          </button>
          {GRID_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setFilter(size)}
              className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150"
              style={{
                background: filter === size ? 'var(--color-surface-card)' : 'transparent',
                color: filter === size ? 'var(--color-ink)' : 'var(--color-muted)',
                border: `1px solid ${filter === size ? 'var(--color-hairline)' : 'transparent'}`,
              }}
            >
              {size}×{size}
            </button>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-2 mb-4 animate-fade-in-up delay-100">
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}>
              <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{stats.total}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>总训练次数</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}>
              <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{stats.avgScore}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>平均分数</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}>
              <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{stats.avgTime}s</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>平均用时</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}>
              <div className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>{stats.bestScore}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>最高分数</div>
            </div>
          </div>
        )}

        {/* Grade distribution */}
        {stats && (
          <div className="flex gap-1.5 mb-4 animate-fade-in-up delay-200">
            {(['S', 'A', 'B', 'C', 'D'] as const).map(grade => (
              <div
                key={grade}
                className="flex-1 text-center py-2 rounded-md"
                style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}
              >
                <div className="text-base font-semibold" style={{ color: getGradeColor(grade) }}>{stats.gradeCount[grade]}</div>
                <div className="text-[10px]" style={{ color: 'var(--color-muted-soft)' }}>{grade}</div>
              </div>
            ))}
          </div>
        )}

        {/* Records */}
        <div className="flex-1 space-y-1.5 overflow-y-auto animate-fade-in-up delay-300">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 rounded-lg" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline-soft)' }}>
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm" style={{ color: 'var(--color-muted)' }}>暂无训练记录</div>
            </div>
          ) : (
            filteredRecords.map(record => (
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
                      {record.gridSize}×{record.gridSize}
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
            ))
          )}
        </div>

        {/* Clear button */}
        {records.length > 0 && (
          <button
            onClick={handleClear}
            className="w-full mt-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.97]"
            style={{ color: 'var(--color-error)', background: 'rgba(198,69,69,0.06)', border: '1px solid rgba(198,69,69,0.12)' }}
          >
            清空所有记录
          </button>
        )}
      </div>
    </Layout>
  );
}
