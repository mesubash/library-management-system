import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

// Types
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  published_year?: number;
  total_copies: number;
  available_copies: number;
  category_id?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

export interface BorrowRecord {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  return_date?: string;
  due_date: string;
  fine: number;
  is_late: boolean;
  status: "borrowed" | "returned";
  users?: {
    id: string;
    name: string;
    email: string;
  };
  books?: Book;
}

export interface Category {
  id: string;
  name: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalBorrowed: number;
  totalOverdue: number;
  recentBorrows: BorrowRecord[];
  popularBooks: (Book & { borrow_count: number })[];
}

// Dashboard Analytics Hook
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuth();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic stats
      const [booksRes, usersRes, borrowsRes, overdueRes] = await Promise.all([
        supabase.from("books").select("id"),
        role === "admin"
          ? supabase.from("users").select("id")
          : Promise.resolve({ data: [], error: null }),
        supabase.from("borrow_records").select("id").eq("status", "borrowed"),
        supabase
          .from("borrow_records")
          .select("id")
          .eq("status", "borrowed")
          .lt("due_date", new Date().toISOString()),
      ]);

      // Fetch recent borrows
      const recentBorrowsRes = await supabase
        .from("borrow_records")
        .select(
          `
          *,
          users (id, name, email),
          books (title, author)
        `
        )
        .eq("status", "borrowed")
        .order("borrow_date", { ascending: false })
        .limit(5);

      // Fetch popular books (most borrowed)
      const popularBooksRes = await supabase
        .from("borrow_records")
        .select(
          `
          book_id,
          books (*)
        `
        )
        .order("borrow_date", { ascending: false });

      if (
        booksRes.error ||
        borrowsRes.error ||
        overdueRes.error ||
        recentBorrowsRes.error
      ) {
        throw new Error("Failed to fetch dashboard stats");
      }

      // Process popular books
      const bookBorrowCounts = new Map();
      if (popularBooksRes.data) {
        popularBooksRes.data.forEach((record: any) => {
          const bookId = record.book_id;
          const count = bookBorrowCounts.get(bookId) || 0;
          bookBorrowCounts.set(bookId, count + 1);
        });
      }

      const popularBooks = Array.from(bookBorrowCounts.entries())
        .map(([bookId, count]) => {
          const bookRecord = popularBooksRes.data?.find(
            (r: any) => r.book_id === bookId
          );
          return bookRecord
            ? { ...bookRecord.books, borrow_count: count }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => (b?.borrow_count || 0) - (a?.borrow_count || 0))
        .slice(0, 5);

      setStats({
        totalBooks: booksRes.data?.length || 0,
        totalUsers: usersRes.data?.length || 0,
        totalBorrowed: borrowsRes.data?.length || 0,
        totalOverdue: overdueRes.data?.length || 0,
        recentBorrows: recentBorrowsRes.data || [],
        popularBooks: (popularBooks as any) || [],
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [role]);

  return { stats, loading, error, refetch: fetchStats };
}

// Enhanced Books Hook
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          *,
          categories (
            id,
            name
          )
        `
        )
        .order("title");

      if (error) throw new Error(error.message);
      setBooks(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (
    bookData: Omit<Book, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .insert([bookData])
        .select(
          `
          *,
          categories (
            id,
            name
          )
        `
        )
        .single();

      if (error) throw new Error(error.message);
      await fetchBooks();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      await fetchBooks();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await fetchBooks();
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  };
}

// Borrow Records Hook
export function useBorrowRecords() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile, role } = useAuth();

  const fetchRecords = async () => {
    try {
      setLoading(true);
      let query = supabase.from("borrow_records").select(`
          *,
          users (id, name, email),
          books (*)
        `);

      // If user is not admin, only show their own records
      if (role !== "admin" && profile?.id) {
        query = query.eq("user_id", profile.id);
      }

      const { data, error } = await query.order("borrow_date", {
        ascending: false,
      });

      if (error) throw new Error(error.message);
      setRecords(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId: string, dueDate: string) => {
    try {
      if (!profile?.id) throw new Error("User profile not found");

      // First, check if book is available
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("available_copies")
        .eq("id", bookId)
        .single();

      if (bookError) throw new Error(bookError.message);
      if ((book.available_copies || 0) <= 0) {
        throw new Error("Book is not available for borrowing");
      }

      // Create borrow record
      const { data, error } = await supabase
        .from("borrow_records")
        .insert([
          {
            user_id: profile.id,
            book_id: bookId,
            due_date: dueDate,
            status: "borrowed",
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Update book availability
      await supabase
        .from("books")
        .update({
          available_copies: book.available_copies - 1,
        })
        .eq("id", bookId);

      await fetchRecords();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const returnBook = async (recordId: string) => {
    try {
      // Get the borrow record first
      const { data: record, error: recordError } = await supabase
        .from("borrow_records")
        .select("book_id")
        .eq("id", recordId)
        .single();

      if (recordError) throw new Error(recordError.message);

      // Update borrow record
      const { error: updateError } = await supabase
        .from("borrow_records")
        .update({
          status: "returned",
          return_date: new Date().toISOString(),
        })
        .eq("id", recordId);

      if (updateError) throw new Error(updateError.message);

      // Update book availability
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("available_copies")
        .eq("id", record.book_id)
        .single();

      if (!bookError && book) {
        await supabase
          .from("books")
          .update({
            available_copies: book.available_copies + 1,
          })
          .eq("id", record.book_id);
      }

      await fetchRecords();
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [profile?.id, role]);

  return {
    records,
    loading,
    error,
    borrowBook,
    returnBook,
    refetch: fetchRecords,
  };
}

// Categories Hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw new Error(error.message);
      setCategories(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await fetchCategories();
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
