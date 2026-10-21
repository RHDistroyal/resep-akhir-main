import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Plus, Trash2, Image, Sparkles, Clock, 
  Users, Flame, ChefHat, CheckCircle2 
} from "lucide-react";
import { toast } from "react-toastify";

const PRESET_IMAGES = [
  { label: "Nasi / Lauk", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
  { label: "Sup / Kuah", url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80" },
  { label: "Kue / Dessert", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80" },
  { label: "Camilan / Gorengan", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" },
];

export default function AddRecipe() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    category: "Makanan Utama",
    difficulty: "Mudah",
    time: "30 Menit",
    servings: 4,
    calories: 350,
    note: "",
  });

  // Dynamic lists for ingredients & steps
  const [ingredients, setIngredients] = useState([
    "500 gr bahan utama",
    "3 siung bawang putih cincang",
    "1 sdt garam & penyedap",
  ]);

  const [steps, setSteps] = useState([
    "Siapkan semua bahan dan cuci bersih.",
    "Tumis bumbu hingga harum dan matang sempurna.",
    "Masak hingga matang dan sajikan selagi hangat.",
  ]);

  const [imageError, setImageError] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "image") setImageError(false);
  };

  // Ingredient list operations
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Step list operations
  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStepField = () => {
    setSteps([...steps, ""]);
  };

  const removeStepField = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);

    if (cleanIngredients.length === 0) {
      toast.warning("Mohon masukkan minimal 1 bahan makanan.");
      return;
    }

    if (cleanSteps.length === 0) {
      toast.warning("Mohon masukkan minimal 1 langkah pembuatan.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      image: formData.image.trim() || PRESET_IMAGES[0].url,
      category: formData.category,
      difficulty: formData.difficulty,
      time: formData.time.trim() || "30 Menit",
      servings: Number(formData.servings) || 4,
      calories: Number(formData.calories) || 350,
      note: formData.note.trim() ? [formData.note.trim()] : [],
      ingredients: cleanIngredients,
      steps: cleanSteps,
      rating: 5.0,
      reviewsCount: 1,
      isBookmarked: false,
      createdBy: loggedInUser?.username || "Koki Tamu",
    };

    fetch("http://localhost:5000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newRecipe) => {
        toast.success("Resep baru berhasil dipublikasikan! 🎉");
        navigate(`/recipe/${newRecipe.id}`, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal menyimpan resep. Pastikan server aktif.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-brand-500 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Batal & Kembali</span>
      </Link>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 text-xs font-bold mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kreator Dapur ResepKu</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
            Tulis Resep Baru
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Bagikan kelezatan racikan bumbu rahasia Anda kepada ribuan pecinta kuliner.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Informasi Utama & Live Image Preview */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-2">
              1. Informasi Pokok
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Form Inputs */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Nama Resep *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Rendang Sapi Spesial Padang"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    URL Foto Masakan (Internet Link)
                  </label>
                  <input
                    type="url"
                    name="image"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {/* Preset photo suggestions */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-stone-400 font-bold">Pilihan cepat:</span>
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-brand-500 hover:text-white transition font-medium text-stone-600 dark:text-stone-300"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                    >
                      <option value="Makanan Utama">Makanan Utama</option>
                      <option value="Makanan Pembuka">Makanan Pembuka</option>
                      <option value="Makanan Penutup">Makanan Penutup</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Camilan">Camilan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Kesulitan
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                    >
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Mahir">Mahir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Waktu
                    </label>
                    <input
                      type="text"
                      name="time"
                      placeholder="30 Menit"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Porsi
                    </label>
                    <input
                      type="number"
                      name="servings"
                      min="1"
                      max="30"
                      value={formData.servings}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Live Image Preview Card */}
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Pratinjau Foto
                </label>
                <div className="relative h-56 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-850 shadow-inner flex items-center justify-center">
                  {formData.image && !imageError ? (
                    <img
                      src={formData.image}
                      alt="Pratinjau Resep"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center p-4 text-stone-400 space-y-2">
                      <Image className="w-8 h-8 mx-auto opacity-50" />
                      <p className="text-[11px]">Masukkan link foto masakan yang valid</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Bahan-Bahan Masakan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                2. Daftar Bahan Masakan ({ingredients.length})
              </h3>
              <button
                type="button"
                onClick={addIngredientField}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 text-xs font-bold hover:bg-brand-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Bahan
              </button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-stone-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    placeholder="Contoh: 250 gr Daging Sapi / 1 sdt Garam"
                    value={ing}
                    onChange={(e) => handleIngredientChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientField(idx)}
                    disabled={ingredients.length <= 1}
                    className="p-2.5 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-30 disabled:hover:text-stone-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Langkah-Langkah Pembuatan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                3. Langkah Pembuatan ({steps.length})
              </h3>
              <button
                type="button"
                onClick={addStepField}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 text-xs font-bold hover:bg-brand-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Langkah
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <textarea
                    rows="2"
                    placeholder={`Tuliskan instruksi langkah ke-${idx + 1}...`}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeStepField(idx)}
                    disabled={steps.length <= 1}
                    className="p-2.5 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-30 disabled:hover:text-stone-400 transition mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Catatan & Tips Tambahan */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-2">
              4. Catatan Koki & Tips (Opsional)
            </h3>
            <textarea
              rows="3"
              name="note"
              placeholder="Contoh: Lebih nikmat disajikan bersama sambal bajak dan kerupuk udang..."
              value={formData.note}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <Link
              to="/"
              className="px-6 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition duration-200"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publikasikan Resep</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
