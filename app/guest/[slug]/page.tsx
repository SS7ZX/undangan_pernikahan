"use client";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  GUEST INVITATION PAGE — Personal Undangan per Tamu                      ║
 * ║  Dynamic route: /guest/[slug]                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Share2, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import type { Guest } from "@/lib/types";
import { fetchGuestBySlug, generateGuestLink } from "@/lib/guests";
import { formatPhoneForWhatsApp, generateWhatsAppMessage } from "@/lib/guest-utils";

// Re-export the main invitation component styles & config
const C = {
  groom: "Rian",
  bride: "Windi",
  groomFull: "Rian Pebriansyah, S.Psi",
  brideFull: "Windi Nuraeni",
  date: "Sabtu, 07 November 2026",
  dateFormal: "07 · 11 · 2026",
  day: "Sabtu",
  time: "Pukul 08.00 WIB",
  venue: "Rumah Mempelai Wanita",
  address: "Kp. Jatimulya 2 RT/RW 001/003 No. 1, Kel. Mekarjati, Karawang Barat, Kab. Karawang",
  mapsUrl: "https://www.google.com/maps/place/Pengajian+Nurul+aini/@-6.2601681,107.2912323,17z",
  quote: "Dua jiwa yang menemukan rumah satu sama lain — kami bersyukur kau hadir menyaksikan awal perjalanan kami.",
} as const;

export default function GuestInvitationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [guest, setGuest] = useState<Guest | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchGuestBySlug(slug).then((data) => {
      if (!active) return;
      setGuest(data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  const handleCopyLink = () => {
    const link = generateGuestLink(slug);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const link = generateGuestLink(slug);
    const message = generateWhatsAppMessage(guest?.name || "Tamu Undangan", link);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Undangan Pernikahan",
          text: message,
          url: link,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      const phone = formatPhoneForWhatsApp(guest?.phone || "");
      const target = phone ? `https://wa.me/${phone}` : "https://wa.me/";
      window.open(`${target}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleWhatsAppRSVP = (attendance: "yes" | "no") => {
    const guestDisplayName = guest?.name || "Tamu Undangan";
    const phone = formatPhoneForWhatsApp(guest?.phone || "");
    const message = attendance === "yes"
      ? `Assalamu'alaikum, saya ${guestDisplayName} menyatakan *hadir* di pernikahan Rian Pebriansyah & Windi Nuraeni pada ${C.date}. Terima kasih 🙏`
      : `Assalamu'alaikum, saya ${guestDisplayName} mohon maaf *tidak dapat hadir* di pernikahan Rian Pebriansyah & Windi Nuraeni. Semoga acaranya lancar 🙏`;
    const target = phone ? `https://wa.me/${phone}` : "https://wa.me/";
    window.open(`${target}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-300 border-t-rose-600 mx-auto mb-4" />
          <p className="text-rose-600 font-medium">Loading undangan...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-rose-50">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-rose-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Undangan Tidak Ditemukan</h2>
          <p className="text-slate-600">Link undangan mungkin sudah expired atau tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-cream to-rose-50">
      {/* Header with Guest Name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 px-4"
      >
        <p className="text-sm text-rose-600 font-medium tracking-wider uppercase mb-2">
          Undangan Spesial Untuk
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          {guest.name}
        </h1>
        <p className="text-slate-600">{guest.relation}</p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Decorative Top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Heart className="mx-auto text-rose-400 mb-4" size={40} />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-rose-100"
        >
          {/* Quote */}
          <div className="text-center mb-8">
            <p className="text-lg text-slate-700 italic mb-4">
              &quot;{C.quote}&quot;
            </p>
            <div className="w-12 h-1 bg-rose-400 mx-auto" />
          </div>

          {/* Wedding Details */}
          <div className="space-y-6 mb-8">
            {/* Names */}
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Kami mengundang</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-bold text-slate-900">{C.groom}</span>
                <Heart size={24} className="text-rose-400" />
                <span className="text-2xl font-bold text-slate-900">{C.bride}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">{C.groomFull}</p>
              <p className="text-xs text-slate-500">{C.brideFull}</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-rose-200" />
              <span className="text-rose-400">✧</span>
              <div className="flex-1 h-px bg-rose-200" />
            </div>

            {/* Date & Time */}
            <div className="bg-linear-to-r from-rose-50 to-amber-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-600 mb-2">HARI & TANGGAL</p>
              <p className="text-3xl font-bold text-slate-900 mb-1">{C.day}</p>
              <p className="text-xl font-semibold text-rose-600 mb-4">{C.date}</p>
              <p className="text-sm text-slate-600">
                Waktu: <span className="font-semibold text-slate-900">{C.time}</span>
              </p>
            </div>

            {/* Location */}
            <div className="bg-linear-to-r from-amber-50 to-rose-50 rounded-2xl p-6">
              <p className="text-sm text-slate-600 mb-2 font-semibold">📍 LOKASI</p>
              <p className="text-slate-900 font-semibold mb-2">{C.venue}</p>
              <p className="text-sm text-slate-600 mb-4">{C.address}</p>
              <a
                href={C.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition font-medium"
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy Link
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg transition font-medium"
            >
              <Share2 size={20} />
              Share
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleWhatsAppRSVP("yes")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium"
            >
              <MessageCircle size={18} />
              Hadir
            </button>
            <button
              onClick={() => handleWhatsAppRSVP("no")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition font-medium"
            >
              Tidak Hadir
            </button>
          </div>

          {/* RSVP Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💌 RSVP</span> melalui link undangan digital ini atau hubungi kami via WhatsApp
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 text-sm mb-8"
        >
          <p>Terima kasih telah menjadi bagian dari kebahagiaan kami</p>
          <p className="mt-2">🤍 {C.groom} & {C.bride}</p>
        </motion.div>
      </div>
    </div>
  );
}
