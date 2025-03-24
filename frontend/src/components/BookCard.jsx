import { Link } from 'react-router-dom'

export default function BookCard({ book }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <img 
        src={book.cover} 
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold dark:text-white">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${
            book.available 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}>
            {book.available ? 'Available' : 'Checked Out'}
          </span>
          <Link
            to={`/books/${book.id}`}
            className="text-sm text-primary hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}