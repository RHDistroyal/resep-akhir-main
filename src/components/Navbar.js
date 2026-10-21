import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChefHat, Heart, PlusCircle, Sun, Moon, LogIn, LogOut, 
  Menu, X, Sparkles, User 
} from "lucide-react";

export default function Navbar({
  loggedInUser,
  handleLogout,
  darkMode,
  toggleDarkMode,
  favoritesCount = 0,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-stone-950/80 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 p-0.5 shadow-glow group-hover:scale-105 group-hover:shadow-glow-lg transition-all duration-300">
            <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center text-brand-400 group-hover:text-amber-300 transition-colors">
              <ChefHat className="w-6 h-6 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black tracking-tight text-stone-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                ResepKu
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping inline-block" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Koleksi Rasa Modern
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 dark:bg-stone-900/80 p-1.5 rounded-full border border-stone-200/60 dark:border-stone-800/80">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              isActive("/")
                ? "bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            Jelajahi Resep
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              isActive("/favorites")
                ? "bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isActive("/favorites") ? "fill-brand-500 text-brand-500" : ""}`} />
            Favorit
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
                {favoritesCount}
              </span>
            )}
          </Link>

          <Link
            to="/add-recipe"
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              isActive("/add-recipe")
                ? "bg-white dark:bg-stone-800 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Tulis Resep
          </Link>
        </nav>

        {/* Right Controls: Theme + User */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800 transition"
            title={darkMode ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 rotate-0 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-stone-700 rotate-0 transition-transform" />
            )}
          </button>

          {/* User Status / Login */}
          {loggedInUser ? (
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 pl-3 pr-1.5 py-1.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                  {loggedInUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight pr-1">
                  <span className="block font-bold">{loggedInUser.username}</span>
                  <span className="text-[10px] text-brand-500 font-semibold">
                    {loggedInUser.username === "admin" ? "Admin" : "Koki Rumahan"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition duration-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200"
            aria-label="Open Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-in">
          {loggedInUser && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
                {loggedInUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-stone-900 dark:text-white">{loggedInUser.username}</p>
                <p className="text-xs text-brand-500 font-medium">
                  {loggedInUser.username === "admin" ? "Super Admin" : "Koki Terdaftar"}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between ${
                isActive("/")
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                  : "text-stone-700 dark:text-stone-200"
              }`}
            >
              <span>Jelajahi Resep</span>
              <Sparkles className="w-4 h-4 text-brand-500" />
            </Link>

            <Link
              to="/favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between ${
                isActive("/favorites")
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                  : "text-stone-700 dark:text-stone-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Resep Favorit
              </span>
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-bold">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              to="/add-recipe"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 ${
                isActive("/add-recipe")
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                  : "text-stone-700 dark:text-stone-200"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-brand-500" />
              <span>Tulis Resep Baru</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            {loggedInUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akun
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-center rounded-2xl bg-brand-500 text-white font-bold text-sm shadow-md"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-center rounded-2xl border border-stone-200 dark:border-stone-800 font-bold text-sm text-stone-800 dark:text-stone-200"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
