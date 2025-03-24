import { useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleDark}
      className="text-white bg-secondary px-4 py-2 rounded hover:bg-green-700"
    >
      {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
