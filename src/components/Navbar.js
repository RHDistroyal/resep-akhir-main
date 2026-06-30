import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ loggedInUser, handleLogout, darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition duration-300">
            ResepKu
          </Link>
        </div>

        {/* Mobile Toggle & Dark Mode */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <button
            className="text-gray-800 dark:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Navigasi */}
        <ul
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent py-4 md:py-0 px-6 md:px-0 shadow-lg md:shadow-none transition-all duration-300 items-center`}
        >
          <li className="w-full md:w-auto text-center">
            <Link
              to="/"
              className="block font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li className="w-full md:w-auto text-center">
            <Link
              to="/favorites"
              className="block font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorit
            </Link>
          </li>

          {loggedInUser && (
            <li className="w-full md:w-auto text-center">
              <Link
                to="/add-recipe"
                className="block font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Tambah Resep
              </Link>
            </li>
          )}

          {loggedInUser ? (
            <li className="w-full md:w-auto text-center">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="w-full md:w-auto text-center">
              <Link
                to="/login"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-md hover:shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          )}

          {/* Desktop Dark Mode Toggle */}
          <li className="hidden md:block">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
