import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => {
        const bookmarkedRecipes = data.filter((recipe) => recipe.isBookmarked);
        setRecipes(bookmarkedRecipes);
      });
  }, []);

  const handleUnbookmark = (id) => {
    fetch(`http://localhost:5000/recipes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBookmarked: false }),
    }).then(() =>
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== id)
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Koleksi Favorit
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Resep-resep pilihan yang telah Anda simpan.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Belum ada resep favorit</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Jelajahi resep dan simpan yang Anda sukai di sini.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition shadow-lg hover:shadow-xl">
            Jelajahi Resep
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden group">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <button
                  onClick={() => handleUnbookmark(recipe.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all group-hover:opacity-100 opacity-0"
                  aria-label="Remove Favorite"
                  title="Hapus dari Favorit"
                >
                  ❌
                </button>
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                  {recipe.category}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{recipe.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                  Resep lezat yang mudah dibuat untuk hidangan spesial Anda.
                </p>
                
                <div className="flex space-x-2 mt-auto">
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-center py-2 rounded-xl font-medium transition-colors"
                  >
                    Lihat Resep
                  </Link>
                  <button
                    onClick={() => handleUnbookmark(recipe.id)}
                    className="px-4 bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white text-center py-2 rounded-xl font-medium transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
