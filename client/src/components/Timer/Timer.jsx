import { useTimer } from '../../hooks/useTimer';
import './Timer.css';

const SESSION_LABELS = {
  work: 'Work',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function Timer() {
  const { timeRemaining, isRunning, sessionType, sessionCount, start, pause, reset } = useTimer();

  return (
    <div className="timer">
      <p className="timer__session-type">{SESSION_LABELS[sessionType]}</p>
      <p className="timer__countdown">{formatTime(timeRemaining)}</p>
      <p className="timer__session-count">Sessions completed: {sessionCount}</p>
      <div className="timer__controls">
        <button className="timer__btn" onClick={isRunning ? pause : start}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="timer__btn timer__btn--secondary" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
