ALTER TABLE pomodoro_sessions
  ADD COLUMN user_id INT,
  ADD CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
