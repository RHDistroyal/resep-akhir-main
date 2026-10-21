import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, Heart, Sparkles, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-850 bg-white/50 dark:bg-stone-900/40 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-400 p-0.5 shadow-glow">
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center text-brand-400">
                  <ChefHat className="w-5 h-5" />
                </div>
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                ResepKu
              </span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm leading-relaxed">
              Platform katalog resep modern dengan ribuan inspirasi kuliner Nusantara dan Internasional. Memasak jadi lebih mudah, menyenangkan, dan berkesan.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dapur Cerdas • Panduan Step-by-Step</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-4">
              Kategori Populer
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400 font-medium">
              <li>
                <Link to="/" className="hover:text-brand-500 transition">🍛 Makanan Utama</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-500 transition">🥟 Makanan Pembuka</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-500 transition">🍰 Makanan Penutup</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-brand-500 transition">🍹 Minuman Segar</Link>
              </li>
            </ul>
          </div>

          {/* Quick features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-4">
              Fitur Andalan
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400 font-medium">
              <li className="flex items-center gap-2">
                <span>⏱️</span> Timer Masak Otomatis
              </li>
              <li className="flex items-center gap-2">
                <span>⚖️</span> Skala Porsi Fleksibel
              </li>
              <li className="flex items-center gap-2">
                <span>🛒</span> Ceklis Bahan Pintar
              </li>
              <li className="flex items-center gap-2">
                <span>🌙</span> Dark / Light Mode
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© {new Date().getFullYear()} ResepKu. Dibuat dengan cinta untuk pecinta kuliner sejati.</p>
          <div className="flex items-center gap-2">
            <span>Ditenagai oleh React & JSON Server</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
