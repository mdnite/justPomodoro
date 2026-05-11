import { useEffect, useState } from 'react';
import * as taskService from '../../services/taskService';
import './TaskList.css';

const DELAY = 200;

// Task list panel — create, toggle complete, and delete tasks for the current user.
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);
  const [pendingComplete, setPendingComplete] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await taskService.getTasks();
        if (!cancelled) setTasks(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Submit the new-task form: create the task and prepend it to the list.
  async function handleCreate(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setError(null);
    try {
      const created = await taskService.createTask(trimmed);
      setTasks((prev) => [created, ...prev]);
      setTitle('');
    } catch (err) {
      setError(err.message);
    }
  }

  // Toggle a task's completion state and replace it in the list.
  async function handleToggle(task) {
    setError(null);
    const completing = !task.is_completed;

    // show checkmark immediately in active list
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: completing} : t))

    if(completing) {
      // mark as pending so it stays in active list during delay
      setPendingComplete((prev) => new Set(prev).add(task.id));

      setTimeout(() => {
        // after delay, remove from pending so it goes to completed section
        setPendingComplete((prev) => {
          const next = new Set(prev);
          next.delete(task.id)
          return next;
        });
      }, DELAY)
    }

    try {
      const updated = await taskService.updateTask(task.id, { is_completed: !task.is_completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setTasks((prev) => prev.map((t) => t.id === task.id ? task : t));
      setError(err.message);
    }
  }

  // Delete a task and remove it from the list.
  async function handleDelete(id) {
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // active tasks = not completed tasks, OR completed tasks but still in delay window
  const activeTasks = tasks.filter((t) => !t.is_completed || pendingComplete.has(t.id));
  const completedTasks = tasks.filter((t) => t.is_completed && !pendingComplete.has(t.id));

  const renderTask = (task) => (
    <li key={task.id} className={`tasks__item ${task.is_completed ? 'tasks__item--done' : ''}`}>
              <label className="tasks__check">
                <input
                  type="checkbox"
                  checked={!!task.is_completed}
                  onChange={() => handleToggle(task)}
                />
                <span className="tasks__title">{task.title}</span>
              </label>
              <button
                className="tasks__delete"
                type="button"
                aria-label="Delete task"
                onClick={() => handleDelete(task.id)}
              >
                ×
              </button>
            </li>
  );

  return (
    <section className="tasks">
      <h2 className="tasks__heading">Tasks</h2>
      <form className="tasks__form" onSubmit={handleCreate}>
        <input
          className="tasks__input"
          type="text"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
        />
        <button className="tasks__add" type="submit">Add</button>
      </form>
      {error && <p className="tasks__error">{error}</p>}
      {isLoading ? (
        <p className="tasks__empty">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="tasks__empty">No tasks yet.</p>
      ) : (
        <>
        {/* Render active tasks */}
        <ul className="tasks__list">
            {activeTasks.length === 0
              ? <p className="tasks__empty">No tasks yet.</p>
              : activeTasks.map(renderTask)}
        </ul>
        
        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <div className="task__completed-section">
            <button
              className="task__completed-toggle"
              type='button'
              onClick={() => setCompletedOpen((prev) => !prev)}
              >
                <span>Completed ({completedTasks.length})</span> 
                <span>{completedOpen ? '▾' : '▸'}</span>
            </button>
            {completedOpen && (
              <ul className='task__list'>
                {completedTasks.map(renderTask)}
              </ul>
            )}
          </div>
        )}
        </>
      )}
    </section>
  );
}
