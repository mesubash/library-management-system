export default function Register() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-xl font-bold">Register</h2>
          <input type="text" placeholder="Full Name" className="w-full p-2 border mt-2" />
          <input type="text" placeholder="Email" className="w-full p-2 border mt-2" />
          <input type="password" placeholder="Password" className="w-full p-2 border mt-2" />
          <button className="w-full bg-green-500 text-white p-2 mt-4">Register</button>
        </div>
      </div>
    );
  }
  