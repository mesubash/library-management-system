-- =============================================
-- LIBRARY MANAGEMENT SYSTEM - SIMPLE WORKING SCHEMA
-- =============================================
-- No more complications - this just works!

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. BASIC TIMESTAMP FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. CREATE TABLES
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Users table  
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) UNIQUE,
    published_year INT,
    total_copies INT NOT NULL CHECK (total_copies >= 0),
    available_copies INT NOT NULL CHECK (available_copies >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Borrow records table
CREATE TABLE IF NOT EXISTS borrow_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    fine NUMERIC(6, 2) DEFAULT 0,
    is_late BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('requested', 'approved', 'borrowed', 'returned', 'rejected')) DEFAULT 'requested',
    requested_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(50),
    target_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Login history table
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100)
);

-- =============================================
-- 3. CREATE INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_borrow_records_status ON borrow_records(status);
CREATE INDEX IF NOT EXISTS idx_borrow_records_user_id ON borrow_records(user_id);
CREATE INDEX IF NOT EXISTS idx_borrow_records_book_id ON borrow_records(book_id);

-- =============================================
-- 4. CREATE TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS set_timestamp_users ON users;
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_books ON books;
CREATE TRIGGER set_timestamp_books
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================
-- 5. SIMPLE RLS POLICIES (No admin checking)
-- =============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users full access via service role" ON users;
DROP POLICY IF EXISTS "Users can access own data" ON users;
DROP POLICY IF EXISTS "Categories service role access" ON categories;
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Books service role access" ON books;
DROP POLICY IF EXISTS "Anyone can read books" ON books;
DROP POLICY IF EXISTS "Admins can manage books" ON books;
DROP POLICY IF EXISTS "Borrow records service role access" ON borrow_records;
DROP POLICY IF EXISTS "Users can access own borrow records" ON borrow_records;
DROP POLICY IF EXISTS "Admins can manage all borrow records" ON borrow_records;
DROP POLICY IF EXISTS "Reviews service role access" ON reviews;
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Users can manage own reviews" ON reviews;
DROP POLICY IF EXISTS "Audit logs service role access" ON audit_logs;
DROP POLICY IF EXISTS "Login history service role access" ON login_history;
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;

-- Simple policies that work  
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = auth_id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can read books" ON books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage books" ON books FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read own borrow records" ON borrow_records FOR SELECT USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create borrow requests" ON borrow_records FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) 
  AND status = 'requested'
);
CREATE POLICY "Users can update own borrow records" ON borrow_records FOR UPDATE USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage reviews" ON reviews FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read audit logs" ON audit_logs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read own login history" ON login_history FOR SELECT USING (
  user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- =============================================
-- 6. BUSINESS FUNCTIONS
-- =============================================

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_count INT;
BEGIN
    UPDATE users 
    SET role = 'admin', updated_at = CURRENT_TIMESTAMP
    WHERE email = user_email;
    
    GET DIAGNOSTICS user_count = ROW_COUNT;
    
    IF user_count = 0 THEN
        RETURN 'User not found with email: ' || user_email;
    ELSE
        RETURN 'User ' || user_email || ' has been promoted to admin';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create a book request
CREATE OR REPLACE FUNCTION request_book(p_user_id UUID, p_book_id UUID, p_due_date TIMESTAMPTZ)
RETURNS UUID AS $$
DECLARE
    request_id UUID;
    current_requests INT;
BEGIN
    -- Check if user has reached the 5-book limit
    SELECT COUNT(*) INTO current_requests
    FROM borrow_records
    WHERE user_id = p_user_id 
    AND status IN ('requested', 'approved', 'borrowed');
    
    IF current_requests >= 5 THEN
        RAISE EXCEPTION 'You have reached the maximum limit of 5 books (including pending requests)';
    END IF;
    
    -- Check if user already has this book requested/borrowed
    IF EXISTS (
        SELECT 1 FROM borrow_records 
        WHERE user_id = p_user_id 
        AND book_id = p_book_id 
        AND status IN ('requested', 'approved', 'borrowed')
    ) THEN
        RAISE EXCEPTION 'You have already requested or borrowed this book';
    END IF;
    
    -- Create the request
    INSERT INTO borrow_records (user_id, book_id, due_date, status, requested_date)
    VALUES (p_user_id, p_book_id, p_due_date, 'requested', NOW())
    RETURNING id INTO request_id;
    
    RETURN request_id;
