export default function Navbar({ role, setRole }) {
    return (
      <div className="p-4 bg-white shadow flex justify-between">
        <div>Library Dashboard</div>
        <div>
          {role === "guest" ? (
            <>
              <button onClick={() => setRole("librarian")} className="btn">Login as Librarian</button>
              <button onClick={() => setRole("customer")} className="btn ml-2">Login as Customer</button>
            </>
          ) : (
            <button onClick={() => setRole("guest")} className="btn">Logout</button>
          )}
        </div>
      </div>
    );
  }
  