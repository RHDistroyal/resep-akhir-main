import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data pengguna yang login
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isAdmin = loggedInUser?.username === "admin";

  // Fetch data dari JSON Server
  useEffect(() => {
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id, isBookmarked) => {
    fetch(`http://localhost:5000/recipes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBookmarked: !isBookmarked }),
    }).then(() =>
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === id ? { ...recipe, isBookmarked: !isBookmarked } : recipe
        )
      )
    );
  };

  // Filter dan pencarian
  const filteredRecipes = recipes.filter(
    (recipe) =>
      (category === "Semua" || recipe.category === category) &&
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Eksplorasi Rasa
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Temukan resep terbaik untuk hidangan Anda hari ini.</p>
        </div>
        
        {/* Input pencarian dan filter kategori */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari resep..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Makanan Pembuka">Makanan Pembuka</option>
            <option value="Makanan Utama">Makanan Utama</option>
            <option value="Makanan Penutup">Makanan Penutup</option>
          </select>
        </div>
      </div>

      {/* Daftar resep */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">Tidak ada resep yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
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
                  onClick={() => toggleFavorite(recipe.id, recipe.isBookmarked)}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
                  aria-label="Toggle Favorite"
                >
                  {recipe.isBookmarked ? (
                    <span className="text-red-500">❤️</span>
                  ) : (
                    <span className="text-gray-400">🤍</span>
                  )}
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
                    Detail
                  </Link>
                  
                  {(isAdmin || recipe.createdBy === loggedInUser?.username) && (
                    <Link
                      to={`/edit-recipe/${recipe.id}`}
                      className="flex-1 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-center py-2 rounded-xl font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
