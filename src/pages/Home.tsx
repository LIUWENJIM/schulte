import { useNavigate } from 'react-router-dom';
import type { GridSize } from '../types';
import { getRecentRecords, getRecords } from '../utils/storage';
import HistoryList from '../components/HistoryList';

const GRID_SIZES: { size: GridSize; label: string; desc: string }[] = [
  { size: 3, label: '3×3', desc: '入门' },
  { size: 4, label: '4×4', desc: '简单' },
  { size: 5, label: '5×5', desc: '标准' },
  { size: 6, label: '6×6', desc: '困难' },
  { size: 7, label: '7×7', desc: '大师' },
];

export default function Home() {
  const navigate = useNavigate();
  const recentRecords = getRecentRecords(5);
  const totalGames = getRecords().length;

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
      {/* Hero */}
      <div className="relative px-6 pt-14 pb-10 text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-primary)', boxShadow: '0 8px 24px rgba(204,120,92,0.2)' }}>
          <span className="text-4xl">🎯</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1" style={{ color: 'var(--color-ink)', letterSpacing: '-0.5px' }}>
          舒尔特方格
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          训练注意力 · 提升专注力
        </p>
        {totalGames > 0 && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--color-surface-card)', color: 'var(--color-muted)', border: '1px solid var(--color-hairline)' }}>
            已训练 {totalGames} 次
          </div>
        )}
      </div>

      {/* Grid selector */}
      <div className="px-4 mb-6 animate-fade-in-up delay-100">
        <h2 className="text-xs font-medium uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--color-muted-soft)', letterSpacing: '1.5px' }}>
          选择难度
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {GRID_SIZES.map(({ size, desc }) => (
            <button
              key={size}
              onClick={() => navigate(`/play/${size}`)}
              className="group flex flex-col items-center py-3.5 rounded-xl transition-all duration-150 active:scale-[0.97]"
              style={{
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline)',
              }}
            >
              <span className="text-lg font-semibold mb-0.5 transition-transform group-hover:scale-105" style={{ color: 'var(--color-ink)' }}>
                {size}×{size}
              </span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-muted-soft)' }}>{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div className="px-4 mb-8 animate-fade-in-up delay-200">
        <button
          onClick={() => navigate('/play/5')}
          className="w-full py-3.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          快速开始 · 5×5 标准
        </button>
      </div>

      {/* Recent records */}
      <div className="flex-1 px-4 pb-6 animate-fade-in-up delay-300">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted-soft)', letterSpacing: '1.5px' }}>
            最近训练
          </h2>
          {recentRecords.length > 0 && (
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              查看全部 →
            </button>
          )}
        </div>
        <HistoryList records={recentRecords} />
      </div>
    </div>
  );
}
