import { useSearchParams, Link } from 'react-router-dom';

export default function Login() {
  const [params] = useSearchParams();
  const role = params.get('role');

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Login as {role === 'admin' ? 'Librarian' : 'User'}</h1>

      <form className="flex flex-col gap-4 max-w-md">
        <input className="p-3 rounded border" type="text" placeholder="Username" />
        <input className="p-3 rounded border" type="password" placeholder="Password" />
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">Login</button>
      </form>

      {role === 'user' && (
        <p className="mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
      )}
    </div>
  );
}
