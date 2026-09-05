"use client";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  HOME PAGE — Main Invitation + Quick Access                              ║
 * ║  Shows main invitation with admin access                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Users, Link as LinkIcon, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-cream to-rose-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Wedding Portal</h2>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium flex items-center gap-2"
            >
              <BarChart3 size={18} />
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 py-20 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Undangan Pernikahan Digital
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Sistem manajemen tamu undangan dengan link unik untuk setiap tamu.
            Kelola, bagikan, dan pantau RSVP dengan mudah.
          </p>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={Users}
          title="Manajemen Tamu"
          description="Kelola semua data tamu dalam satu dashboard terpusat"
          delay={0.1}
        />
        <FeatureCard
          icon={LinkIcon}
          title="Link Personal"
          description="Setiap tamu mendapat link undangan unik dengan nama mereka"
          delay={0.2}
        />
        <FeatureCard
          icon={BarChart3}
          title="Tracking RSVP"
          description="Pantau status kehadiran tamu secara real-time"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
      >
        <Link
          href="/admin"
          className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-400 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-4">
            <BarChart3 className="text-slate-900" size={32} />
            <ArrowRight className="text-slate-400 group-hover:text-slate-900 transition" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Dashboard</h3>
          <p className="text-slate-600 mb-4">
            Kelola tamu, generate link, dan monitor kehadiran
          </p>
          <span className="text-sm font-semibold text-slate-700">Akses Dashboard →</span>
        </Link>

        <div className="group bg-linear-to-br from-rose-50 to-amber-50 rounded-2xl p-8 border border-rose-200">
          <div className="flex items-start justify-between mb-4">
            <LinkIcon className="text-rose-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Bagikan Undangan</h3>
          <p className="text-slate-600 mb-4">
            Gunakan admin panel untuk copy & bagikan link undangan personal
          </p>
          <span className="text-sm font-semibold text-slate-700">Terbuka dari Admin →</span>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-3xl mx-auto px-4 mb-20 bg-white rounded-2xl border border-slate-200 p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Cara Menggunakan</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <div>
              <h4 className="font-semibold text-slate-900">Akses Admin Dashboard</h4>
              <p className="text-slate-600 text-sm">Klik tombol &quot;Admin&quot; di atas untuk membuka dashboard</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <div>
              <h4 className="font-semibold text-slate-900">Kelola Daftar Tamu</h4>
              <p className="text-slate-600 text-sm">
                Edit <code className="bg-slate-100 px-2 py-1 rounded text-xs">public/guests.json</code> untuk mengubah data tamu
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
              3
            </span>
            <div>
              <h4 className="font-semibold text-slate-900">Copy & Bagikan Link</h4>
              <p className="text-slate-600 text-sm">
                Gunakan tombol &quot;Copy&quot; untuk copy link, atau &quot;Share&quot; untuk kirim via WhatsApp
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
              4
            </span>
            <div>
              <h4 className="font-semibold text-slate-900">Pantau Status</h4>
              <p className="text-slate-600 text-sm">
                Lihat statistik kehadiran dan RSVP di dashboard
              </p>
            </div>
          </li>
        </ol>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-600">
        <p>Dibuat dengan ❤️ untuk pernikahan Rian & Windi</p>
        <p className="text-sm mt-2">Next.js + TypeScript + Tailwind CSS</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-400 hover:shadow-lg transition"
    >
      <Icon className="text-slate-900 mb-4" size={32} />
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.div>
  );
}
