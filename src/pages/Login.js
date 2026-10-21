import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickDemoLogin = (demoUsername, demoPassword) => {
    setFormData({ username: demoUsername, password: demoPassword });
    processLogin(demoUsername, demoPassword);
  };

  const processLogin = (userVal, passVal) => {
    setLoading(true);
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((users) => {
        const found = users.find(
          (u) => u.username === userVal && u.password === passVal
        );
        if (found) {
          onLogin(found);
          toast.success(`Selamat datang kembali, ${found.username}! 👋`);
          navigate("/");
        } else {
          toast.error("Username atau password salah!");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal terhubung ke database. Pastikan backend aktif.");
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processLogin(formData.username, formData.password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Brand Visual Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-brand-600 via-brand-500 to-amber-600 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-black leading-tight">
              Kelezatan Tanpa Batas di Dapur Anda
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Masuk untuk menyimpan koleksi resep favorit, menulis resep kreasi Anda, dan mengatur porsi masakan secara fleksibel.
            </p>
          </div>

          {/* Quick Demo Login Helpers */}
          <div className="relative z-10 pt-8 border-t border-white/20 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Akses Cepat Pengujian (1-Klik)
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin", "password123")}
                className="w-full py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold flex items-center justify-between transition text-white"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  Masuk sebagai Admin
                </span>
                <span className="text-[10px] text-white/70">admin / password123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("user1", "mypassword")}
                className="w-full py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold flex items-center justify-between transition text-white"
              >
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-300" />
                  Masuk sebagai Pengguna
                </span>
                <span className="text-[10px] text-white/70">user1 / mypassword</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-black text-stone-900 dark:text-white">
              Selamat Datang Kembali
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Masukkan akun Anda untuk melanjutkan ke platform ResepKu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Masukkan kata sandi"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-stone-500 dark:text-stone-400">
            Belum memiliki akun?{" "}
            <Link
              to="/register"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
