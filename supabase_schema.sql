-- =============================================
-- LIBRARY MANAGEMENT SYSTEM - SUPABASE SCHEMA
-- =============================================
-- This is the updated schema optimized for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing tables if reinitializing (be careful in production!)
DROP TABLE IF EXISTS login_history, audit_logs, reviews, borrow_records, books, categories, users CASCADE;

-- =============================================
-- 1. USERS TABLE (Profile info, links to auth.users)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for users updated_at
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- =============================================
-- 3. BOOKS TABLE
-- =============================================
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) UNIQUE,
    published_year INT,
    total_copies INT NOT NULL CHECK (total_copies >= 0),
    available_copies INT NOT NULL CHECK (available_copies >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for books updated_at
CREATE TRIGGER set_timestamp_books
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================
-- 4. BORROW RECORDS TABLE
-- =============================================
CREATE TABLE borrow_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    fine NUMERIC(6, 2) DEFAULT 0,
    is_late BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('borrowed', 'returned')) DEFAULT 'borrowed'
);

-- =============================================
-- 5. REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. AUDIT LOGS TABLE
-- =============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(50),
    target_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. LOGIN HISTORY TABLE
-- =============================================
CREATE TABLE login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = auth_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- CATEGORIES TABLE POLICIES
-- =============================================
-- Everyone can read categories
CREATE POLICY "Anyone can read categories" ON categories
    FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- BOOKS TABLE POLICIES
-- =============================================
-- Everyone can read books
CREATE POLICY "Anyone can read books" ON books
    FOR SELECT USING (true);

-- Only admins can manage books
CREATE POLICY "Admins can manage books" ON books
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- BORROW RECORDS TABLE POLICIES
-- =============================================
-- Users can view their own borrow records
CREATE POLICY "Users can view own borrow records" ON borrow_records
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()
        )
    );

-- Admins can view all borrow records
CREATE POLICY "Admins can view all borrow records" ON borrow_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can manage all borrow records
CREATE POLICY "Admins can manage borrow records" ON borrow_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- REVIEWS TABLE POLICIES
-- =============================================
-- Everyone can read reviews
CREATE POLICY "Anyone can read reviews" ON reviews
    FOR SELECT USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()
        )
    );

-- Users can update/delete their own reviews
CREATE POLICY "Users can manage own reviews" ON reviews
    FOR ALL USING (
        user_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()
        )
    );

-- =============================================
-- AUDIT LOGS TABLE POLICIES
-- =============================================
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- LOGIN HISTORY TABLE POLICIES
-- =============================================
-- Users can view their own login history
CREATE POLICY "Users can view own login history" ON login_history
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users WHERE auth_id = auth.uid()
        )
    );

-- Admins can view all login history
CREATE POLICY "Admins can view all login history" ON login_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample categories
INSERT INTO categories (name) VALUES 
('Fiction'),
('Non-Fiction'),
('Science'),
('Technology'),
('History'),
('Biography'),
('Self-Help'),
('Academic');

-- =============================================
-- FUNCTIONS FOR USER MANAGEMENT
-- =============================================

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (auth_id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    
    -- Log the signup
    INSERT INTO login_history (user_id, ip_address)
    SELECT id, NEW.raw_user_meta_data->>'ip_address'
    FROM users WHERE auth_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- DATABASE FUNCTIONS FOR BOOK COPY MANAGEMENT
-- =============================================

-- Function to decrement available copies when a book is borrowed
CREATE OR REPLACE FUNCTION decrement_available_copies(book_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE books 
    SET available_copies = available_copies - 1
    WHERE id = book_id AND available_copies > 0;
    
    -- Check if the update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book not found or no copies available';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to increment available copies when a book is returned
CREATE OR REPLACE FUNCTION increment_available_copies(book_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE books 
    SET available_copies = available_copies + 1
    WHERE id = book_id AND available_copies < total_copies;
    
    -- Check if the update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book not found or copies already at maximum';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get book availability status
CREATE OR REPLACE FUNCTION get_book_availability(book_id UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    available_copies INT,
    total_copies INT,
    is_available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.available_copies,
        b.total_copies,
        (b.available_copies > 0) as is_available
    FROM books b
    WHERE b.id = book_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can borrow more books (limit of 5 active borrows)
CREATE OR REPLACE FUNCTION can_user_borrow_book(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    active_borrows INT;
BEGIN
    SELECT COUNT(*) INTO active_borrows
    FROM borrow_records
    WHERE user_id = can_user_borrow_book.user_id AND status = 'borrowed';
    
    RETURN active_borrows < 5; -- Library limit of 5 books per user
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- END OF SCHEMA
-- =============================================

-- Instructions:
-- 1. Copy and paste this entire script into your Supabase SQL Editor
-- 2. Run it to create all tables, policies, and functions
-- 3. Your database will be ready for the Library Management System
-- 4. Make sure to update your .env.local file with your Supabase credentials
