-- Drop existing tables if reinitializing
DROP TABLE IF EXISTS login_history, audit_logs, reviews, borrow_records, books, categories, users CASCADE;

-- Users Table
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
                       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Book Categories
CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) UNIQUE NOT NULL
);

-- Books Table
CREATE TABLE books (
                       id SERIAL PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       author VARCHAR(255) NOT NULL,
                       isbn VARCHAR(50) UNIQUE,
                       published_year INT,
                       total_copies INT NOT NULL CHECK (total_copies >= 0),
                       available_copies INT NOT NULL CHECK (available_copies >= 0),
                       category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Borrow Records Table
CREATE TABLE borrow_records (
                                id SERIAL PRIMARY KEY,
                                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                                book_id INT REFERENCES books(id) ON DELETE CASCADE,
                                borrow_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                                return_date TIMESTAMPTZ,
                                due_date TIMESTAMPTZ,
                                fine NUMERIC(6, 2) DEFAULT 0,
                                is_late BOOLEAN DEFAULT FALSE,
                                status VARCHAR(20) NOT NULL CHECK (status IN ('borrowed', 'returned')) DEFAULT 'borrowed'
);

-- Reviews Table
CREATE TABLE reviews (
                         id SERIAL PRIMARY KEY,
                         user_id INT REFERENCES users(id) ON DELETE CASCADE,
                         book_id INT REFERENCES books(id) ON DELETE CASCADE,
                         rating INT CHECK (rating BETWEEN 1 AND 5),
                         comment TEXT,
                         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
                            id SERIAL PRIMARY KEY,
                            user_id INT REFERENCES users(id) ON DELETE SET NULL,
                            action VARCHAR(100) NOT NULL,
                            target_table VARCHAR(50),
                            target_id INT,
                            description TEXT,
                            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Login History Table
CREATE TABLE login_history (
                               id SERIAL PRIMARY KEY,
                               user_id INT REFERENCES users(id) ON DELETE CASCADE,
                               login_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                               ip_address VARCHAR(100)
);
