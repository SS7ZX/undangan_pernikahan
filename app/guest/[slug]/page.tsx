"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WeddingInvitation from "@/app/page";
import type { Guest } from "@/lib/types";
import { fetchGuestBySlug } from "@/lib/guests";

/**
 * Personal invitation route.
 *
 * This route deliberately reuses the main invitation component so every guest
 * sees the exact same design, animation, music, RSVP, gallery, and event data.
 * Only the recipient name changes based on the guest slug.
 */
export default function GuestInvitationPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!slug) return;

    fetchGuestBySlug(slug).then((data) => {
      if (!active) return;
      setGuest(data);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
        <div className="text-center text-[#78786E]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#C9D4A8] border-t-[#8A9A5B] mx-auto mb-4" />
          <p className="font-serif text-xl">Menyiapkan undangan...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] px-6 text-center">
        <div>
          <p className="font-serif text-4xl text-[#2E3228] mb-3">Undangan tidak ditemukan</p>
          <p className="font-sans text-sm text-[#78786E]">
            Link undangan ini tidak valid atau tamunya belum terdaftar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <WeddingInvitation
      personalizedGuestName={guest.name}
      guestSlug={guest.slug}
      initialAttendance={guest.attendance}
    />
  );
}
