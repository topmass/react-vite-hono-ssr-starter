-- Example D1 Database Schema
-- Run these commands to set up your D1 database:
-- 
-- 1. Create your database:
--    npx wrangler d1 create main-database
--
-- 2. Update wrangler.json with the database_id from step 1
--
-- 3. Apply this schema:
--    npx wrangler d1 execute main-database --file=./schema.sql
--
-- 4. For local development with remote bindings, the database will be accessed remotely

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Example posts table (demonstrates relationships)
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Example index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some sample data
INSERT OR IGNORE INTO users (id, name, email) VALUES 
  (1, 'Alice Johnson', 'alice@example.com'),
  (2, 'Bob Smith', 'bob@example.com'),
  (3, 'Charlie Brown', 'charlie@example.com');

INSERT OR IGNORE INTO posts (id, title, content, user_id) VALUES 
  (1, 'First Post', 'This is my first post!', 1),
  (2, 'Hello World', 'Getting started with this awesome template.', 2),
  (3, 'Database Fun', 'Learning about D1 databases is great!', 1);