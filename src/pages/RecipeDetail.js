import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  // Ambil data pengguna yang login
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.username === "admin";

  useEffect(() => {
    fetch(`http://localhost:5000/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe({ ...data, id: String(data.id) }));
  }, [id]);

  const deleteRecipe = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus resep ini?")) {
      fetch(`http://localhost:5000/recipes/${id}`, { method: "DELETE" }).then(() =>
        navigate("/")
      );
    }
  };

  if (!recipe) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6 font-medium">
        <span>← Kembali ke Daftar Resep</span>
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="relative h-64 md:h-96">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full backdrop-blur-md">
                {recipe.category}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-md flex items-center gap-1">
                ⏱️ {recipe.time}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">{recipe.name}</h1>
            {recipe.createdBy && (
              <p className="text-gray-300 font-medium">Ditambahkan oleh: {recipe.createdBy}</p>
            )}
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Sidebar (Bahan & Info) */}
            <div className="md:col-span-1 space-y-8">
              <div className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-orange-100 dark:border-gray-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🛒</span> Bahan-bahan
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(recipe.note && (Array.isArray(recipe.note) ? recipe.note.length > 0 && recipe.note[0] !== "" : recipe.note !== "")) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>💡</span> Catatan
                  </h2>
                  <ul className="space-y-2">
                    {Array.isArray(recipe.note) ? (
                      recipe.note.map((note, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm italic">{note}</li>
                      ))
                    ) : (
                      <li className="text-gray-700 dark:text-gray-300 text-sm italic">{recipe.note}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Main Content (Langkah-langkah) */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>👩‍🍳</span> Langkah Pembuatan
              </h2>
              <div className="space-y-6">
                {recipe.steps && recipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin / Owner Controls */}
          {(isAdmin || loggedInUser?.username === recipe.createdBy) && (
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={deleteRecipe}
                className="px-6 py-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white rounded-xl font-medium transition-colors"
              >
                Hapus Resep
              </button>
              <Link
                to={`/edit-recipe/${recipe.id}`}
                className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                Edit Resep
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
