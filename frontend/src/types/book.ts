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
  created_at?: string;
  updated_at?: string;
}

export interface BorrowRecord {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  return_date?: string;
  due_date?: string;
  fine?: number;
  // Relations
  book?: Book;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
