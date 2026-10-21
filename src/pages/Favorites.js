import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, RotateCcw, ArrowRight, ChefHat, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import RecipeCard from "../components/RecipeCard";

export default function Favorites({ onUpdateFavoritesCount }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.username === "admin";

  const fetchFavorites = () => {
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => {
        const bookmarked = data.filter((r) => r.isBookmarked);
        setRecipes(bookmarked);
        setLoading(false);
        if (onUpdateFavoritesCount) onUpdateFavoritesCount(bookmarked.length);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnbookmark = (id) => {
    // Optimistic removal
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    toast.info("Resep dihapus dari koleksi Favorit.");

    fetch(`http://localhost:5000/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBookmarked: false }),
    })
      .then(() => {
        fetch("http://localhost:5000/recipes")
          .then((res) => res.json())
          .then((all) => {
            const count = all.filter((r) => r.isBookmarked).length;
            if (onUpdateFavoritesCount) onUpdateFavoritesCount(count);
          });
      })
      .catch((err) => {
        console.error(err);
        fetchFavorites();
      });
  };

  const filteredFavorites = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedCategory !== "Semua" && r.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== "") {
        return r.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      }
      return true;
    });
  }, [recipes, selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Koleksi Resep Pilihan Saya</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
            Resep Favorit
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Simpanan hidangan favorit untuk menu harian dan momen spesial Anda.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="px-5 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm text-xs font-bold text-stone-700 dark:text-stone-300">
          Total Koleksi: <span className="text-brand-500 font-black">{recipes.length} Resep</span>
        </div>
      </div>

      {/* Filter and Search within favorites */}
      {recipes.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari dalam favorit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-stone-900 dark:text-white placeholder-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["Semua", "Makanan Utama", "Makanan Pembuka", "Makanan Penutup"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-brand-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-500">Memuat koleksi favorit...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="py-20 px-6 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-5 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10 fill-rose-500/20 text-rose-500" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl font-black text-stone-900 dark:text-white">
              Belum Ada Resep Favorit
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Tekan ikon hati (❤️) pada kartu resep yang Anda sukai di beranda untuk menyimpannya di sini.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow transition duration-200"
          >
            <span>Jelajahi Resep Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
          <p className="text-xs text-stone-500">Tidak ada resep favorit yang cocok dengan kata kunci pencarian.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("Semua");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={() => handleUnbookmark(recipe.id)}
              isAdmin={isAdmin}
              loggedInUser={loggedInUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
