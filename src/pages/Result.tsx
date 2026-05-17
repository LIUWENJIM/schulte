import { useLocation, useNavigate } from 'react-router-dom';
import type { TrainingRecord, GridSize } from '../types';
import { getGradeColor, getGradeLabel, getTargetTime } from '../utils/scoring';
import Layout from '../components/Layout';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.record as TrainingRecord | undefined;

  if (!record) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 animate-scale-in">
            <div className="text-5xl">😅</div>
            <div style={{ color: 'var(--color-muted)' }}>没有找到训练记录</div>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              返回首页
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const gradeColor = getGradeColor(record.grade);
  const gradeLabel = getGradeLabel(record.grade);
  const targetTime = getTargetTime(record.gridSize as GridSize);
  const isUnderTarget = record.totalTime <= targetTime;
  const isPerfect = record.errors === 0 && isUnderTarget;

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in-up">
          {/* Grade badge */}
          <div className="text-center">
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
            <div className="mt-3 text-lg font-semibold" style={{ color: gradeColor }}>
              {gradeLabel}
            </div>
            {isPerfect && (
              <div className="mt-2 text-xs font-medium px-3 py-1 rounded-full inline-block" style={{ background: 'rgba(212,160,23,0.1)', color: 'var(--color-warning)', border: '1px solid rgba(212,160,23,0.2)' }}>
                完美通关
              </div>
            )}
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-5xl font-semibold tracking-tight" style={{ color: 'var(--color-ink)', letterSpacing: '-1px' }}>
              {record.score}
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>总分</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="text-center p-3.5 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
              <div className="text-xl font-semibold" style={{ color: isUnderTarget ? 'var(--color-success)' : 'var(--color-ink)' }}>
                {record.totalTime.toFixed(1)}
              </div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>
                秒 {isUnderTarget ? '✓' : `/ ${targetTime}s`}
              </div>
            </div>
            <div className="text-center p-3.5 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
              <div className="text-xl font-semibold" style={{ color: record.errors === 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                {record.errors}
              </div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>错误</div>
            </div>
            <div className="text-center p-3.5 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
              <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                {record.gridSize}×{record.gridSize}
              </div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>网格</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => navigate(`/play/${record.gridSize}`)}
              className="w-full py-3.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97]"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              再来一次
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97]"
              style={{ background: 'var(--color-canvas)', color: 'var(--color-muted)', border: '1px solid var(--color-hairline)' }}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
