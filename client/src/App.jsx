import Timer from './components/Timer/Timer';
import TaskList from './components/TaskList/TaskList';
import Settings from './components/Settings/Settings';
import { useAuth } from './context/AuthContext';
import './App.css';

// Top-level authenticated layout: timer, task list, settings.
function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="app">
      <h1 className="app__title">Just Pomodoro</h1>
      <Timer />
      <div className="app__panels">
        {isAuthenticated && <TaskList />}
        {isAuthenticated && <Settings />}
      </div>
      <button className="app__logout" onClick={logout}>Logout</button>
    </main>
  );
}

export default App;
