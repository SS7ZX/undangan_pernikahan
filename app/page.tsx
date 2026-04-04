"use client";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  UNDANGAN DIGITAL — app/page.tsx                                          ║
 * ║  Botanical Luxury · Award-grade · Android & iOS optimised                 ║
 * ║  By Adnan S                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * PERFORMANCE NOTES (for zero-lag on all phones):
 *  • All animations use transform/opacity only → GPU composited, no repaints
 *  • Heavy blur/backdrop-filter gated behind @media (prefers-reduced-motion)
 *  • Images use Next.js <Image> with proper sizes + priority
 *  • Petals use CSS animation (no JS RAF), will-change: transform
 *  • Parallax disabled on mobile (saves battery + prevents jank)
 *
 * SETUP:
 *  1. npm install framer-motion lucide-react
 *  2. /public → photo1.jpeg · photo2.jpeg · qris.png · wedding-song.mp3
 *  3. Edit CONFIG below — nothing else needs touching.
 */

import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring, useReducedMotion,
  type Variants, type MotionValue,
} from "framer-motion";
import {
  Calendar, Clock, MapPin, Music2, Pause,
  ChevronDown, Gift, Copy, Check, PenLine,
  Sparkles, Heart, Send, Phone,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// ① CONFIG — EDIT THIS! (all other code is generic and reusable)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  groom:         "Rian",
  bride:         "Juliet",
  groomFull:     "Rian Pebriansyah",
  brideFull:     "Juliet Capulet",
  date:          "Sabtu, 12 Desember 2026",
  dateFormal:    "12 · 12 · 2026",
  day:           "Saturday",
  time:          "Pukul 16.00 WIB",
  timeEn:        "At four o'clock in the afternoon",
  venue:         "The Grand Botanic Gardens",
  address:       "Jl. Elegance No. 123, Jakarta Selatan",
  mapsUrl:       "https://maps.google.com",
  whatsapp:      "62895369942679",
  bankName:      "Bank Mandiri",
  bankAccount:   "1234 5678 9012",
  accountHolder: "Romeo Montague",
  audioSrc:      "/wedding-song.mp3",
  photo1:        "/photo1.jpeg",
  photo2:        "/photo2.jpeg",
  qrisImg:       "/qris.png",
  quote:         "Dua jiwa yang menemukan rumah satu sama lain — kami bersyukur kau hadir menyaksikan awal perjalanan kami.",
  quoteEn:       "Two souls that found home in each other.",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ② MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

const vUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
};
const vIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.3 } },
};
const vScale: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease } },
};
const vStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.55 } },
};
const vFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const vSlideLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease } },
};
const vSlideRight: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease } },
};

// ─────────────────────────────────────────────────────────────────────────────
// ③ TINY PURE COMPONENTS (memoised)
// ─────────────────────────────────────────────────────────────────────────────