END;
$$ LANGUAGE plpgsql;

-- Function to approve a book request
CREATE OR REPLACE FUNCTION approve_book_request(p_request_id UUID, p_admin_id UUID)
RETURNS void AS $$
DECLARE
    v_book_id UUID;
    v_available_copies INT;
BEGIN
    -- Get book details and check availability
    SELECT br.book_id, b.available_copies 
    INTO v_book_id, v_available_copies
    FROM borrow_records br
    JOIN books b ON br.book_id = b.id
    WHERE br.id = p_request_id AND br.status = 'requested';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found or already processed';
    END IF;
    
    IF v_available_copies <= 0 THEN
        RAISE EXCEPTION 'Book is no longer available';
    END IF;
    
    -- Update request to approved and reserve the book
    UPDATE borrow_records 
    SET status = 'approved', 
        approved_date = NOW(), 
        approved_by = p_admin_id
    WHERE id = p_request_id;
    
    -- Reduce available copies (reserve the book)
    UPDATE books 
    SET available_copies = available_copies - 1
    WHERE id = v_book_id;
END;
$$ LANGUAGE plpgsql;

-- Function to confirm book pickup
CREATE OR REPLACE FUNCTION confirm_book_pickup(p_request_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE borrow_records 
    SET status = 'borrowed', 
        borrow_date = NOW()
    WHERE id = p_request_id AND status = 'approved';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Approved request not found';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to reject a book request
CREATE OR REPLACE FUNCTION reject_book_request(p_request_id UUID, p_reason TEXT)
RETURNS void AS $$
BEGIN
    UPDATE borrow_records 
    SET status = 'rejected', 
        rejection_reason = p_reason
    WHERE id = p_request_id AND status = 'requested';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found or already processed';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to return a book
CREATE OR REPLACE FUNCTION return_book(p_record_id UUID)
RETURNS void AS $$
DECLARE
    v_book_id UUID;
BEGIN
    SELECT book_id INTO v_book_id
    FROM borrow_records
    WHERE id = p_record_id AND status = 'borrowed';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrow record not found or book already returned';
    END IF;
    
    UPDATE borrow_records 
    SET status = 'returned', 
        return_date = NOW()
    WHERE id = p_record_id;
    
    UPDATE books 
    SET available_copies = available_copies + 1
    WHERE id = v_book_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. INSERT DEFAULT DATA
-- =============================================

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Fiction'),
('Non-Fiction'),
('Science'),
('Technology'),
('History'),
('Biography'),
('Self-Help'),
('Mystery'),
('Romance'),
('Fantasy')
ON CONFLICT (name) DO NOTHING;

-- Insert sample books
INSERT INTO books (title, author, isbn, published_year, total_copies, available_copies, category_id, description) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 1925, 5, 5, 
 (SELECT id FROM categories WHERE name = 'Fiction'), 
 'A classic American novel set in the summer of 1922'),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 1960, 3, 3, 
 (SELECT id FROM categories WHERE name = 'Fiction'), 
 'A gripping tale of racial injustice and childhood innocence'),
('1984', 'George Orwell', '978-0-452-28423-4', 1949, 4, 4, 
 (SELECT id FROM categories WHERE name = 'Fiction'), 
 'A dystopian social science fiction novel'),
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0-262-03384-8', 2009, 3, 3, 
 (SELECT id FROM categories WHERE name = 'Technology'), 
 'Comprehensive guide to computer algorithms'),
('Clean Code', 'Robert C. Martin', '978-0-13-235088-4', 2008, 2, 2, 
 (SELECT id FROM categories WHERE name = 'Technology'), 
 'A handbook of agile software craftsmanship'),
('Sapiens', 'Yuval Noah Harari', '978-0-06-231609-7', 2014, 4, 4, 
 (SELECT id FROM categories WHERE name = 'History'), 
 'A brief history of humankind'),
('Steve Jobs', 'Walter Isaacson', '978-1-4516-4853-9', 2011, 2, 2, 
 (SELECT id FROM categories WHERE name = 'Biography'), 
 'The exclusive biography of Apple co-founder')
ON CONFLICT (isbn) DO NOTHING;

