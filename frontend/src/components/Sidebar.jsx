export default function Sidebar({ role }) {
    const navItems = role === "librarian"
      ? ["Dashboard", "Manage Books", "Members", "Reports"]
      : role === "customer"
        ? ["Dashboard", "My Books", "Profile"]
        : ["Home", "About Us"];
  
    return (
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl">Library</div>
        <ul>
          {navItems.map((item) => (
            <li key={item} className="p-4 hover:bg-gray-200 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
    );
  }
  