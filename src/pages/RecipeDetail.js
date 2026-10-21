import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Heart, Clock, Users, Flame, Star, Share2, 
  Printer, Play, CheckCircle2, Circle, Edit3, Trash2, 
  Copy, ChefHat, Sparkles, AlertCircle, BookmarkCheck
} from "lucide-react";
import { toast } from "react-toastify";
import CookingModeModal from "../components/CookingModeModal";
import RecipeCard from "../components/RecipeCard";
import { scaleIngredient, getCategoryBadge, getDifficultyBadge } from "../utils/recipeHelper";

export default function RecipeDetail({ onUpdateFavoritesCount }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  
  // Interactive Portion Scaler
  const [servings, setServings] = useState(4);
  const [baseServings, setBaseServings] = useState(4);

  // Ingredients checklist state
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Steps checklist state
  const [completedSteps, setCompletedSteps] = useState({});

  // Cooking mode modal
  const [isCookingModeOpen, setIsCookingModeOpen] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.username === "admin";
  const isOwner = loggedInUser && recipe?.createdBy === loggedInUser.username;

  useEffect(() => {
    setLoading(true);
    setCheckedIngredients({});
    setCompletedSteps({});

    fetch(`http://localhost:5000/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Resep tidak ditemukan");
        return res.json();
      })
      .then((data) => {
        const recipeData = {
          ...data,
          id: String(data.id),
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients
            : data.ingredients ? data.ingredients.split(",").map((s) => s.trim()).filter(Boolean) : [],
          steps: Array.isArray(data.steps)
            ? data.steps
            : data.steps ? data.steps.split(".").map((s) => s.trim()).filter(Boolean) : [],
          servings: data.servings || 4,
          difficulty: data.difficulty || "Sedang",
          calories: data.calories || 320,
          rating: data.rating || 4.8,
          reviewsCount: data.reviewsCount || 36,
        };

        setRecipe(recipeData);
        setServings(recipeData.servings);
        setBaseServings(recipeData.servings);
        setLoading(false);

        // Fetch related recipes
        fetch("http://localhost:5000/recipes")
          .then((res) => res.json())
          .then((all) => {
            const related = all
              .filter((r) => String(r.id) !== String(id) && r.category === recipeData.category)
              .slice(0, 3);
            setRelatedRecipes(related);
          });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!recipe) return;
    const newStatus = !recipe.isBookmarked;

    setRecipe((prev) => ({ ...prev, isBookmarked: newStatus }));

    fetch(`http://localhost:5000/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBookmarked: newStatus }),
    })
      .then(() => {
        if (newStatus) {
          toast.success("Resep ditambahkan ke Favorit! ❤️");
        } else {
          toast.info("Resep dihapus dari Favorit.");
        }
        // Update count
        fetch("http://localhost:5000/recipes")
          .then((r) => r.json())
          .then((items) => {
            if (onUpdateFavoritesCount) {
              onUpdateFavoritesCount(items.filter((i) => i.isBookmarked).length);
            }
          });
      })
      .catch((err) => {
        console.error(err);
        setRecipe((prev) => ({ ...prev, isBookmarked: !newStatus }));
      });
  };

  // Delete recipe
  const handleDeleteRecipe = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus resep ini secara permanen?")) {
      fetch(`http://localhost:5000/recipes/${id}`, { method: "DELETE" })
        .then(() => {
          toast.success("Resep berhasil dihapus.");
          navigate("/");
        })
        .catch((err) => console.error(err));
    }
  };

  // Copy share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan resep disalin ke clipboard! 📋");
    } else {
      toast.info(`Bagikan link: ${window.location.href}`);
    }
  };

  // Copy ingredients list
  const handleCopyIngredients = () => {
    if (!recipe || !recipe.ingredients) return;
    const text = `🛒 Bahan-bahan untuk ${recipe.name} (${servings} Porsi):\n` +
      recipe.ingredients
        .map((ing) => `- ${scaleIngredient(ing, baseServings, servings)}`)
        .join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success("Daftar bahan berhasil disalin! 📝");
    }
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStepCheck = (idx) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-stone-500">Memuat detail resep...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-4xl">🍳</div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Resep Tidak Ditemukan</h2>
        <p className="text-xs text-stone-500">Resep ini mungkin telah dihapus atau tidak tersedia.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const categoryBadge = getCategoryBadge(recipe.category);
  const difficultyBadge = getDifficultyBadge(recipe.difficulty);

  const fallbackImage =
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Top Navigation & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-brand-500 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Resep</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-sm transition"
            title="Bagikan Resep"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-sm transition hidden sm:inline-flex"
            title="Cetak Resep"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Bookmark / Favorite */}
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition shadow-sm ${
              recipe.isBookmarked
                ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400"
                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${recipe.isBookmarked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{recipe.isBookmarked ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
          </button>

          {/* Owner / Admin Controls */}
          {(isAdmin || isOwner) && (
            <div className="flex items-center gap-1.5 ml-2 border-l border-stone-200 dark:border-stone-800 pl-3">
              <Link
                to={`/edit-recipe/${recipe.id}`}
                className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-750 transition"
                title="Edit Resep"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDeleteRecipe}
                className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                title="Hapus Resep"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Recipe Banner Card */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-xl">
        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-stone-900">
          <img
            src={recipe.image || fallbackImage}
            alt={recipe.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md border ${categoryBadge.bg}`}
            >
              <span>{categoryBadge.icon}</span>
              <span>{recipe.category}</span>
            </span>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md border ${difficultyBadge}`}
            >
              {recipe.difficulty}
            </span>
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{recipe.rating || "4.8"}</span>
              <span className="text-stone-300 font-normal">
                ({recipe.reviewsCount || 42} ulasan koki)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {recipe.name}
            </h1>

            {recipe.createdBy && (
              <p className="text-stone-300 text-xs font-medium flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-brand-400" />
                Resep kreasi: <span className="font-bold text-white">{recipe.createdBy}</span>
              </p>
            )}
          </div>
        </div>

        {/* Info Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800 bg-stone-50/70 dark:bg-stone-900/70 border-b border-stone-200 dark:border-stone-800">
          <div className="p-4 sm:p-6 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Waktu Memasak
            </span>
            <div className="flex items-center justify-center gap-1.5 text-stone-800 dark:text-stone-100 font-bold text-base">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>{recipe.time || "30 mnt"}</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Porsi Sajian
            </span>
            <div className="flex items-center justify-center gap-1.5 text-stone-800 dark:text-stone-100 font-bold text-base">
              <Users className="w-4 h-4 text-amber-500" />
              <span>{servings} Porsi</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Tingkat Kesulitan
            </span>
            <div className="flex items-center justify-center gap-1.5 text-stone-800 dark:text-stone-100 font-bold text-base">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Estimasi Kalori
            </span>
            <div className="flex items-center justify-center gap-1.5 text-stone-800 dark:text-stone-100 font-bold text-base">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{Math.round((recipe.calories / baseServings) * servings)} kkal</span>
            </div>
          </div>
        </div>

        {/* Cooking Mode Callout Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-500 via-amber-500 to-rose-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
              <Sparkles className="w-4 h-4" />
              <span>Asisten Dapur Interaktif</span>
            </div>
            <h3 className="text-xl font-black">Siap untuk Mulai Memasak?</h3>
            <p className="text-xs text-white/90 max-w-md">
              Gunakan panduan layar penuh dengan timer otomatis dan centang langkah saat memasak.
            </p>
          </div>

          <button
            onClick={() => setIsCookingModeOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-stone-900 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-stone-900 text-stone-900" />
            <span>Mulai Mode Memasak</span>
          </button>
        </div>

        {/* Recipe Body: Ingredients & Steps */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Ingredients Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span>🛒</span> Bahan-bahan
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Klik untuk menandai bahan yang sudah siap
                  </p>
                </div>

                <button
                  onClick={handleCopyIngredients}
                  className="p-2 rounded-xl text-stone-500 hover:text-brand-500 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                  title="Salin daftar bahan"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Portion Scaler Tool */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Ubah Jumlah Porsi:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-brand-500 hover:text-white font-bold text-sm flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm px-2 text-stone-900 dark:text-white">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings((prev) => Math.min(16, prev + 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-brand-500 hover:text-white font-bold text-sm flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Checklist list */}
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ingredient, index) => {
                  const scaledText = scaleIngredient(ingredient, baseServings, servings);
                  const isChecked = checkedIngredients[index];

                  return (
                    <li
                      key={index}
                      onClick={() => toggleIngredientCheck(index)}
                      className={`flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer select-none transition ${
                        isChecked
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 text-stone-400 line-through"
                          : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200"
                      }`}
                    >
                      <button className="mt-0.5 text-stone-400">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 hover:text-brand-500" />
                        )}
                      </button>
                      <span className="text-xs font-medium leading-relaxed">{scaledText}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Chef Notes / Catatan Tambahan */}
            {(recipe.note && (Array.isArray(recipe.note) ? recipe.note.length > 0 && recipe.note[0] !== "" : recipe.note !== "")) && (
              <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <span>💡</span>
                  <h4>Catatan & Tips Koki</h4>
                </div>
                <div className="text-xs text-amber-900/80 dark:text-amber-200/80 space-y-2 leading-relaxed">
                  {Array.isArray(recipe.note) ? (
                    recipe.note.map((n, i) => <p key={i}>• {n}</p>)
                  ) : (
                    <p>• {recipe.note}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Steps Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>👩‍🍳</span> Langkah Pembuatan
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ikuti langkah demi langkah untuk hasil yang sempurna
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                Total {recipe.steps.length} Langkah
              </span>
            </div>

            {/* Steps list */}
            <div className="space-y-4">
              {recipe.steps.map((step, index) => {
                const isStepDone = completedSteps[index];

                return (
                  <div
                    key={index}
                    onClick={() => toggleStepCheck(index)}
                    className={`group p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isStepDone
                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 opacity-75"
                        : "bg-white dark:bg-stone-850 border-stone-200/80 dark:border-stone-800 hover:border-brand-300 dark:hover:border-brand-700/60 shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-xs transition ${
                        isStepDone
                          ? "bg-emerald-500 text-white"
                          : "bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 group-hover:bg-brand-500 group-hover:text-white"
                      }`}
                    >
                      {isStepDone ? "✓" : index + 1}
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Langkah {index + 1}
                      </span>
                      <p
                        className={`text-sm leading-relaxed ${
                          isStepDone
                            ? "line-through text-stone-400 dark:text-stone-500"
                            : "text-stone-800 dark:text-stone-200"
                        }`}
                      >
                        {step}
                      </p>
                    </div>

                    <button
                      className="mt-1 text-stone-300 hover:text-emerald-500"
                      title={isStepDone ? "Tandai belum selesai" : "Tandai selesai"}
                    >
                      {isStepDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 group-hover:text-brand-400" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Related Recipes Section */}
      {relatedRecipes.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-black text-stone-900 dark:text-white">
                Resep Terkait Lainnya
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pilihan hidangan lezat lainnya dalam kategori {recipe.category}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedRecipes.map((rel) => (
              <RecipeCard
                key={rel.id}
                recipe={rel}
                onToggleFavorite={() => {}}
                isAdmin={isAdmin}
                loggedInUser={loggedInUser}
              />
            ))}
          </div>
        </section>
      )}

      {/* Interactive Cooking Mode Modal */}
      <CookingModeModal
        recipe={recipe}
        isOpen={isCookingModeOpen}
        onClose={() => setIsCookingModeOpen(false)}
      />
    </div>
  );
}
