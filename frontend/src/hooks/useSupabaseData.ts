import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

// Book Management Hooks

export function useBooks() {
  const [books, setBooks] = useState<any[]>([]);
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

      if (error) {
        setError(error.message);
      } else {
        setBooks(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData: {
    title: string;
    author: string;
    isbn?: string;
    published_year?: number;
    total_copies: number;
    available_copies: number;
    category_id?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .insert([bookData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      await fetchBooks(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const updateBook = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      await fetchBooks(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      await fetchBooks(); // Refresh the list
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
    refetch: fetchBooks,
    addBook,
    updateBook,
    deleteBook,
  };
}

// Categories Management Hook

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        setError(error.message);
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
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

      if (error) {
        throw new Error(error.message);
      }

      await fetchCategories(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    addCategory,
  };
}

// Borrow Records Hook

export function useBorrowRecords() {
  const { profile } = useAuth();
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowRecords = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("borrow_records")
        .select(
          `
          *,
          books (
            id,
            title,
            author,
            isbn
          ),
          users (
            id,
            name,
            email
          )
        `
        )
        .order("borrow_date", { ascending: false });

      // If user is not admin, only show their records
      if (profile?.role !== "admin" && profile?.id) {
        query = query.eq("user_id", profile.id);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setBorrowRecords(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId: string, dueDate?: string) => {
    if (!profile?.id) {
      return { error: "User not authenticated" };
    }

    try {
      // Calculate due date (14 days from now if not provided)
      const due =
        dueDate ||
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("borrow_records")
        .insert([
          {
            user_id: profile.id,
            book_id: bookId,
            due_date: due,
            status: "borrowed",
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update available copies
      const { error: updateError } = await supabase.rpc(
        "decrement_available_copies",
        { book_id: bookId }
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      await fetchBorrowRecords(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  const returnBook = async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from("borrow_records")
        .update({
          return_date: new Date().toISOString(),
          status: "returned",
        })
        .eq("id", recordId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update available copies
      const { error: updateError } = await supabase.rpc(
        "increment_available_copies",
        { book_id: data.book_id }
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      await fetchBorrowRecords(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  useEffect(() => {
    if (profile) {
      fetchBorrowRecords();
    }
  }, [profile]);

  return {
    borrowRecords,
    loading,
    error,
    refetch: fetchBorrowRecords,
    borrowBook,
    returnBook,
  };
}

// Reviews Hook

export function useReviews(bookId?: string) {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("reviews")
        .select(
          `
          *,
          users (
            id,
            name
          ),
          books (
            id,
            title
          )
        `
        )
        .order("created_at", { ascending: false });

      if (bookId) {
        query = query.eq("book_id", bookId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setReviews(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (
    bookId: string,
    rating: number,
    comment?: string
  ) => {
    if (!profile?.id) {
      return { error: "User not authenticated" };
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            user_id: profile.id,
            book_id: bookId,
            rating,
            comment,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      await fetchReviews(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    addReview,
  };
}
