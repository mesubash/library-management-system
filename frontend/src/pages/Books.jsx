import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'

export default function Books() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    // Mock data - replace with API call
    setBooks([
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true },
      { id: 2, title: '1984', author: 'George Orwell', available: false }
    ])
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Book Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}