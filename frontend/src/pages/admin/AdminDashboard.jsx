export default function AdminDashboard() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-purple-600 dark:text-purple-400">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Total Books</h3>
            <p className="text-3xl text-purple-600 dark:text-purple-400">1,245</p>
          </div>
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Active Users</h3>
            <p className="text-3xl text-purple-600 dark:text-purple-400">356</p>
          </div>
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Pending Requests</h3>
            <p className="text-3xl text-purple-600 dark:text-purple-400">12</p>
          </div>
        </div>
  
        {/* Quick Actions */}
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-secondary">
              <span className="mr-2">➕</span> Add New Book
            </button>
            <button className="btn-primary">
              <span className="mr-2">👥</span> Manage Users
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded">
              <span className="mr-2">📊</span> View Reports
            </button>
          </div>
        </div>
  
        {/* Recent Activity */}
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {['New book added', 'User registration', 'Book checked out'].map((activity, i) => (
              <div key={i} className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                  <span className="text-purple-600 dark:text-purple-400">!</span>
                </div>
                <div>
                  <p>{activity}</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }