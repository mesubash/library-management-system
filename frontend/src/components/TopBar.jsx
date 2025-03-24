import DarkModeToggle from './DarkModeToggel';

export default function Topbar() {
  return (
    <div className="bg-secondary text-white p-4 flex justify-between items-center">
      <DarkModeToggle />
      <p>Welcome to Library Management System</p>
    </div>
  );
}
