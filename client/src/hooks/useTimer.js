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
  durations: DURATIONS,
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
      return { ...state, isRunning: false, timeRemaining: state.durations[state.sessionType] };
    case 'TICK': {
      if (state.timeRemaining <= 1) {
        const { sessionType, sessionCount } = nextSession(state.sessionType, state.sessionCount, state.sessionsBeforeLongBreak);
        return { ...state, isRunning: state.autoStart, sessionType, sessionCount, timeRemaining: state.durations[sessionType] };
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    }
    case 'SWITCH_SESSION_TYPE': {
      const { sessionType } = action;
      if (!DURATIONS[sessionType]) return state;
      return { ...state, isRunning: false, sessionType, timeRemaining: state.durations[sessionType] };
    }
    case 'SKIP_SESSION': {
      const { sessionType, sessionCount } = nextSession(state.sessionType, state.sessionCount, state.sessionsBeforeLongBreak);
      return { ...state, isRunning: state.autoStart, sessionType, sessionCount, timeRemaining: state.durations[sessionType] };
    }
    case 'TOGGLE_AUTO_START':
      return { ...state, autoStart: !state.autoStart };
    case 'SET_DURATIONS':
      return { ...state, durations: action.durations, timeRemaining: action.durations[state.sessionType]};
    case 'SET_SESSIONS_BEFORE_LONG_BREAK':
      return { ...state, sessionsBeforeLongBreak: action.value };
    default:
      return state;
  }
}

// Plays alarm sound when timer ends
function playAlarm(src, volume = 1) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch((err) => {console.log("Playback blocked or failed", err)});
}

// Timer hook driving the Pomodoro state machine and auto-saving completed work sessions.
export function useTimer({ sessionsBeforeLongBreak, workDuration, shortBreak, longBreak, alarmSrc, alarmVolume, soundEnabled } = {}) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const prevSessionCountRef = useRef(state.sessionCount);
  const prevTimeRemainingRef = useRef(state.timeRemaining)
  const alarmSrcRef = useRef(alarmSrc);
  const alarmVolumeRef = useRef(alarmVolume);

  useEffect(() => {
    alarmSrcRef.current = alarmSrc;
  }, [alarmSrc]);

  useEffect(() => {
    alarmVolumeRef.current = alarmVolume;
  }, [alarmVolume]);

  useEffect(() => {
    const work = workDuration ? workDuration * 60 : DURATIONS.work;
    const short_break = shortBreak ? shortBreak * 60 : DURATIONS.short_break;
    const long_break = longBreak ? longBreak * 60 : DURATIONS.long_break;

    dispatch({
      type: 'SET_DURATIONS',
      durations: { work, short_break, long_break},
    });
  }, [workDuration, shortBreak, longBreak])

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

  // plays alarm when session ends - detected by timeRemaining jumping back up
  useEffect(() => {
    const prev = prevTimeRemainingRef.current;
    const curr = state.timeRemaining;
    
    if(soundEnabled && prev <= 1 && curr > 1) {
      playAlarm(alarmSrcRef.current, alarmVolumeRef.current);
    }

    prevTimeRemainingRef.current = curr;
  }, [state.timeRemaining, soundEnabled]);

  useEffect(() => {
    const prev = prevSessionCountRef.current;
    if (state.sessionCount > prev) {
      saveSession({
        duration: state.durations.work,
        type: 'work',
        completedAt: new Date().toISOString(),
      }).catch((err) => console.error('Failed to save session', err));
    }
    prevSessionCountRef.current = state.sessionCount;
  }, [state.sessionCount]);

  return {
    ...state,
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    reset: () => dispatch({ type: 'RESET' }),
    switchSessionType: (sessionType) => dispatch({ type: 'SWITCH_SESSION_TYPE', sessionType }),
    skip: () => dispatch({ type: 'SKIP_SESSION' }),
    toggleAutoStart: () => dispatch({ type: 'TOGGLE_AUTO_START' }),
  };
}
