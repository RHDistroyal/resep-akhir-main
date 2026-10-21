import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 4) {
      toast.warning("Password minimal 4 karakter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);

    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((users) => {
        const userExists = users.some(
          (u) => u.username.toLowerCase() === formData.username.trim().toLowerCase()
        );

        if (userExists) {
          toast.error("Username sudah digunakan, silakan pilih yang lain!");
          setLoading(false);
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          username: formData.username.trim(),
          password: formData.password,
        };

        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        })
          .then((res) => res.json())
          .then(() => {
            toast.success("Pendaftaran berhasil! Silakan masuk ke akun baru Anda. 🎉");
            navigate("/login");
          })
          .catch((err) => {
            console.error(err);
            toast.error("Gagal mendaftarkan akun.");
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal terhubung ke database.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Brand Visual */}
        <div className="md:col-span-5 bg-gradient-to-br from-amber-600 via-brand-600 to-rose-600 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-black leading-tight">
              Bergabung Bersama Komunitas Koki
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Daftarkan diri Anda untuk mulai membagikan karya resep terbaik, berinteraksi dengan sesama pencinta rasa, dan mengelola menu favorit harian Anda.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Simpan resep favorit tanpa batas</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Akses mode memasak interaktif dengan timer</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>100% Gratis dan mudah digunakan</span>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-black text-stone-900 dark:text-white">
              Buat Akun Baru
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Hanya butuh beberapa detik untuk memulai perjalanan kuliner Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Pilih Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Contoh: chef_andi"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Buat Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Minimal 4 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Ulangi password di atas"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-500 dark:text-stone-400">
            Sudah memiliki akun?{" "}
            <Link
              to="/login"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
