import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddRecipe() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    note: "",
    ingredients: "",
    steps: "",
    time: "",
    category: "Makanan Utama",
  });

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        note: formData.note.split(",").map((item) => item.trim()).filter(Boolean),
        ingredients: formData.ingredients.split(",").map((item) => item.trim()).filter(Boolean),
        steps: formData.steps.split(".").map((item) => item.trim()).filter(Boolean),
        createdBy: loggedInUser?.username || "unknown",
        isBookmarked: false
      }),
    })
      .then((res) => res.json())
      .then((newRecipe) => {
        navigate(`/recipe/${newRecipe.id}`, { replace: true });
      });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6 font-medium">
        <span>← Kembali</span>
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Tambah Resep Baru</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Bagikan kreasi masakan terbaik Anda ke dunia.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Resep</label>
              <input
                type="text"
                name="name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Gambar</label>
              <input
                type="text"
                name="image"
                placeholder="https://contoh.com/gambar.jpg"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition"
              >
                <option value="Makanan Pembuka">Makanan Pembuka</option>
                <option value="Makanan Utama">Makanan Utama</option>
                <option value="Makanan Penutup">Makanan Penutup</option>
                <option value="Minuman">Minuman</option>
                <option value="Camilan">Camilan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estimasi Waktu</label>
              <input
                type="text"
                name="time"
                placeholder="Contoh: 30 Menit"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bahan-bahan (pisahkan dengan koma)</label>
              <textarea
                name="ingredients"
                placeholder="Bawang merah, bawang putih, garam..."
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition resize-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Langkah-langkah (pisahkan dengan titik)</label>
              <textarea
                name="steps"
                placeholder="Potong bawang. Tumis hingga harum. Masukkan nasi..."
                value={formData.steps}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition resize-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Catatan (Opsional, pisahkan dengan koma)</label>
              <textarea
                name="note"
                placeholder="Sajikan selagi hangat, tambahkan kerupuk..."
                value={formData.note}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
            >
              Simpan Resep
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecipe;
