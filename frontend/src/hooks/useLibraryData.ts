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
  status: "requested" | "approved" | "borrowed" | "returned" | "rejected";
  requested_date: string;
  approved_date?: string;
  approved_by?: string;
  rejection_reason?: string;
  users?: {
    id: string;
    name: string;
    email: string;
  };
  approved_by_user?: {
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
          users!borrow_records_user_id_fkey (id, name, email),
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
          users!borrow_records_user_id_fkey (id, name, email),
          books (*),
          approved_by_user:users!borrow_records_approved_by_fkey (id, name, email)
        `);

      // If user is not admin, only show their own records
      if (role !== "admin" && profile?.id) {
        query = query.eq("user_id", profile.id);
      }

      const { data, error } = await query.order("requested_date", {
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

      console.log("🔍 Starting book request process...", {
        userId: profile.id,
        bookId,
        dueDate,
      });

      // First, check if book is available
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("available_copies, title")
        .eq("id", bookId)
        .single();

      if (bookError) {
        console.error("❌ Book lookup failed:", bookError);
        throw new Error(`Book lookup failed: ${bookError.message}`);
      }

      console.log("📖 Book found:", book);

      if ((book.available_copies || 0) <= 0) {
        throw new Error("Book is not available for borrowing");
      }

      // Create borrow request (not direct borrow)
      const requestData = {
        user_id: profile.id,
        book_id: bookId,
        due_date: dueDate,
        status: "requested" as const,
        requested_date: new Date().toISOString(),
      };

      console.log("📝 Creating request with data:", requestData);

      const { data, error } = await supabase
        .from("borrow_records")
        .insert([requestData])
        .select()
        .single();

      if (error) {
        console.error("❌ Insert failed:", error);
        throw new Error(`Failed to create request: ${error.message}`);
      }

      console.log("✅ Request created successfully:", data);

      // Don't update book availability immediately - only when librarian approves
      // This ensures books show as "pending" until physically confirmed

      await fetchRecords();
      return { data, error: null };
    } catch (err) {
      console.error("❌ borrowBook function failed:", err);
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
  }; // New function to approve a borrow request (Admin only)
  const approveRequest = async (recordId: string) => {
    try {
      if (role !== "admin") throw new Error("Only admins can approve requests");

      console.log("🔍 Approving request:", { recordId, adminId: profile?.id });

      // Get the request details
      const { data: record, error: recordError } = await supabase
        .from("borrow_records")
        .select("book_id, user_id")
        .eq("id", recordId)
        .eq("status", "requested")
        .single();

      if (recordError)
        throw new Error("Request not found or already processed");

      // Check if book is still available
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("available_copies")
        .eq("id", record.book_id)
        .single();

      if (bookError || (book.available_copies || 0) <= 0) {
        throw new Error("Book is no longer available");
      }

      // Update request to approved - temporarily remove approved_by to avoid FK constraint issues
      const updateData = {
        status: "approved",
        approved_date: new Date().toISOString(),
        // Temporarily commenting out approved_by to fix FK constraint issue
        // approved_by: profile?.id,
      };

      console.log("📝 Updating record with:", updateData);

      const { error: updateError } = await supabase
        .from("borrow_records")
        .update(updateData)
        .eq("id", recordId);

      if (updateError) {
        console.error("❌ Update error:", updateError);
        throw new Error(updateError.message);
      }

      // Reserve the book (reduce available copies)
      await supabase
        .from("books")
        .update({
          available_copies: book.available_copies - 1,
        })
        .eq("id", record.book_id);

      console.log("✅ Request approved successfully");
      await fetchRecords();
      return { error: null };
    } catch (err) {
      console.error("❌ approveRequest failed:", err);
      return { error: (err as Error).message };
    }
  };

  // New function to confirm physical pickup (Admin only)
  const confirmBorrow = async (recordId: string) => {
    try {
      if (role !== "admin")
        throw new Error("Only admins can confirm borrowing");

      // Update approved request to borrowed
      const { error: updateError } = await supabase
        .from("borrow_records")
        .update({
          status: "borrowed",
          borrow_date: new Date().toISOString(),
        })
        .eq("id", recordId)
        .eq("status", "approved");

      if (updateError) throw new Error(updateError.message);

      await fetchRecords();
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  // New function to reject a request (Admin only)
  const rejectRequest = async (recordId: string, reason: string) => {
    try {
      if (role !== "admin") throw new Error("Only admins can reject requests");

      // Get the request details
      const { data: record, error: recordError } = await supabase
        .from("borrow_records")
        .select("book_id")
        .eq("id", recordId)
        .eq("status", "requested")
        .single();

      if (recordError)
        throw new Error("Request not found or already processed");

      // Update request to rejected
      const { error: updateError } = await supabase
        .from("borrow_records")
        .update({
          status: "rejected",
          rejection_reason: reason,
        })
        .eq("id", recordId);

      if (updateError) throw new Error(updateError.message);

      await fetchRecords();
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  // New function to cancel a request (User only)
  const cancelRequest = async (recordId: string) => {
    try {
      // Get the request details to verify it belongs to the user
      const { data: record, error: recordError } = await supabase
        .from("borrow_records")
        .select("user_id, status")
        .eq("id", recordId)
        .single();

      if (recordError) throw new Error("Request not found");

      // Verify the request belongs to the current user and is still pending
      if (record.user_id !== profile?.id) {
        throw new Error("You can only cancel your own requests");
      }

      if (record.status !== "requested") {
        throw new Error("Only pending requests can be cancelled");
      }

      // Delete the request record
      const { error: deleteError } = await supabase
        .from("borrow_records")
        .delete()
        .eq("id", recordId);

      if (deleteError) throw new Error(deleteError.message);

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
    approveRequest,
    confirmBorrow,
    rejectRequest,
    cancelRequest,
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
