export default function UserDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        My Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="font-bold mb-2">Currently Borrowed</h3>
          <p className="text-3xl text-blue-600 dark:text-blue-400">3</p>
        </div>
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="font-bold mb-2">Reading History</h3>
          <p className="text-3xl text-blue-600 dark:text-blue-400">24</p>
        </div>
      </div>

      {/* Currently Borrowed */}
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">My Books</h2>
        <div className="space-y-3">
          {['The Great Gatsby', 'To Kill a Mockingbird', '1984'].map((book, i) => (
            <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <div>
                <p className="font-medium">{book}</p>
                <p className="text-sm text-gray-500">Due in {i+2} days</p>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Renew
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Brave New World', 'The Hobbit', 'Pride and Prejudice', 'The Alchemist'].map((book, i) => (
            <div key={i} className="text-center">
              <div className="w-full h-32 bg-blue-50 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-sm font-medium">{book}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}