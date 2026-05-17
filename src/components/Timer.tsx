import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
}

export default function Timer({ isRunning, onTimeUpdate }: TimerProps) {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
        setTime(elapsed);
        onTimeUpdate?.(elapsed);
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const ms = Math.floor((t * 10) % 10);
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
    }
    return `${secs}.${ms}`;
  };

  return (
    <div className="text-center">
      <div className="text-3xl font-semibold tabular-nums tracking-tight" style={{ color: 'var(--color-ink)', letterSpacing: '-0.5px' }}>
        {formatTime(time)}
      </div>
    </div>
  );
}
