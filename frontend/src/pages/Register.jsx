export default function Register() {
  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Register as User</h1>

      <form className="flex flex-col gap-4 max-w-md">
        <input className="p-3 rounded border" type="text" placeholder="Username" />
        <input className="p-3 rounded border" type="email" placeholder="Email" />
        <input className="p-3 rounded border" type="password" placeholder="Password" />
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}
