import { useParams } from 'react-router-dom'

const mockBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
    description: "A story of wealth, love, and the American Dream in the 1920s.",
    published: "1925",
    pages: 218,
    genre: "Classic Fiction"
  }
]

export default function BookDetails() {
  const { id } = useParams()
  const book = mockBooks.find(b => b.id === parseInt(id))

  if (!book) return <div>Book not found</div>

  return (
    <div className="container mx-auto p-6">
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
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{book.author}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</h3>
                <p>{book.published}</p>
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
    </div>
  )
}