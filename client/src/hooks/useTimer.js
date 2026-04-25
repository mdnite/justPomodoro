import { useReducer, useEffect } from 'react';

const DURATIONS = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const initialState = {
  timeRemaining: DURATIONS.work,
  isRunning: false,
  sessionType: 'work',
  sessionCount: 0,
};

function nextSession(sessionType, sessionCount) {
  if (sessionType === 'work') {
    const newCount = sessionCount + 1;
    return { sessionType: newCount % 4 === 0 ? 'long_break' : 'short_break', sessionCount: newCount };
  }
  return { sessionType: 'work', sessionCount };
}

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
        const { sessionType, sessionCount } = nextSession(state.sessionType, state.sessionCount);
        return { ...state, isRunning: false, sessionType, sessionCount, timeRemaining: DURATIONS[sessionType] };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    }
    case 'SWITCH_SESSION': {
      const { sessionType, sessionCount } = nextSession(state.sessionType, state.sessionCount);
      return { ...state, isRunning: false, sessionType, sessionCount, timeRemaining: DURATIONS[sessionType] };
    }
    default:
      return state;
  }
}

export function useTimer() {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    if (!state.isRunning) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.isRunning]);

  return {
    ...state,
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    reset: () => dispatch({ type: 'RESET' }),
    switchSession: () => dispatch({ type: 'SWITCH_SESSION' }),
  };
}
