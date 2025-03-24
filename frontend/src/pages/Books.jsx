const mockBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", available: false }
]

export default function Books() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-green-400">
        Book Collection
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBooks.map(book => (
          <div key={book.id} className="card bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg dark:text-white">{book.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
              book.available 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {book.available ? 'Available' : 'Checked Out'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}