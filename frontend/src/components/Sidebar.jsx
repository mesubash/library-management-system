import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-primary text-white w-64 h-full p-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6">📚 Library</h2>
      <Link to="/" className="hover:text-secondary">Dashboard</Link>

      <div className="mt-8">
        <h3 className="mb-2 font-semibold">Login As</h3>
        <Link to="/login?role=admin" className="block hover:text-secondary">Librarian</Link>
        <Link to="/login?role=user" className="block hover:text-secondary">User</Link>
      </div>
    </div>
  );
}
