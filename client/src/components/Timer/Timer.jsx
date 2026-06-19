import SkipForwardButton from './SkipForwardButton';
import './Timer.css';

const SESSION_LABELS = {
  work: 'Work',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

const SESSION_TYPES = ['work', 'short_break', 'long_break'];

// Format a number of seconds as MM:SS.
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Pomodoro countdown display backed by the useTimer hook (lifted to App.jsx).
export default function Timer({ timer }) {
  const {
    timeRemaining,
    isRunning,
    sessionType,
    sessionCount,
    start,
    pause,
    reset,
    skip,
    switchSessionType,
  } = timer;

  return (
    <div className="timer">
      <div className="timer__switcher">
        {SESSION_TYPES.map((type) => (
          <button
            key={type}
            className={`timer__switch-btn ${sessionType === type ? 'timer__switch-btn--active' : ''}`}
            onClick={() => switchSessionType(type)}
          >
            {SESSION_LABELS[type]}
          </button>
        ))}
      </div>
      <p className="timer__session-type">{SESSION_LABELS[sessionType]}</p>
      <p className="timer__countdown">{formatTime(timeRemaining)}</p>
      <p className="timer__session-count">Sessions completed: {sessionCount}</p>
      <div className="timer__controls">
        <button className="timer__btn timer__btn--primary" onClick={isRunning ? pause : start}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="timer__btn timer__btn--secondary" onClick={reset}>
          Reset
        </button>
        <SkipForwardButton onClick={skip}/>
      </div>
    </div>
  );
}
