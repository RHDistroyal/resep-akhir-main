import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Load user, theme, and initial favorites count
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      setLoggedInUser(user);
    } catch (e) {
      console.error(e);
    }

    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);

    // Initial fetch to count favorites
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((recipes) => {
        const count = recipes.filter((r) => r.isBookmarked).length;
        setFavoritesCount(count);
      })
      .catch(() => {});
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogin = (user) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateFavoritesCount = (count) => {
    setFavoritesCount(count);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-300">
        <Navbar
          loggedInUser={loggedInUser}
          handleLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          favoritesCount={favoritesCount}
        />

        <main className="flex-1">
          <Routes>
            {/* Public catalog */}
            <Route
              path="/"
              element={<Home onUpdateFavoritesCount={updateFavoritesCount} />}
            />

            {/* Public recipe detail */}
            <Route
              path="/recipe/:id"
              element={<RecipeDetail onUpdateFavoritesCount={updateFavoritesCount} />}
            />

            {/* Favorites page */}
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites onUpdateFavoritesCount={updateFavoritesCount} />
                </ProtectedRoute>
              }
            />

            {/* Create recipe */}
            <Route
              path="/add-recipe"
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              }
            />

            {/* Edit recipe */}
            <Route
              path="/edit-recipe/:id"
              element={
                <ProtectedRoute>
                  <EditRecipe />
                </ProtectedRoute>
              }
            />

            {/* Auth routes */}
            <Route
              path="/login"
              element={
                loggedInUser ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/register"
              element={
                loggedInUser ? <Navigate to="/" replace /> : <Register />
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </Router>
  );
}

export default App;
