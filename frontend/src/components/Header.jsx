import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="header border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Library System
        </h1>
        <ThemeToggle />
      </div>
    </header>
  )
}