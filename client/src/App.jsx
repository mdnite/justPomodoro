import Timer from './components/Timer/Timer';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { logout } = useAuth();

  return (
    <main className="app">
      <h1 className="app__title">Just Pomodoro</h1>
      <Timer />
      <button className="app__logout" onClick={logout}>Logout</button>
    </main>
  );
}

export default App;
