export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <p className="text-center mb-6">
          Authentication is currently disabled for development.
          <br />
          Select your role from the sidebar.
        </p>
        <div className="flex justify-center">
          <a 
            href="/" 
            className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}