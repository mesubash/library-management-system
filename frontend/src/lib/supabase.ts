import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          role: "admin" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          name: string;
          email: string;
          role: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          name?: string;
          email?: string;
          role?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          isbn: string | null;
          published_year: number | null;
          total_copies: number;
          available_copies: number;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          isbn?: string | null;
          published_year?: number | null;
          total_copies: number;
          available_copies: number;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          isbn?: string | null;
          published_year?: number | null;
          total_copies?: number;
          available_copies?: number;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      borrow_records: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          borrow_date: string;
          return_date: string | null;
          due_date: string | null;
          fine: number;
          is_late: boolean;
          status:
            | "requested"
            | "approved"
            | "borrowed"
            | "returned"
            | "rejected";
          requested_date: string;
          approved_date: string | null;
          approved_by: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          borrow_date?: string;
          return_date?: string | null;
          due_date?: string | null;
          fine?: number;
          is_late?: boolean;
          status?:
            | "requested"
            | "approved"
            | "borrowed"
            | "returned"
            | "rejected";
          requested_date?: string;
          approved_date?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          borrow_date?: string;
          return_date?: string | null;
          due_date?: string | null;
          fine?: number;
          is_late?: boolean;
          status?:
            | "requested"
            | "approved"
            | "borrowed"
            | "returned"
            | "rejected";
          requested_date?: string;
          approved_date?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          rating: number | null;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          rating?: number | null;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          rating?: number | null;
          comment?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          target_table?: string | null;
          target_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      login_history: {
        Row: {
          id: string;
          user_id: string;
          login_time: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          login_time?: string;
          ip_address?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          login_time?: string;
          ip_address?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
