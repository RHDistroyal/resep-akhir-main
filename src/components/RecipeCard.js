import React from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, Flame, Star, Edit3, ArrowRight } from "lucide-react";
import { getCategoryBadge, getDifficultyBadge } from "../utils/recipeHelper";

export default function RecipeCard({
  recipe,
  onToggleFavorite,
  isAdmin = false,
  loggedInUser = null,
  viewMode = "grid", // 'grid' | 'list'
}) {
  const isOwner = loggedInUser && recipe.createdBy === loggedInUser.username;
  const categoryStyle = getCategoryBadge(recipe.category);
  const difficultyStyle = getDifficultyBadge(recipe.difficulty || "Sedang");

  const defaultFallbackImage =
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80";

  if (viewMode === "list") {
    return (
      <div className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-4 hover:border-brand-300 dark:hover:border-brand-700/60 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-full sm:w-48 h-36 flex-shrink-0 rounded-2xl overflow-hidden">
          <img
            src={recipe.image || defaultFallbackImage}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = defaultFallbackImage;
            }}
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(recipe.id, recipe.isBookmarked);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-sm hover:scale-110 active:scale-95 transition"
            title={recipe.isBookmarked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          >
            <Heart
              className={`w-4 h-4 transition ${
                recipe.isBookmarked
                  ? "fill-rose-500 text-rose-500"
                  : "text-stone-400 dark:text-stone-300 hover:text-rose-500"
              }`}
            />
          </button>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle.bg}`}
            >
              <span>{categoryStyle.icon}</span>
              <span>{recipe.category}</span>
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyStyle}`}
            >
              {recipe.difficulty || "Mudah"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1 mb-1">
            {recipe.name}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
            {Array.isArray(recipe.note) && recipe.note.length > 0
              ? recipe.note[0]
              : recipe.note || "Resep istimewa dengan cita rasa autentik dan kaya bumbu."}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              {recipe.time || "30 mnt"}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-500" />
              {recipe.servings || 4} Porsi
            </span>
            {recipe.rating && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {recipe.rating} ({recipe.reviewsCount || 24})
              </span>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
          <Link
            to={`/recipe/${recipe.id}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-sm hover:shadow-md transition"
          >
            Lihat Resep
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {(isAdmin || isOwner) && (
            <Link
              to={`/edit-recipe/${recipe.id}`}
              className="p-2 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Edit Resep"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 overflow-hidden hover:border-brand-300 dark:hover:border-brand-700/60 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col">
      {/* Recipe Image Card Header */}
      <div className="relative h-52 overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={recipe.image || defaultFallbackImage}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultFallbackImage;
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(recipe.id, recipe.isBookmarked);
          }}
          className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-sm hover:scale-110 active:scale-95 transition"
          title={recipe.isBookmarked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
        >
          <Heart
            className={`w-4 h-4 transition ${
              recipe.isBookmarked
                ? "fill-rose-500 text-rose-500"
                : "text-stone-400 dark:text-stone-300 hover:text-rose-500"
            }`}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-sm border ${categoryStyle.bg}`}
          >
            <span>{categoryStyle.icon}</span>
            <span>{recipe.category}</span>
          </span>
        </div>

        {/* Rating & Difficulty Pill on Bottom Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <span className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            {recipe.time || "30 mnt"}
          </span>
          <span className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {recipe.rating || "4.8"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${difficultyStyle}`}
          >
            {recipe.difficulty || "Mudah"}
          </span>
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {recipe.servings || 4} porsi
          </span>
          {recipe.calories && (
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              {recipe.calories} kkal
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1 mb-1.5">
          {recipe.name}
        </h3>

        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-5 flex-1">
          {Array.isArray(recipe.note) && recipe.note.length > 0
            ? recipe.note[0]
            : recipe.note || "Kreasi hidangan lezat dengan panduan langkah memasak yang praktis."}
        </p>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800/80 mt-auto">
          <Link
            to={`/recipe/${recipe.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 font-semibold text-xs transition duration-200"
          >
            Lihat Resep
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {(isAdmin || isOwner) && (
            <Link
              to={`/edit-recipe/${recipe.id}`}
              className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              title="Edit Resep"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
