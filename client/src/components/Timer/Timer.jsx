import { useTimer } from '../../hooks/useTimer';
import { useSettings } from '../../context/SettingsContext';
import './Timer.css';

const SESSION_LABELS = {
  work: 'Work',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

// Format a number of seconds as MM:SS.
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Pomodoro countdown display backed by the useTimer hook.
export default function Timer() {
  const { settings } = useSettings();
  const { timeRemaining, isRunning, sessionType, sessionCount, autoStart, start, pause, reset, toggleAutoStart } = useTimer({
    sessionsBeforeLongBreak: settings?.sessions_before_long_break,
  });

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
        <button
          className={`timer__btn timer__btn--auto ${autoStart ? 'timer__btn--auto-on' : ''}`}
          onClick={toggleAutoStart}
        >
          Auto {autoStart ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
