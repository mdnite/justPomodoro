import { useState } from 'react';
import Timer from './components/Timer/Timer';
import TaskList from './components/TaskList/TaskList';
import SettingsButton from './components/Settings/SettingsButton';
import SettingsModal from './components/Settings/SettingsModal';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';
import { useTimer } from './hooks/useTimer';
import './App.css';

// Top-level authenticated layout: timer, task list, settings entry-points.
function App() {
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const timer = useTimer({
    sessionsBeforeLongBreak: settings?.sessions_before_long_break,
    workDuration: settings?.work_duration,
    shortBreak: settings?.short_break,
    longBreak: settings?.long_break,
  });
  // Whether the settings modal is currently open.
  const [showSettings, setShowSettings] = useState(false);

  // Toggle the settings modal open/closed.
  function handleSettingsToggle() {
    setShowSettings((prev) => !prev);
  }

  // Close the settings modal.
  function closeSettings() {
    setShowSettings(false);
  }

  return (
    <main className="app">
      {isAuthenticated && <SettingsButton onClick={handleSettingsToggle} />}
      <h1 className="app__title">Just Pomodoro</h1>
      <Timer timer={timer} />
      <div className="app__panels">
        {isAuthenticated && <TaskList />}
      </div>
      <button className="app__logout" onClick={logout}>Logout</button>

      {isAuthenticated && (
        <SettingsModal
          isOpen={showSettings}
          onClose={closeSettings}
          autoStart={timer.autoStart}
          toggleAutoStart={timer.toggleAutoStart}
        />
      )}
    </main>
  );
}

export default App;