const Gem = memo(({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" }) => {
  const c = light ? "rgba(255,255,255,0.45)" : "#A8BA78";
  const w = size === "sm" ? 56 : 80;
  return (
    <svg width={w} height={8} viewBox={`0 0 ${w} 8`} fill="none">
      <line x1="0" y1="4" x2={w * 0.3} y2="4" stroke={c} strokeWidth="0.8" />
      <rect x={w * 0.32} y="2.5" width="3" height="3" transform={`rotate(45 ${w * 0.335} 4)`} fill={c} />
      <line x1={w * 0.38} y1="4" x2={w * 0.48} y2="4" stroke={c} strokeWidth="0.8" />
      <circle cx={w / 2} cy={4} r="2.5" fill={c} />
      <line x1={w * 0.52} y1="4" x2={w * 0.62} y2="4" stroke={c} strokeWidth="0.8" />
      <rect x={w * 0.645} y="2.5" width="3" height="3" transform={`rotate(45 ${w * 0.66} 4)`} fill={c} />
      <line x1={w * 0.7} y1="4" x2={w} y2="4" stroke={c} strokeWidth="0.8" />
    </svg>
  );
});
Gem.displayName = "Gem";

const SectionBadge = memo(({ label, light = false }: { label: string; light?: boolean }) => (
  <div className="flex items-center justify-center gap-3 mb-5">
    <Gem light={light} />
    <span
      className="font-sans text-[9px] tracking-[0.52em] uppercase"
      style={{ color: light ? "rgba(255,255,255,0.4)" : "#9A9A90" }}
    >
      {label}
    </span>
    <Gem light={light} />
  </div>
));
SectionBadge.displayName = "SectionBadge";

/** Card with top-edge botanical accent line */
const Card = memo(({ children, className = "", dark = false }: {
  children: React.ReactNode; className?: string; dark?: boolean;
}) => (
  <motion.div
    initial="hidden" whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={vScale}
    className={`relative overflow-hidden rounded-3xl ${className}`}
    style={{
      background: dark ? "#1A1F18" : "white",
      border:     dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #EFEDE8",
      boxShadow:  dark
        ? "0 16px 48px rgba(0,0,0,0.25)"
        : "0 4px 6px rgba(44,48,46,0.04), 0 16px 40px rgba(44,48,46,0.06)",
    }}
  >
    {/* Top accent */}
    <div className="absolute top-0 inset-x-0 h-[1.5px]" style={{
      background: dark
        ? "linear-gradient(90deg,transparent,rgba(168,186,120,0.4) 40%,rgba(168,186,120,0.4) 60%,transparent)"
        : "linear-gradient(90deg,transparent,#A8BA78 40%,#A8BA78 60%,transparent)",
    }} />
    {children}
  </motion.div>
));
Card.displayName = "Card";

/** Bottom-line form field */
const Field = memo(({ id, label, value, onChange, placeholder, rows }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; placeholder: string; rows?: number;
}) => {
  const [focused, setFocused] = useState(false);
  const shared: React.CSSProperties = {
    background: "transparent", border: "none", outline: "none",
    width: "100%", padding: "6px 0 12px",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.1rem", color: "#2C302E", resize: "none" as const,
    borderBottom: `1px solid ${focused ? "#8A9A5B" : "#E4E0D8"}`,
    transition: "border-color 0.3s ease",
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-sans text-[10px] tracking-[0.4em] uppercase" style={{ color: "#9A9A90" }}>
        {label}
      </label>
      {rows ? (
        <textarea id={id} rows={rows} required value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={shared}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      ) : (
        <input id={id} type="text" required value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={shared}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
});
Field.displayName = "Field";

function useParallax(v: MotionValue<number>, range: [string, string]) {
  return useTransform(v, [0, 1], range);
}

// ─────────────────────────────────────────────────────────────────────────────
// ④ MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function WeddingInvitation() {
  const prefersReducedMotion = useReducedMotion();

  const [loading,   setLoading]   = useState(true);
  const [loadPct,   setLoadPct]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [hoverBtn,  setHoverBtn]  = useState(false);
  const [name,      setName]      = useState("");
  const [msg,       setMsg]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  // Custom cursor (desktop only)
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const cx = useSpring(mx, { stiffness: 520, damping: 34, mass: 0.35 });
  const cy = useSpring(my, { stiffness: 520, damping: 34, mass: 0.35 });

  // Parallax — disabled on mobile for perf
  const { scrollYProgress: heroSY }    = useScroll({ target: heroRef,    offset: ["start start", "end start"] });
  const { scrollYProgress: gallerySY } = useScroll({ target: galleryRef, offset: ["start end",   "end start"] });
  const heroTY  = useParallax(heroSY,    isMobile || prefersReducedMotion ? ["0%","0%"] : ["0%","18%"]);
  const p1Y     = useParallax(gallerySY, isMobile || prefersReducedMotion ? ["0%","0%"] : ["-8%","8%"]);
  const p2Y     = useParallax(gallerySY, isMobile || prefersReducedMotion ? ["0%","0%"] : ["8%","-8%"]);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Loader progress
  useEffect(() => {
    let t = 0;
    const iv = setInterval(() => {
      t += Math.random() * 18 + 10;
      setLoadPct(Math.min(Math.round(t), 100));
      if (t >= 100) clearInterval(iv);
    }, 100);
    const tm = setTimeout(() => setLoading(false), 2800);
    return () => { clearInterval(iv); clearTimeout(tm); };
  }, []);

  // Cursor tracking
  useEffect(() => {
    if (isMobile) return;
    const fn = (e: MouseEvent) => { mx.set(e.clientX - 10); my.set(e.clientY - 10); };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [isMobile, mx, my]);

  // Audio
  useEffect(() => {
    const a = new Audio(C.audioSrc);
    a.loop = true; a.volume = 0.32;
    audioRef.current = a;
    return () => { a.pause(); a.src = ""; };
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setIsPlaying(p => !p);
  }, [isPlaying]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(C.bankAccount.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, []);

  const handleWish = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const txt =
      `✨ *Doa & Ucapan untuk ${C.groom} & ${C.bride}* ✨\n\n` +
      `*Dari:* ${name}\n\n*Pesan:*\n_${msg}_\n\n` +
      `— Dikirim via Undangan Digital · ${C.dateFormal}`;
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(txt)}`, "_blank");
    setSubmitted(true);
    setName(""); setMsg("");
    setTimeout(() => setSubmitted(false), 4500);
  }, [name, msg]);

  const hover = { onMouseEnter: () => setHoverBtn(true), onMouseLeave: () => setHoverBtn(false) };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══ GLOBAL STYLES ══════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }

        :root {
          --sage:       #8A9A5B;
          --sage-m:     #A8BA78;
          --sage-l:     #C9D4A8;
          --sage-p:     #F2F5E8;
          --charcoal:   #1E2219;
          --ink:        #2E3228;
          --cream:      #FAF8F3;
          --warm:       #F5F1E8;
          --muted:      #78786E;
          --light:      #ABABА0;
          --border:     #ECEAE3;
          --dark:       #161A14;
        }

        html {
          scroll-behavior: smooth;
          -webkit-text-size-adjust: 100%;
        }

        body {
          font-family: 'Jost', sans-serif;
          background: var(--cream);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
          overscroll-behavior-y: none;
        }

        /* Warm parchment grain overlay */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9997;
          opacity: 0.032;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E");
        }

        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans  { font-family: 'Jost', sans-serif; }

        ::selection { background: var(--sage-l); color: var(--charcoal); }

        /* ── Scrollbar ── */
        @media (max-width: 768px) {
          ::-webkit-scrollbar { display: none; }
          body { scrollbar-width: none; }
        }

        /* ── Floating Leaves ── */
        @keyframes leaf-fall {
          0%   { transform: translateY(-80px) translateX(0)   rotate(0deg);   opacity: 0; }
          6%   { opacity: 0.5; }
          50%  { transform: translateY(50vh)  translateX(20px) rotate(200deg); opacity: 0.3; }
          94%  { opacity: 0.2; }
          100% { transform: translateY(108vh) translateX(-10px) rotate(440deg); opacity: 0; }
        }
        .leaf {
          position: fixed; top: -80px; pointer-events: none; z-index: 2;
          animation: leaf-fall linear infinite;
          will-change: transform;
        }

        /* ── Shimmer on photo load ── */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .shimmer {
          background: linear-gradient(105deg,#EDE8DF 30%,#F5F0E8 50%,#EDE8DF 70%);
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        /* ── RSVP pulse ── */
        @keyframes attend-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(138,154,91,0.5); }
          60%      { box-shadow: 0 0 0 12px rgba(138,154,91,0); }
        }
        .attend-pulse { animation: attend-pulse 2.6s ease infinite; }

        /* ── Waveform on music play ── */
        @keyframes wave {
          0%,100% { transform: scaleY(0.4); }
          50%      { transform: scaleY(1.0); }
        }
        .bar { animation: wave 0.8s ease-in-out infinite; transform-origin: bottom; }
        .bar:nth-child(2) { animation-delay: 0.15s; }
        .bar:nth-child(3) { animation-delay: 0.3s; }
        .bar:nth-child(4) { animation-delay: 0.12s; }

        /* ── Input placeholder ── */
        input::placeholder, textarea::placeholder {
          color: #C8C2B8;
          font-style: italic;
          font-family: 'Playfair Display', Georgia, serif;
        }

        /* ── Cursor override ── */
        a, button { cursor: none !important; }
        @media (pointer: coarse) { a, button { cursor: pointer !important; } }

        /* ── Reduce motion ── */
        @media (prefers-reduced-motion: reduce) {
          .leaf, .bar, .attend-pulse { animation: none !important; }
        }
      `}</style>

      <main
        className="relative min-h-screen overflow-x-hidden cursor-none"
        style={{ background: "var(--cream)", paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
      >

        {/* ── FALLING LEAVES ─────────────────────────────────────────────── */}
        {[
          { l:"5%",  d:"0s",   t:"20s", s:16, r:12 },
          { l:"14%", d:"5.5s", t:"25s", s:11, r:8  },
          { l:"28%", d:"2.2s", t:"18s", s:19, r:14 },
          { l:"43%", d:"8s",   t:"22s", s:13, r:10 },
          { l:"59%", d:"1.4s", t:"17s", s:17, r:13 },
          { l:"72%", d:"6.8s", t:"21s", s:10, r:8  },
          { l:"85%", d:"3.6s", t:"19s", s:15, r:11 },
          { l:"93%", d:"10s",  t:"24s", s:9,  r:7  },
        ].map((p, i) => (
          <div key={i} className="leaf" style={{ left:p.l, animationDelay:p.d, animationDuration:p.t }}>
            <svg width={p.s} height={p.r} viewBox="0 0 20 14" fill="none">
              <path d="M10 1 C6 1 1 4 1 7 C1 10 6 13 10 13 C14 13 19 10 19 7 C19 4 14 1 10 1Z" fill="#C9D4A8" opacity="0.55"/>
              <line x1="10" y1="1" x2="10" y2="13" stroke="#A8BA78" strokeWidth="0.6" opacity="0.4"/>
            </svg>
          </div>
        ))}

        {/* ── CUSTOM CURSOR (desktop) ─────────────────────────────────────── */}
        {!isMobile && (
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            style={{ x: cx, y: cy }}
          >
            <motion.div
              animate={{ scale: hoverBtn ? 2.4 : 1, opacity: hoverBtn ? 0.5 : 0.85 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full"
              style={{ background: "var(--sage)", mixBlendMode: "multiply" }}
            />
          </motion.div>
        )}

        {/* ── PRE-LOADER ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              className="fixed inset-0 z-[9990] flex flex-col items-center justify-center"
              style={{ background: "var(--charcoal)" }}
              exit={{ clipPath: "inset(100% 0 0 0)", transition: { duration: 1.1, ease: [0.76,0,0.24,1], delay: 0.05 } }}
            >
              {/* Botanical ring decoration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.3, ease }}
                className="relative flex items-center justify-center mb-12"
              >
                {/* Rings */}
                {[100, 144, 192].map((sz, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{ width: sz, height: sz, border: `1px solid rgba(168,186,120,${0.2 - i*0.055})` }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
                  />
                ))}
                {/* Initials */}
                <div className="relative z-10 text-center">
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: "0.9em" }}
                    animate={{ opacity: 1, letterSpacing: "0.42em" }}
                    transition={{ duration: 1.6, delay: 0.4 }}
                    className="font-serif font-light"
                    style={{ fontSize: "clamp(2.8rem,10vw,4rem)", color: "white", letterSpacing: "0.42em" }}
                  >
                    R <span style={{ color: "var(--sage-m)" }}>&</span> J
                  </motion.p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.9 }}
                className="font-sans text-[9px] tracking-[0.6em] uppercase mb-12"
                style={{ color: "rgba(168,186,120,0.5)" }}
              >
                Memuat Undangan
              </motion.p>

              {/* Progress track */}
              <div className="w-56 h-[1px] relative" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: "var(--sage-m)", width: `${loadPct}%`, transition: "width 0.1s linear" }}
                />
              </div>
              <motion.p
                className="font-sans mt-3 tabular-nums"
                style={{ color: "rgba(168,186,120,0.3)", fontSize: "9px", letterSpacing: "0.1em" }}
              >
                {loadPct}%
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MUSIC BUTTON ────────────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.3, type: "spring", stiffness: 240, damping: 18 }}
          onClick={toggleAudio}
          {...hover}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="fixed top-4 right-4 z-[600] flex items-center gap-2.5 rounded-full px-4 py-2.5 border"
          style={{
            background: "rgba(250,248,243,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.8)",
            boxShadow: "0 2px 20px rgba(30,34,25,0.08)",
            color: isPlaying ? "var(--sage)" : "var(--muted)",
          }}
        >
          {isPlaying ? (
            /* Animated waveform */
            <div className="flex items-end gap-[2.5px] h-3.5 w-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bar flex-1 rounded-full" style={{ background: "var(--sage)", height: "100%" }} />
              ))}
            </div>
          ) : (
            <Music2 size={14} strokeWidth={1.8} />
          )}
          <span className="font-sans text-[10px] tracking-[0.22em] uppercase">
            {isPlaying ? "Pause" : "Musik"}
          </span>
        </motion.button>

        {/* ════════════════════════════════════════════════════════════════════
            §1  HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
          style={{ height: "100svh", minHeight: 660 }}
        >
          {/* Botanical background gradient */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 110% 80% at 50% 60%, #EBF0D8 0%, transparent 65%)",
          }} />

          {/* Decorative corner leaves — top left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={!loading ? { opacity: 0.18, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 1, duration: 1.8, ease }}
            className="absolute top-0 left-0 pointer-events-none select-none"
            style={{ fontSize: "9rem", lineHeight: 1, color: "var(--sage-l)", userSelect: "none", fontFamily: "serif" }}
            aria-hidden
          >
            ❧
          </motion.div>
          {/* Bottom right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
            animate={!loading ? { opacity: 0.18, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 1.2, duration: 1.8, ease }}
            className="absolute bottom-16 right-0 pointer-events-none select-none"
            style={{ fontSize: "9rem", lineHeight: 1, color: "var(--sage-l)", transform: "scaleX(-1) rotate(-15deg)", userSelect: "none", fontFamily: "serif" }}
            aria-hidden
          >
            ❧
          </motion.div>

          {/* Date pill */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="absolute flex justify-center w-full px-6"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 20px)" }}
          >
            <span className="font-sans text-[9px] tracking-[0.52em] uppercase px-5 py-2 rounded-full" style={{
              border: "1px solid #C9D4A8",
              color: "var(--sage)",
              background: "rgba(242,245,232,0.9)",
            }}>
              {C.dateFormal}
            </span>
          </motion.div>

          {/* Names */}
          <motion.div
            style={{ y: heroTY }}
            className="flex flex-col items-center z-10 w-full"
          >
            <motion.div
              initial="hidden"
              animate={!loading ? "visible" : "hidden"}
              variants={vStagger}
              className="flex flex-col items-center"
            >
              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.52em] uppercase mb-9" style={{ color: "#AAAMOA0" }}>
                Bersama keluarga, mengundang kehadiran Anda
              </motion.p>

              {/* Groom */}
              <motion.h1
                variants={vSlideLeft}
                className="font-serif font-light leading-none"
                style={{ fontSize: "clamp(3.8rem,19vw,9rem)", letterSpacing: "-0.025em", color: "var(--ink)" }}
              >
                {C.groom}
              </motion.h1>

              {/* Ampersand row */}
              <motion.div variants={vIn} className="flex items-center gap-4 my-2.5 w-full justify-center">
                <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(to right,transparent,var(--sage-l))" }} />
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="font-serif italic font-light select-none"
                  style={{ fontSize: "clamp(2.6rem,10vw,4.5rem)", color: "var(--sage)", lineHeight: 1 }}
                >
                  &
                </motion.span>
                <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(to left,transparent,var(--sage-l))" }} />
              </motion.div>

              {/* Bride */}
              <motion.h1
                variants={vSlideRight}
                className="font-serif font-light leading-none"
                style={{ fontSize: "clamp(3.8rem,19vw,9rem)", letterSpacing: "-0.025em", color: "var(--ink)" }}
              >
                {C.bride}
              </motion.h1>

              <motion.div variants={vIn} className="mt-9 mb-7 mx-auto flex justify-center">
                <Gem />
              </motion.div>

              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.42em] uppercase" style={{ color: "#B0AEA6" }}>
                Meminta kehadiran Anda dengan penuh kehormatan
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 4, duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-sans text-[8px] tracking-[0.5em] uppercase" style={{ color: "#C0BEB4" }}>Scroll</span>
            <ChevronDown size={15} strokeWidth={1.2} style={{ color: "#C0BEB4" }} />
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §2  QUOTE — warm off-white panel
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6" style={{ background: "var(--warm)" }}>
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={vFast}
            className="max-w-lg mx-auto flex flex-col items-center gap-6 text-center"
          >
            <motion.div variants={vIn} className="font-serif leading-none select-none" style={{
              fontSize: "6rem", lineHeight: 0.8, color: "var(--sage-l)", marginBottom: "-1rem",
            }}>
              "
            </motion.div>
            <motion.p variants={vUp} className="font-serif font-light italic leading-[1.85] text-lg md:text-xl" style={{ color: "#5A5850" }}>
              {C.quote}
            </motion.p>
            <motion.p variants={vUp} className="font-sans text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--sage)" }}>
              {C.quoteEn}
            </motion.p>
            <motion.div variants={vIn}><Gem /></motion.div>
            <motion.div variants={vUp} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <p className="font-serif text-lg font-light">{C.groomFull}</p>
              <span className="font-serif italic text-2xl" style={{ color: "var(--sage-l)" }}>&</span>
              <p className="font-serif text-lg font-light">{C.brideFull}</p>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §3  PHOTO GALLERY
        ════════════════════════════════════════════════════════════════════ */}
        <section ref={galleryRef} className="py-16 px-4 overflow-hidden" style={{ background: "var(--cream)" }}>
          <div className="max-w-2xl mx-auto">

            {/* Mobile: stack vertically. Desktop: side-by-side with parallax */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center md:items-end justify-center">

              {/* Photo 1 */}
              <motion.div
                style={{ y: p1Y }}
                className="w-full md:w-[52%] flex-shrink-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 1, ease }}
                  className="relative w-full rounded-3xl overflow-hidden shimmer"
                  style={{ height: "clamp(340px, 80vw, 580px)", boxShadow: "0 20px 60px rgba(30,34,25,0.12)" }}
                >
                  <Image
                    src={C.photo1} alt={`${C.groomFull} & ${C.brideFull}`}
                    fill sizes="(max-width:768px) 100vw, 52vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    priority
                  />
                  {/* Bottom vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none" style={{
                    background: "linear-gradient(to top, rgba(30,34,25,0.22), transparent)",
                  }} />
                  {/* Name label */}
                  <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-none">
                    <span className="font-serif italic text-white/80 text-sm tracking-wide">
                      {C.groom} & {C.bride}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Photo 2 */}
              <motion.div
                style={{ y: p2Y }}
                className="w-full md:w-[44%] flex-shrink-0 md:mt-24"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 1, delay: 0.15, ease }}
                  className="relative w-full rounded-3xl overflow-hidden"
                  style={{
                    height: "clamp(340px, 76vw, 520px)",
                    background: "#EDF1E4",
                    boxShadow: "0 20px 60px rgba(30,34,25,0.10)",
                  }}
                >
                  <Image
                    src={C.photo2} alt={`${C.groomFull} & ${C.brideFull}`}
                    fill sizes="(max-width:768px) 100vw, 44vw"
                    style={{ objectFit: "contain", objectPosition: "center center" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none" style={{
                    background: "linear-gradient(to top, rgba(30,34,25,0.08), transparent)",
                  }} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §4  DARK SAVE-THE-DATE PANEL
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative mx-4 md:mx-6 my-16 rounded-[2rem] overflow-hidden"
          style={{ background: "var(--charcoal)" }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 85% 65% at 50% 50%, rgba(168,186,120,0.10) 0%, transparent 68%)",
          }} />
          {/* Bottom botanical */}
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden opacity-10" style={{
            background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='80'%3E%3Cellipse cx='50' cy='80' rx='40' ry='60' fill='%23A8BA78'/%3E%3Cellipse cx='150' cy='85' rx='30' ry='50' fill='%23A8BA78'/%3E%3Cellipse cx='250' cy='80' rx='35' ry='55' fill='%23A8BA78'/%3E%3Cellipse cx='360' cy='82' rx='38' ry='58' fill='%23A8BA78'/%3E%3C/svg%3E\") repeat-x bottom",
          }} />

          <div className="relative z-10 py-20 px-6 text-center max-w-lg mx-auto">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              variants={vFast}
              className="flex flex-col items-center gap-5"
            >
              <motion.div variants={vIn}><Gem light size="sm" /></motion.div>
              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.55em] uppercase" style={{ color: "rgba(168,186,120,0.45)" }}>
                Simpan Tanggal Ini
              </motion.p>
              <motion.h2 variants={vUp} className="font-serif font-light text-white" style={{ fontSize: "clamp(1.8rem,6vw,3.2rem)", letterSpacing: "-0.01em" }}>
                {C.date}
              </motion.h2>
              <motion.p variants={vUp} className="font-serif italic" style={{ color: "rgba(201,212,168,0.6)", fontSize: "1.15rem" }}>
                {C.timeEn}
              </motion.p>
              <motion.p variants={vUp} className="font-sans text-sm" style={{ color: "rgba(168,186,120,0.5)" }}>
                {C.venue}
              </motion.p>
              <motion.div variants={vIn}><Gem light size="sm" /></motion.div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §5  EVENT DETAILS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Acara Pernikahan" /></motion.div>
            <motion.h2 variants={vUp} className="font-serif text-4xl md:text-5xl font-light" style={{ color: "var(--ink)" }}>
              Detail Acara
            </motion.h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            {/* Date */}
            <Card>
              <div className="p-8 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--sage-p)" }}>
                  <Calendar size={20} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color: "var(--light)" }}>Hari & Tanggal</p>
                  <p className="font-serif text-xl font-light">{C.date}</p>
                </div>
              </div>
            </Card>

            {/* Time */}
            <Card>
              <div className="p-8 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--sage-p)" }}>
                  <Clock size={20} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color: "var(--light)" }}>Waktu</p>
                  <p className="font-serif text-xl font-light">{C.time}</p>
                  <p className="font-sans text-xs mt-0.5 italic" style={{ color: "var(--muted)" }}>{C.timeEn}</p>
                </div>
              </div>
            </Card>

            {/* Venue */}
            <Card>
              <div className="p-8 flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--sage-p)" }}>
                    <MapPin size={20} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                  </div>
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color: "var(--light)" }}>Lokasi</p>
                    <p className="font-serif text-xl font-light">{C.venue}</p>
                    <p className="font-sans text-sm mt-0.5" style={{ color: "var(--muted)" }}>{C.address}</p>
                  </div>
                </div>
                <motion.a
                  href={C.mapsUrl} target="_blank" rel="noreferrer"
                  {...hover} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-400"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.cssText += ";background:var(--ink);color:white;border-color:var(--ink)"; }}
                  onMouseOut={e  => { (e.currentTarget as HTMLElement).style.cssText += ";background:transparent;color:var(--muted);border-color:var(--border)"; }}
                >
                  <MapPin size={12} strokeWidth={1.6} /> Buka di Maps
                </motion.a>
              </div>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §6  AMPLOP DIGITAL
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-lg mx-auto" style={{ background: "var(--cream)" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Amplop Digital" /></motion.div>
            <motion.h2 variants={vUp} className="font-serif text-4xl md:text-5xl font-light" style={{ color: "var(--ink)" }}>
              Hadiah Pernikahan
            </motion.h2>
          </motion.div>

          <Card>
            <div className="p-9 md:p-12 flex flex-col items-center gap-0">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color: "var(--muted)", maxWidth: "30ch", margin: "0 auto 2.5rem" }}>
                Kehadiran Anda adalah hadiah yang paling berarti. Namun jika Anda ingin memberikan restu, Anda dapat melakukannya di sini.
              </p>

              {/* QRIS */}
              <div
                className="relative rounded-2xl overflow-hidden mb-8"
                style={{
                  width: "clamp(180px, 55vw, 224px)",
                  height: "clamp(180px, 55vw, 224px)",
                  background: "white",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 32px rgba(30,34,25,0.07)",
                }}
              >
                <Image
                  src={C.qrisImg} alt="QRIS Payment"
                  fill style={{ objectFit: "contain", padding: "6px" }}
                />
              </div>

              {/* Bank info */}
              <div className="w-full text-center mb-7 py-6 rounded-2xl" style={{ background: "var(--sage-p)" }}>
                <p className="font-sans text-[9px] tracking-[0.44em] uppercase mb-2" style={{ color: "var(--sage)" }}>
                  {C.bankName}
                </p>
                <p className="font-serif text-2xl tracking-[0.06em]" style={{ color: "var(--ink)", letterSpacing: "0.08em" }}>
                  {C.bankAccount}
                </p>
                <p className="font-sans text-xs mt-1.5 italic" style={{ color: "var(--muted)" }}>
                  a.n. {C.accountHolder}
                </p>
              </div>

              {/* Copy */}
              <motion.button
                onClick={handleCopy} {...hover} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-400"
                style={{
                  borderColor: "var(--sage)",
                  color:       copied ? "white" : "var(--sage)",
                  background:  copied ? "var(--sage)" : "transparent",
                }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="y" initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-5 }} className="flex items-center gap-2">
                      <Check size={14} strokeWidth={2.2} /> Berhasil Disalin!
                    </motion.span>
                  ) : (
                    <motion.span key="n" initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-5 }} className="flex items-center gap-2">
                      <Copy size={14} strokeWidth={1.6} /> Salin Nomor Rekening
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </Card>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §7  UCAPAN & DOA (Guestbook)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-lg mx-auto" style={{ background: "var(--warm)" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Ucapan & Doa" /></motion.div>
            <motion.h2 variants={vUp} className="font-serif text-4xl md:text-5xl font-light" style={{ color: "var(--ink)" }}>
              Kirim Ucapan
            </motion.h2>
          </motion.div>

          <Card>
            <div className="p-9 md:p-12">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
                Kata-kata Anda adalah bunga yang mekar paling lama. Tuliskan ucapan Anda dan kami akan menerimanya dengan sepenuh hati.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-12 text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "var(--sage-p)" }}
                    >
                      <Sparkles size={24} strokeWidth={1.4} style={{ color: "var(--sage)" }} />
                    </motion.div>
                    <p className="font-serif text-2xl font-light">Terima Kasih! 🙏</p>
                    <p className="font-sans text-sm" style={{ color: "var(--muted)" }}>
                      Doa dan ucapan Anda telah terkirim. Kami sangat bersyukur.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleWish}
                    className="flex flex-col gap-8"
                  >
                    <Field id="f-name" label="Nama Anda" value={name} onChange={setName} placeholder="mis. Budi & Keluarga" />
                    <Field id="f-msg"  label="Ucapan & Doa" value={msg}  onChange={setMsg}  placeholder="Semoga selalu bahagia dan penuh berkah…" rows={4} />
                    <motion.button
                      type="submit" {...hover} whileTap={{ scale: 0.97 }}
                      className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 font-sans text-[10px] tracking-[0.34em] uppercase transition-colors duration-350"
                      style={{ background: "var(--ink)", color: "var(--cream)" }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--sage)"; }}
                      onMouseOut={e  => { (e.currentTarget as HTMLElement).style.background = "var(--ink)"; }}
                    >
                      <Send size={13} strokeWidth={1.6} />
                      Kirim via WhatsApp
                    </motion.button>
                    <p className="font-sans text-[9px] text-center" style={{ color: "#C0BEB4" }}>
                      Pesan akan langsung dikirim ke WhatsApp mempelai.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §8  CLOSING
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 text-center" style={{ background: "var(--cream)" }}>
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            variants={vFast}
            className="flex flex-col items-center gap-5 max-w-sm mx-auto"
          >
            <motion.div variants={vIn}><Gem /></motion.div>
            <motion.h2
              variants={vUp}
              className="font-serif font-light"
              style={{ fontSize: "clamp(2.8rem,13vw,5rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}
            >
              {C.groom}{" "}
              <span className="italic" style={{ color: "var(--sage)" }}>&</span>{" "}
              {C.bride}
            </motion.h2>
            <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.48em] uppercase" style={{ color: "var(--light)" }}>
              {C.dateFormal}
            </motion.p>
            <motion.div variants={vIn}><Gem /></motion.div>
            <motion.p variants={vUp} className="font-serif text-lg italic" style={{ color: "var(--muted)" }}>
              Dengan cinta & rasa syukur yang tak terhingga.
            </motion.p>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §9  STICKY RSVP BAR
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          transition={{ delay: 3.5, type: "spring", stiffness: 52, damping: 16 }}
          className="fixed bottom-0 inset-x-0 z-[9000]"
        >
          <div
            className="w-full border-t"
            style={{
              background: "rgba(250,248,243,0.88)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderColor: "rgba(236,234,227,0.95)",
              boxShadow: "0 -8px 36px rgba(30,34,25,0.06)",
            }}
          >
            <div
              className="max-w-md mx-auto flex gap-3 px-4 pt-3"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
            >
              {/* Confirm attend */}
              <motion.a
                href={`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(
                  `✨ *Konfirmasi Kehadiran*\n\nAssalamualaikum,\n\nSaya menyatakan *hadir* di pernikahan *${C.groomFull}* & *${C.brideFull}*.\n\n📅 ${C.date}\n🕌 ${C.venue}\n\nSalam hangat,`
                )}`}
                target="_blank" rel="noreferrer"
                {...hover} whileTap={{ scale: 0.97 }}
                className="attend-pulse flex-1 flex items-center justify-center gap-2 rounded-2xl py-[15px] font-sans text-[10px] tracking-[0.28em] uppercase"
                style={{ background: "var(--ink)", color: "var(--cream)" }}
              >
                <Heart size={11} fill="currentColor" strokeWidth={0} />
                Konfirmasi Hadir
              </motion.a>

              {/* Regrets */}
              <motion.a
                href={`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(
                  `Assalamualaikum,\n\nMohon maaf, saya tidak dapat hadir di pernikahan *${C.groomFull}* & *${C.brideFull}*.\n\nSemoga acara berjalan lancar dan penuh berkah. 🤲`
                )}`}
                target="_blank" rel="noreferrer"
                {...hover} whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 flex items-center justify-center rounded-2xl py-[15px] px-5 font-sans text-[10px] tracking-[0.28em] uppercase border transition-all duration-300"
                style={{ borderColor: "var(--border)", color: "var(--muted)", background: "transparent" }}
              >
                Tidak Hadir
              </motion.a>
            </div>
          </div>
        </motion.div>

      </main>
    </>
  );
}