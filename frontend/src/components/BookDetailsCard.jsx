export default function BookDetailsCard({ book }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold dark:text-white">{book.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{book.author}</p>
            
            <div className="mt-4 flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                book.available 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}>
                {book.available ? 'Available' : 'Checked Out'}
              </span>
            </div>
  
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</h3>
                <p>{book.publishedDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pages</h3>
                <p>{book.pages}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Genre</h3>
                <p>{book.genre}</p>
              </div>
            </div>
  
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
              <p className="mt-2">{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }