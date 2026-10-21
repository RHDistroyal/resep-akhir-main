import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, SlidersHorizontal, LayoutGrid, List, Sparkles, 
  Flame, Clock, Users, ArrowRight, X, RotateCcw, ChefHat, Check
} from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { parseTimeInMinutes } from "../utils/recipeHelper";

export default function Home({ onUpdateFavoritesCount }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState("name"); // 'name' | 'ingredients'
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Semua");
  const [maxTime, setMaxTime] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'quick' | 'name' | 'reviews'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.username === "admin";

  const categories = [
    { label: "Semua", icon: "🍽️" },
    { label: "Makanan Utama", icon: "🍛" },
    { label: "Makanan Pembuka", icon: "🥟" },
    { label: "Makanan Penutup", icon: "🍰" },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
        const bookmarked = data.filter((r) => r.isBookmarked).length;
        if (onUpdateFavoritesCount) onUpdateFavoritesCount(bookmarked);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setLoading(false);
      });
  }, [onUpdateFavoritesCount]);

  // Toggle favorite with optimistic update
  const handleToggleFavorite = (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: updatedStatus } : r))
    );

    // Update parent favorites counter
    setTimeout(() => {
      setRecipes((current) => {
        const count = current.filter((r) => r.isBookmarked).length;
        if (onUpdateFavoritesCount) onUpdateFavoritesCount(count);
        return current;
      });
    }, 50);

    fetch(`http://localhost:5000/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBookmarked: updatedStatus }),
    }).catch((err) => {
      console.error("Failed to update bookmark:", err);
      // Revert if error
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isBookmarked: currentStatus } : r))
      );
    });
  };

  // Filter and sort computation
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        // Category filter
        if (selectedCategory !== "Semua" && recipe.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== "Semua" && recipe.difficulty !== selectedDifficulty) {
          return false;
        }

        // Cooking time filter
        if (maxTime !== "all") {
          const minutes = parseTimeInMinutes(recipe.time);
          if (maxTime === "quick" && minutes > 30) return false;
          if (maxTime === "medium" && (minutes <= 30 || minutes > 60)) return false;
          if (maxTime === "long" && minutes <= 60) return false;
        }

        // Search term filter (by name or by ingredient)
        if (searchTerm.trim() !== "") {
          const query = searchTerm.toLowerCase().trim();
          if (searchMode === "name") {
            return recipe.name.toLowerCase().includes(query);
          } else {
            // Search in ingredients list
            const ingList = Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join(" ").toLowerCase()
              : (recipe.ingredients || "").toLowerCase();
            return ingList.includes(query);
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          return (b.rating || 4.5) - (a.rating || 4.5);
        }
        if (sortBy === "reviews") {
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        }
        if (sortBy === "quick") {
          return parseTimeInMinutes(a.time) - parseTimeInMinutes(b.time);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [recipes, selectedCategory, selectedDifficulty, maxTime, searchTerm, searchMode, sortBy]);

  // Spotlight Recipe (First popular recipe)
  const spotlightRecipe = useMemo(() => {
    return recipes.find((r) => r.rating >= 4.8) || recipes[0];
  }, [recipes]);

  const hasActiveFilters =
    selectedCategory !== "Semua" ||
    selectedDifficulty !== "Semua" ||
    maxTime !== "all" ||
    searchTerm.trim() !== "";

  const resetFilters = () => {
    setSelectedCategory("Semua");
    setSelectedDifficulty("Semua");
    setMaxTime("all");
    setSearchTerm("");
    setSortBy("popular");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-8 md:p-12 border border-stone-800 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Dapur Cerdas & Katalog Resep</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Eksplorasi Rasa,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-rose-400">
                Ciptakan Kelezatan
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Temukan inspirasi hidangan rumahan hingga sajian restoran bintang lima. Dilengkapi mode memasak interaktif, kalkulator porsi dinamis, dan ceklis bahan pintar.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <ChefHat className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold">{recipes.length} Koleksi Resep</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Timer Memasak Aktif</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Skala Porsi Otomatis</span>
              </div>
            </div>
          </div>

          {/* Spotlight Featured Card */}
          {spotlightRecipe && (
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-stone-800/80 border border-stone-700/80 shadow-card hover:border-brand-500/50 transition-all duration-300">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={spotlightRecipe.image}
                    alt={spotlightRecipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500 text-white shadow-md">
                      <Flame className="w-3.5 h-3.5" />
                      Resep Pilihan Hari Ini
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-amber-300">
                      ⭐ {spotlightRecipe.rating || "4.9"}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                    {spotlightRecipe.category}
                  </span>
                  <h3 className="text-xl font-bold text-white line-clamp-1">
                    {spotlightRecipe.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    {Array.isArray(spotlightRecipe.note) && spotlightRecipe.note.length > 0
                      ? spotlightRecipe.note[0]
                      : spotlightRecipe.note || "Hidangan istimewa penuh kelezatan untuk keluarga tercinta."}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-400" />
                        {spotlightRecipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-brand-400" />
                        {spotlightRecipe.servings || 4} Porsi
                      </span>
                    </div>

                    <Link
                      to={`/recipe/${spotlightRecipe.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition shadow-sm"
                    >
                      Mulai Masak
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search & Multi-Filter Control Hub */}
      <section className="space-y-6">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.label
                  ? "bg-brand-500 text-white shadow-glow scale-[1.02]"
                  : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-brand-300 dark:hover:border-brand-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.label === "Semua" ? (
                <span className="ml-1 text-[10px] opacity-80">({recipes.length})</span>
              ) : (
                <span className="ml-1 text-[10px] opacity-80">
                  ({recipes.filter((r) => r.category === cat.label).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter bar and Search Box */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-soft space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input Box */}
            <div className="md:col-span-6 relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={
                  searchMode === "name"
                    ? "Cari nama resep (contoh: Rendang, Sop, Samosa)..."
                    : "Cari bahan di kulkas (contoh: telur, daging, kentang)..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-stone-900 dark:text-white placeholder-stone-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Mode Switcher */}
            <div className="md:col-span-3 flex items-center bg-stone-100 dark:bg-stone-850 p-1 rounded-2xl border border-stone-200 dark:border-stone-750">
              <button
                onClick={() => setSearchMode("name")}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition ${
                  searchMode === "name"
                    ? "bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-300 shadow-sm"
                    : "text-stone-600 dark:text-stone-400"
                }`}
              >
                Nama Resep
              </button>
              <button
                onClick={() => setSearchMode("ingredients")}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition ${
                  searchMode === "ingredients"
                    ? "bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-300 shadow-sm"
                    : "text-stone-600 dark:text-stone-400"
                }`}
              >
                Bahan Kulkas
              </button>
            </div>

            {/* Sort & View Mode */}
            <div className="md:col-span-3 flex items-center gap-2 justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-stone-800 dark:text-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="popular">⭐ Rating Tertinggi</option>
                <option value="reviews">💬 Paling Banyak Diulas</option>
                <option value="quick">⚡ Waktu Tercepat</option>
                <option value="name">🔤 Nama A - Z</option>
              </select>

              {/* View Switcher: Grid vs List */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-850 p-1 rounded-2xl border border-stone-200 dark:border-stone-750">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition ${
                    viewMode === "list"
                      ? "bg-white dark:bg-stone-700 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                  title="Tampilan List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub Filters: Difficulty & Time */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] mr-1">
                Filter Tambahan:
              </span>

              {/* Difficulty filter buttons */}
              {["Semua", "Mudah", "Sedang", "Mahir"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-xl font-semibold border transition ${
                    selectedDifficulty === diff
                      ? "bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent"
                      : "border-stone-200 dark:border-stone-750 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                  }`}
                >
                  {diff}
                </button>
              ))}

              <div className="w-px h-4 bg-stone-200 dark:bg-stone-750 mx-1 hidden sm:block" />

              {/* Time filter buttons */}
              {[
                { id: "all", label: "Semua Durasi" },
                { id: "quick", label: "⚡ < 30 mnt" },
                { id: "medium", label: "⏱️ 30-60 mnt" },
                { id: "long", label: "⏳ > 60 mnt" },
              ].map((timeOpt) => (
                <button
                  key={timeOpt.id}
                  onClick={() => setMaxTime(timeOpt.id)}
                  className={`px-3 py-1 rounded-xl font-semibold border transition ${
                    maxTime === timeOpt.id
                      ? "bg-brand-500 text-white border-brand-500"
                      : "border-stone-200 dark:border-stone-750 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                  }`}
                >
                  {timeOpt.label}
                </button>
              ))}
            </div>

            {/* Clear filters if active */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Recipe Catalog Grid / List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-white">
              {selectedCategory === "Semua" ? "Koleksi Resep Pilihan" : selectedCategory}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Menampilkan {filteredRecipes.length} hidangan lezat siap dimasak
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-stone-500">Menyiapkan hidangan lezat...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="py-20 px-4 text-center bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Tidak Ada Resep yang Cocok
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
              Kami tidak menemukan resep untuk kata kunci atau kombinasi filter saat ini. Coba gunakan kata kunci lain atau reset filter.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 text-white font-bold text-xs shadow-md hover:bg-brand-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Tampilkan Semua Resep
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={handleToggleFavorite}
                isAdmin={isAdmin}
                loggedInUser={loggedInUser}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
