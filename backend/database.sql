CREATE DATABASE IF NOT EXISTS taskflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskflow;

CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(2000),
  category VARCHAR(20) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  due_date DATE,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL
);

INSERT INTO tasks (title, description, category, priority, due_date, status, created_at)
SELECT 'Plan the week', 'Map out the important priorities for the days ahead.', 'PERSONAL', 'MEDIUM', CURRENT_DATE, 'TODO', NOW()
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Plan the week');

INSERT INTO tasks (title, description, category, priority, due_date, status, created_at)
SELECT 'Review project brief', 'Share feedback with the product team.', 'WORK', 'HIGH', DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), 'IN_PROGRESS', NOW()
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Review project brief');

INSERT INTO tasks (title, description, category, priority, due_date, status, created_at)
SELECT 'Read for 20 minutes', 'Make a little time for learning today.', 'STUDY', 'LOW', DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), 'COMPLETED', NOW()
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Read for 20 minutes');
