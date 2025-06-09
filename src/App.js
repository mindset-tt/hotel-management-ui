import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import AdminPanel from './adminPanel';
import { ChatPanel, ChatMessageDisplay } from './chatPanel';
import { FiGrid, FiMessageSquare, FiSun, FiMoon } from 'react-icons/fi';


// --- Main App Component ---// --- Main App Component ---
export default function App() {
  const [activePanel, setActivePanel] = useState('admin'); 
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">HotelHub</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActivePanel('admin')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2
                ${activePanel === 'admin' ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <FiGrid /> <span>Admin</span>
            </button>
            <button
              onClick={() => setActivePanel('chat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2
                ${activePanel === 'chat' ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <FiMessageSquare /> <span>Chat</span>
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle dark mode">
                {darkMode ? <FiSun className="h-5 w-5 text-yellow-400" /> : <FiMoon className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-1 p-1 md:p-2">
        {activePanel === 'admin' && <AdminPanel />}
        {activePanel === 'chat' && <ChatPanel />}
      </main>
    </div>
  );
}
