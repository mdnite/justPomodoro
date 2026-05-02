CREATE TABLE IF NOT EXISTS tasks (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  task_id      INT,
  duration     INT NOT NULL,
  type         ENUM('work', 'short_break', 'long_break') DEFAULT 'work',
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id             INT PRIMARY KEY DEFAULT 1,
  work_duration  INT DEFAULT 25,
  short_break    INT DEFAULT 5,
  long_break     INT DEFAULT 15,
  sound_enabled  BOOLEAN DEFAULT TRUE
);
