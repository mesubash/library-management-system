
export interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  available: boolean;
  publishedDate?: string;
  description?: string;
}
