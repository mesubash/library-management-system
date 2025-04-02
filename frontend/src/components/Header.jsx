import ThemeToggle from './ThemeToggle';

export default function Header({ showSidebarToggle = true }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary dark:text-blue-400">
          Library System
        </h1>
        <div className="flex items-center gap-4">
          {showSidebarToggle && (
            <button className="md:hidden">☰</button>
          )}
          {/* ThemeToggle Component can go here */}
        </div>
      </div>
    </header>
  );
}
