export default function AdminTools() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Library Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Total Books</h3>
              <p className="text-3xl mt-2">1,245</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Active Users</h3>
              <p className="text-3xl mt-2">356</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium">Pending Requests</h3>
              <p className="text-3xl mt-2">12</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="bg-secondary text-white px-4 py-2 rounded">
                Add New Book
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded">
                Manage Users
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }