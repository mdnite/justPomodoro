import { useReducer, useEffect, useRef } from 'react';
import { saveSession } from '../services/sessionService';

const DURATIONS = {
  work: 1 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const DEFAULT_SESSIONS_BEFORE_LONG_BREAK = 4;

const initialState = {
  timeRemaining: DURATIONS.work,
  isRunning: false,
  sessionType: 'work',
  sessionCount: 0,
  autoStart: false,
  sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
};

// Pick the next session type and updated count given the current session.
function nextSession(sessionType, sessionCount, sessionsBeforeLongBreak) {
  if (sessionType === 'work') {
    const newCount = sessionCount + 1;
    return {
      sessionType: newCount % sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break',
      sessionCount: newCount,
    };
  }
  return { sessionType: 'work', sessionCount };
}

// Pure reducer for all timer state transitions.
function timerReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return { ...state, isRunning: false, timeRemaining: DURATIONS[state.sessionType] };
    case 'TICK': {
      if (state.timeRemaining <= 1) {
        const { sessionType, sessionCount } = nextSession(state.sessionType, state.sessionCount, state.sessionsBeforeLongBreak);
        return { ...state, isRunning: state.autoStart, sessionType, sessionCount, timeRemaining: DURATIONS[sessionType] };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    }
    case 'SWITCH_SESSION': {
      const { sessionType, sessionCount } = nextSession(state.sessionType, state.sessionCount, state.sessionsBeforeLongBreak);
      return { ...state, isRunning: false, sessionType, sessionCount, timeRemaining: DURATIONS[sessionType] };
    }
    case 'TOGGLE_AUTO_START':
      return { ...state, autoStart: !state.autoStart };
    case 'SET_SESSIONS_BEFORE_LONG_BREAK':
      return { ...state, sessionsBeforeLongBreak: action.value };
    default:
      return state;
  }
}

// Timer hook driving the Pomodoro state machine and auto-saving completed work sessions.
export function useTimer({ sessionsBeforeLongBreak } = {}) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const prevSessionTypeRef = useRef(state.sessionType);

  useEffect(() => {
    const value = Number(sessionsBeforeLongBreak);
    if (Number.isFinite(value) && value > 0 && value !== state.sessionsBeforeLongBreak) {
      dispatch({ type: 'SET_SESSIONS_BEFORE_LONG_BREAK', value });
    }
  }, [sessionsBeforeLongBreak, state.sessionsBeforeLongBreak]);

  useEffect(() => {
    if (!state.isRunning) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.isRunning]);

  useEffect(() => {
    const prev = prevSessionTypeRef.current;
    if (prev === 'work' && state.sessionType !== 'work') {
      saveSession({
        duration: DURATIONS.work,
        type: 'work',
        completedAt: new Date().toISOString(),
      }).catch((err) => console.error('Failed to save session', err));
    }
    prevSessionTypeRef.current = state.sessionType;
  }, [state.sessionType]);

  return {
    ...state,
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    reset: () => dispatch({ type: 'RESET' }),
    switchSession: () => dispatch({ type: 'SWITCH_SESSION' }),
    toggleAutoStart: () => dispatch({ type: 'TOGGLE_AUTO_START' }),
  };
}
