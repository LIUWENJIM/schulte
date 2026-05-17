import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { GridSize, TrainingRecord } from '../types';
import { generateNumbers } from '../utils/shuffle';
import { calculateScore, getTargetTime } from '../utils/scoring';
import { saveRecord, getBestScore } from '../utils/storage';
import Grid from '../components/Grid';
import Timer from '../components/Timer';
import Layout from '../components/Layout';

export default function Play() {
  const { size } = useParams<{ size: string }>();
  const navigate = useNavigate();
  const gridSize = (Number(size) || 5) as GridSize;

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [errors, setErrors] = useState(0);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const timerRef = useRef<number>(0);

  const totalCells = gridSize * gridSize;
  const targetTime = getTargetTime(gridSize);
  const bestScore = getBestScore(gridSize);

  const startGame = useCallback(() => {
    setNumbers(generateNumbers(gridSize));
    setNextNumber(1);
    setErrors(0);
    setWrongCell(null);
    timerRef.current = 0;
    setGameState('playing');
  }, [gridSize]);

  const handleTimeUpdate = useCallback((time: number) => {
    timerRef.current = time;
  }, []);

  const handleCellClick = useCallback((num: number) => {
    if (num === nextNumber) {
      const newNext = nextNumber + 1;
      setNextNumber(newNext);
      setWrongCell(null);

      if (newNext > totalCells) {
        const finalTime = timerRef.current;
        setGameState('finished');

        const { score, grade } = calculateScore(gridSize, finalTime, errors);
        const record: TrainingRecord = {
          id: Date.now().toString(),
          date: Date.now(),
          gridSize,
          totalTime: finalTime,
          errors,
          score,
          grade,
        };
        saveRecord(record);

        navigate('/result', { state: { record } });
      }
    } else {
      setErrors(prev => prev + 1);
      setWrongCell(num);
      setTimeout(() => setWrongCell(null), 300);
    }
  }, [nextNumber, totalCells, gridSize, errors, navigate]);

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {gameState === 'ready' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-scale-in">
            <div className="w-20 h-20 mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-surface-dark)', boxShadow: '0 8px 24px rgba(24,23,21,0.15)' }}>
              <span className="text-4xl">⚡</span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: 'var(--color-ink)', letterSpacing: '-0.3px' }}>
              {gridSize}×{gridSize} 舒尔特方格
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>
              按顺序从 1 点到 {totalCells}
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-8">
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
                <div className="text-base font-semibold" style={{ color: 'var(--color-ink)' }}>{gridSize}×{gridSize}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>网格</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
                <div className="text-base font-semibold" style={{ color: 'var(--color-primary)' }}>{targetTime}s</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>目标时间</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
                <div className="text-base font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {bestScore ? bestScore.score : '—'}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>最佳成绩</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full max-w-xs py-3.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97]"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              开始训练
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex-1 flex flex-col animate-fade-in-up">
            {/* Status bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{nextNumber}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>下一个</span>
              </div>

              <Timer isRunning={true} onTimeUpdate={handleTimeUpdate} />

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>错误</span>
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: errors > 0 ? 'rgba(198,69,69,0.08)' : 'var(--color-surface-card)', border: `1px solid ${errors > 0 ? 'rgba(198,69,69,0.2)' : 'var(--color-hairline)'}` }}>
                  <span className="text-sm font-semibold" style={{ color: errors > 0 ? 'var(--color-error)' : 'var(--color-success)' }}>{errors}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-hairline)' }}>
              <div
                className="h-full rounded-full transition-all duration-150 ease-out"
                style={{ width: `${((nextNumber - 1) / totalCells) * 100}%`, background: 'var(--color-primary)' }}
              />
            </div>

            {/* Game grid */}
            <div className="flex-1 flex items-center justify-center">
              <Grid
                size={gridSize}
                numbers={numbers}
                onCellClick={handleCellClick}
                nextNumber={nextNumber}
                disabled={false}
                wrongCell={wrongCell}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
