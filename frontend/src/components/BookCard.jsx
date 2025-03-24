export default function BookCard({ book }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-bold text-lg dark:text-white">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
        <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
          book.available 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
          {book.available ? 'Available' : 'Borrowed'}
        </span>
      </div>
    )
  }