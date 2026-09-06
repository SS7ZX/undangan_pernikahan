"use client";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  ADMIN DASHBOARD — Guest Management & Link Generator                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, MessageCircle, Download, Search,
  Users, BarChart3, MessageSquare, ArrowUpRight, Plus, X,
} from "lucide-react";
import type { Guest, GuestStats } from "@/lib/types";
import {
  fetchAllGuests,
  calculateGuestStats,
  generateGuestLink,
  getCategoryLabel,
  getCategoryColor,
  filterGuestsByCategory,
  sortGuestsByName,
} from "@/lib/guests";
import { formatPhoneForWhatsApp, generateWhatsAppMessage } from "@/lib/guest-utils";

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [addError, setAddError] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);

  // Load guests on mount
  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    const data = await fetchAllGuests();
    setGuests(data);
    setStats(calculateGuestStats(data));
    setLoading(false);
  };

  const handleAddGuest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newGuestName.trim()) {
      setAddError("Nama tamu wajib diisi");
      return;
    }

    setAddingGuest(true);
    setAddError("");
    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGuestName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tamu gagal ditambahkan");

      setNewGuestName("");
      setShowAddForm(false);
      await loadGuests();
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Tamu gagal ditambahkan");
    } finally {
      setAddingGuest(false);
    }
  };

  // Filter & search
  const normalizedPhoneQuery = searchQuery.replace(/\D/g, "");
  const filteredGuests = sortGuestsByName(filterGuestsByCategory(guests, selectedCategory))
    .filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.relation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (normalizedPhoneQuery.length > 0 && g.phone.includes(normalizedPhoneQuery))
    );

  // Copy link to clipboard
  const handleCopyLink = (slug: string, name: string, id: number) => {
    const link = generateGuestLink(slug);
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csv = [
      ["No.", "Nama", "Hubungan", "Kategori", "Link Undangan"].join(","),
      ...guests.map((g, i) => [
        i + 1,
        g.name,
        g.relation,
        getCategoryLabel(g.category),
        generateGuestLink(g.slug),
      ].map(v => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tamu-undangan-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Send WhatsApp
  const handleSendWhatsApp = (name: string, slug: string, phone: string) => {
    const link = generateGuestLink(slug);
    const message = encodeURIComponent(generateWhatsAppMessage(name, link));
    const normalizedPhone = formatPhoneForWhatsApp(phone);
    const target = normalizedPhone ? `https://wa.me/${normalizedPhone}` : "https://wa.me/";
    window.open(`${target}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading guest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Guest Management</h1>
              <p className="text-slate-600 mt-1">Manage invitations & track RSVPs</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm((isOpen) => !isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                {showAddForm ? <X size={18} /> : <Plus size={18} />}
                {showAddForm ? "Tutup" : "Tambah Tamu"}
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm && (
          <form onSubmit={handleAddGuest} className="bg-white rounded-lg border border-emerald-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                autoFocus
                type="text"
                value={newGuestName}
                onChange={(event) => setNewGuestName(event.target.value)}
                placeholder="Ketik nama tamu..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={addingGuest}
              />
              <button
                type="submit"
                disabled={addingGuest}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition"
              >
                {addingGuest ? "Menyimpan..." : "Simpan Nama"}
              </button>
            </div>
            {addError && <p className="text-sm text-red-600 mt-2">{addError}</p>}
            <p className="text-xs text-slate-500 mt-2">Link undangan akan dibuat otomatis dari nama tamu.</p>
          </form>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Tamu"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={Check}
              label="Hadir"
              value={stats.attended}
              color="emerald"
            />
            <StatCard
              icon={ArrowUpRight}
              label="Menunggu"
              value={stats.pending}
              color="amber"
            />
            <StatCard
              icon={MessageSquare}
              label="Menolak"
              value={stats.declined}
              color="red"
            />
            <StatCard
              icon={BarChart3}
              label="Kehadiran"
              value={`${stats.total ? Math.round((stats.attended / stats.total) * 100) : 0}%`}
              color="purple"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari nama atau hubungan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                {filteredGuests.length} tamu ditemukan. Cari berdasarkan nama, hubungan, atau nomor WhatsApp.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['all', 'groom', 'bride', 'family', 'friend', 'colleague', 'neighbor', 'guest'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat === "all" ? "Semua" : getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Hubungan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <AnimatePresence>
                  {filteredGuests.map((guest) => (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {guest.relation}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(
                            guest.category
                          )}-100 text-${getCategoryColor(guest.category)}-700`}
                        >
                          {getCategoryLabel(guest.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={guest.attendance} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleCopyLink(guest.slug, guest.name, guest.id)
                            }
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                            title="Copy link"
                          >
                            {copiedId === guest.id ? (
                              <Check size={18} className="text-emerald-600" />
                            ) : (
                              <Copy size={18} className="text-slate-600" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleSendWhatsApp(guest.name, guest.slug, guest.phone)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-xs font-medium whitespace-nowrap"
                            title={`Kirim undangan ke ${guest.name} lewat WhatsApp`}
                          >
                            <MessageCircle size={16} />
                            <span className="hidden sm:inline">Kirim WA</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Users size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600">No guests found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Components
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
    amber: "from-amber-50 to-amber-100 border-amber-200",
    red: "from-red-50 to-red-100 border-red-200",
    purple: "from-purple-50 to-purple-100 border-purple-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-linear-to-br ${colorClasses[color]} border p-6 rounded-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-200 rounded-lg opacity-60`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    yes: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Hadir" },
    no: { bg: "bg-red-50", text: "text-red-700", label: "Tidak Hadir" },
    maybe: { bg: "bg-amber-50", text: "text-amber-700", label: "Mungkin" },
    null: { bg: "bg-slate-50", text: "text-slate-700", label: "Menunggu" },
  };

  const badge = badges[status || "null"];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  );
}
