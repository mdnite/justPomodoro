import Timer from './components/Timer/Timer';
import TaskList from './components/TaskList/TaskList';
import Settings from './components/Settings/Settings';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';
import { useTimer } from './hooks/useTimer';
import './App.css';

// Top-level authenticated layout: timer, task list, settings.
function App() {
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const timer = useTimer({ sessionsBeforeLongBreak: settings?.sessions_before_long_break,
                           workDuration: settings?.work_duration,
                           shortBreak: settings?.short_break,
                           longBreak: settings?.long_break,
   });

  return (
    <main className="app">
      <h1 className="app__title">Just Pomodoro</h1>
      <Timer timer={timer} />
      <div className="app__panels">
        {isAuthenticated && <TaskList />}
        {isAuthenticated && (
          <Settings autoStart={timer.autoStart} toggleAutoStart={timer.toggleAutoStart} />
        )}
      </div>
      <button className="app__logout" onClick={logout}>Logout</button>
    </main>
  );
}

export default App;
