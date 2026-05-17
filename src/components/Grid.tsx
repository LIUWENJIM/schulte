import { useState, useCallback } from 'react';
import type { GridSize } from '../types';

interface GridProps {
  size: GridSize;
  numbers: number[];
  onCellClick: (num: number) => void;
  nextNumber: number;
  disabled: boolean;
  wrongCell: number | null;
}

export default function Grid({ size, numbers, onCellClick, nextNumber, disabled, wrongCell }: GridProps) {
  const [touchedCell, setTouchedCell] = useState<number | null>(null);

  const handleClick = useCallback((num: number) => {
    if (disabled) return;
    setTouchedCell(num);
    setTimeout(() => setTouchedCell(null), 150);
    onCellClick(num);
  }, [disabled, onCellClick]);

  const getCellSize = () => {
    if (size <= 4) return 'text-2xl sm:text-3xl';
    if (size === 5) return 'text-xl sm:text-2xl';
    if (size === 6) return 'text-lg sm:text-xl';
    return 'text-base sm:text-lg';
  };

  const getGap = () => {
    if (size <= 4) return 'gap-2';
    if (size === 5) return 'gap-1.5';
    return 'gap-1';
  };

  return (
    <div
      className={`grid ${getGap()} w-full max-w-[400px] mx-auto aspect-square`}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {numbers.map((num) => {
        const isCompleted = num < nextNumber;
        const isWrong = num === wrongCell;
        const isTouched = num === touchedCell;

        let bg = 'var(--color-canvas)';
        let textColor = 'var(--color-ink)';
        let border = 'var(--color-hairline)';
        let extraClass = '';

        if (isCompleted) {
          bg = 'rgba(93,184,114,0.08)';
          textColor = 'rgba(93,184,114,0.4)';
          border = 'rgba(93,184,114,0.15)';
        } else if (isWrong) {
          bg = 'rgba(198,69,69,0.08)';
          textColor = 'var(--color-error)';
          border = 'rgba(198,69,69,0.3)';
          extraClass = 'animate-shake';
        } else if (isTouched) {
          bg = 'var(--color-primary)';
          textColor = 'var(--color-on-primary)';
          border = 'var(--color-primary)';
          extraClass = 'animate-pop';
        }

        return (
          <button
            key={num}
            onClick={() => handleClick(num)}
            disabled={disabled || isCompleted}
            className={`flex items-center justify-center rounded-lg font-medium transition-all duration-100 ${getCellSize()} ${extraClass} ${
              isCompleted ? 'cursor-default' : 'cursor-pointer active:scale-95'
            }`}
            style={{
              background: bg,
              color: textColor,
              border: `1.5px solid ${border}`,
              aspectRatio: '1',
            }}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
