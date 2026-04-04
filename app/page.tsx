"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║   LUXURY DIGITAL WEDDING INVITATION — app/page.tsx                  ║
 * ║   Award-grade · Mobile-first · Framer Motion · Next.js App Router   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * SETUP:
 *  1. npm install framer-motion lucide-react
 *  2. Place assets in /public:
 *       photo1.jpg, photo2.jpg  — couple photos
 *       qris.png                — QRIS barcode image
 *       wedding-song.mp3        — background audio
 *  3. Edit the CONFIG block below — that is the only file you ever touch.
 */

import {
  motion,
  Variants,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Music2,
  Pause,
  ChevronDown,
  Gift,
  Copy,
  Check,
  PenLine,
  Sparkles,
  Heart,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// ① CONFIGURATION — edit only this block
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  groom:         "Romeo",
  bride:         "Juliet",
  groomFull:     "Romeo Montague",
  brideFull:     "Juliet Capulet",
  date:          "Saturday, December 12th, 2026",
  dateFormal:    "12 · 12 · 2026",
  time:          "At four o'clock in the afternoon",
  venue:         "The Grand Botanic Gardens",
  address:       "123 Elegance Boulevard, Jakarta Selatan",
  mapsUrl:       "https://maps.google.com",
  whatsapp:      "6281234567890",
  bankName:      "BCA",
  bankAccount:   "1234567890",
  accountHolder: "Romeo Montague",
  audioSrc:      "/wedding-song.mp3",
  photo1:        "/photo1.jpeg",
  photo2:        "/photo2.jpeg",
  qrisImg:       "/qris.png",
  quote:
    "Two hearts that found in each other a home — " +
    "we are most grateful you are here to witness our beginning.",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ② FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const vFadeUp: Variants = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};
const vFadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.4, ease: "easeOut" } },
};
const vStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.5 } },
};
const vStaggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.10 } },
};
const vScale: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// ③ TINY REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function OrnamentDivider({ light = false }: { light?: boolean }) {
  const line = light ? "rgba(255,255,255,0.18)" : "#DDE8C4";
  const dot  = light ? "rgba(255,255,255,0.5)"  : "#8A9A5B";
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px flex-1 max-w-[80px]" style={{ background: line }} />
      <div className="w-1 h-1 rotate-45" style={{ background: dot }} />
      <div className="h-px w-3" style={{ background: line }} />
      <Heart size={9} fill={dot} style={{ color: dot }} />
      <div className="h-px w-3" style={{ background: line }} />
      <div className="w-1 h-1 rotate-45" style={{ background: dot }} />
      <div className="h-px flex-1 max-w-[80px]" style={{ background: line }} />
    </div>
  );
}

function SectionHead({
  icon: Icon,
  eyebrow,
  title,
  light = false,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  light?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={vStaggerFast}
      className="text-center mb-14"
    >
      <motion.div variants={vFadeIn} className="flex justify-center mb-5">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            border:     light ? "1px solid rgba(255,255,255,0.2)" : "1px solid #DDE8C4",
            background: light ? "rgba(255,255,255,0.08)"          : "#F4F8EC",
            color:      light ? "white"                           : "#8A9A5B",
          }}
        >
          <Icon size={18} strokeWidth={1.4} />
        </span>
      </motion.div>
      <motion.p
        variants={vFadeUp}
        className="font-sans text-[10px] tracking-[0.45em] uppercase mb-3"
        style={{ color: light ? "rgba(255,255,255,0.45)" : "#9A9A9A" }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={vFadeUp}
        className="font-serif text-4xl md:text-5xl font-light tracking-tight"
        style={{ color: light ? "white" : "#2C302E" }}
      >
        {title}
      </motion.h2>
      <motion.div variants={vFadeIn} className="mt-5">
        <OrnamentDivider light={light} />
      </motion.div>
    </motion.div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={vScale}
      className={`relative bg-white rounded-2xl overflow-hidden ${className}`}
      style={{
        boxShadow: "0 8px 40px rgba(44,48,46,0.07)",
        border:    "1px solid #F0EEE9",
      }}
    >
      <div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, #8A9A5B 40%, #8A9A5B 60%, transparent)",
        }}
      />
      {children}
    </motion.div>
  );
}

function Field({
  id, label, value, onChange, placeholder, multiline = false,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; placeholder: string; multiline?: boolean;
}) {
  const base: React.CSSProperties = {
    background:   "transparent",
    border:       "none",
    borderBottom: "1px solid #E8E4DE",
    borderRadius: 0,
    outline:      "none",
    width:        "100%",
    padding:      "4px 0 10px",
    fontFamily:   "'Cormorant Garamond', Georgia, serif",
    fontSize:     "1.125rem",
    color:        "#2C302E",
    resize:       "none" as const,
    display:      "block",
    transition:   "border-color 0.3s ease",
  };
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-sans text-[10px] tracking-[0.38em] uppercase"
        style={{ color: "#9A9A9A" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id} rows={4} required
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          className="placeholder-italic"
          onFocus={e  => { (e.target as HTMLTextAreaElement).style.borderBottomColor = "#8A9A5B"; }}
          onBlur={e   => { (e.target as HTMLTextAreaElement).style.borderBottomColor = "#E8E4DE"; }}
        />
      ) : (
        <input
          id={id} type="text" required
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={e  => { (e.target as HTMLInputElement).style.borderBottomColor = "#8A9A5B"; }}
          onBlur={e   => { (e.target as HTMLInputElement).style.borderBottomColor = "#E8E4DE"; }}
        />
      )}
    </div>
  );
}

function useParallax(progress: MotionValue<number>, range: [string, string]) {
  return useTransform(progress, [0, 1], range);
}

// ─────────────────────────────────────────────────────────────────────────────
// ④ MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function WeddingInvitation() {
  const [loading,   setLoading]   = useState(true);
  const [loadPct,   setLoadPct]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [hoverBtn,  setHoverBtn]  = useState(false);
  const [name,      setName]      = useState("");
  const [message,   setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  // Custom cursor springs
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const cx = useSpring(mx, { stiffness: 600, damping: 36, mass: 0.3 });
  const cy = useSpring(my, { stiffness: 600, damping: 36, mass: 0.3 });

  // Scroll parallax
  const { scrollYProgress: heroSY }    = useScroll({ target: heroRef,    offset: ["start start", "end start"] });
  const { scrollYProgress: gallerySY } = useScroll({ target: galleryRef, offset: ["start end",   "end start"] });
  const heroY   = useParallax(heroSY,    ["0%", "22%"]);
  const photo1Y = useParallax(gallerySY, ["-6%", "6%"]);
  const photo2Y = useParallax(gallerySY, ["6%", "-6%"]);
  const photo1R = useTransform(gallerySY, [0, 1], ["-1.2deg", "1.2deg"]);
  const photo2R = useTransform(gallerySY, [0, 1], ["1.2deg", "-1.2deg"]);

  // Loader
  useEffect(() => {
    let t = 0;
    const iv = setInterval(() => {
      t += Math.random() * 22 + 8;
      setLoadPct(Math.min(Math.round(t), 100));
      if (t >= 100) clearInterval(iv);
    }, 110);
    const timer = setTimeout(() => setLoading(false), 2750);
    return () => { clearInterval(iv); clearTimeout(timer); };
  }, []);

  // Mouse cursor
  useEffect(() => {
    const fn = (e: MouseEvent) => { mx.set(e.clientX - 10); my.set(e.clientY - 10); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [mx, my]);

  // Audio
  useEffect(() => {
    audioRef.current = new Audio(CONFIG.audioSrc);
    audioRef.current.loop   = true;
    audioRef.current.volume = 0.35;
    return () => { audioRef.current?.pause(); };
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setIsPlaying(p => !p);
  }, [isPlaying]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(CONFIG.bankAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }, []);

  const handleWish = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const txt =
      `✨ *A Blessing for ${CONFIG.groom} & ${CONFIG.bride}* ✨\n\n` +
      `*From:* ${name}\n\n*Message:*\n_${message}_\n\n` +
      `— via R & J Digital Invitation · ${CONFIG.dateFormal}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`, "_blank");
    setSubmitted(true);
    setName(""); setMessage("");
    setTimeout(() => setSubmitted(false), 4200);
  }, [name, message]);

  const over = () => setHoverBtn(true);
  const out  = () => setHoverBtn(false);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        :root {
          --sage:       #8A9A5B;
          --sage-mid:   #A4B475;
          --sage-light: #C9D4A8;
          --sage-pale:  #F4F8EC;
          --charcoal:   #2C302E;
          --cream:      #FAF9F6;
          --muted:      #7A7A7A;
          --lighter:    #A8A8A8;
          --border:     #EEEBE5;
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--charcoal);
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
        }

        /* Parchment grain */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-sans  { font-family: 'DM Sans', sans-serif; }

        ::selection { background: var(--sage-light); color: var(--charcoal); }

        /* Hide scrollbar on mobile */
        @media (max-width: 768px) {
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        }

        /* Photo placeholder shimmer */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .photo-placeholder {
          background: linear-gradient(100deg, #E8E4DE 25%, #F0ECE6 50%, #E8E4DE 75%);
          background-size: 200% 100%;
          animation: shimmer 2.4s infinite ease-in-out;
        }

        /* Floating petals */
        @keyframes petal-drift {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.4; }
          92%  { opacity: 0.2; }
          100% { transform: translateY(110vh) rotate(600deg); opacity: 0; }
        }
        .petal {
          position: fixed;
          pointer-events: none;
          z-index: 1;
          animation: petal-drift linear infinite;
          will-change: transform, opacity;
        }

        /* RSVP pulse ring */
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(138,154,91,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(138,154,91,0);   }
          100% { box-shadow: 0 0 0 0   rgba(138,154,91,0);    }
        }
        .pulse-attend { animation: pulse-ring 2.4s cubic-bezier(0.215,0.61,0.355,1) infinite; }

        /* Input placeholder style */
        input::placeholder, textarea::placeholder {
          color: #C4BEB6;
          font-style: italic;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        /* Cursor override */
        a, button { cursor: none !important; }
        @media (pointer: coarse) { a, button { cursor: pointer !important; } }
      `}</style>

      <main
        className="relative min-h-screen overflow-x-hidden cursor-none"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >

        {/* ── PETALS ──────────────────────────────────────────────────── */}
        {([
          { left: "6%",  delay: "0s",    dur: "18s", s: 14 },
          { left: "18%", delay: "4.8s",  dur: "22s", s: 10 },
          { left: "35%", delay: "1.6s",  dur: "16s", s: 17 },
          { left: "56%", delay: "7.2s",  dur: "21s", s: 12 },
          { left: "70%", delay: "3.1s",  dur: "17s", s: 15 },
          { left: "84%", delay: "9.8s",  dur: "19s", s: 11 },
          { left: "93%", delay: "2.4s",  dur: "24s", s: 9  },
        ] as const).map((p, i) => (
          <div
            key={i}
            className="petal"
            style={{ left: p.left, top: "-50px", animationDelay: p.delay, animationDuration: p.dur }}
          >
            <svg width={p.s} height={p.s} viewBox="0 0 20 28" fill="none">
              <ellipse cx="10" cy="14" rx="6" ry="11" fill="#C9D4A8" opacity="0.65" />
            </svg>
          </div>
        ))}

        {/* ── CUSTOM CURSOR (desktop) ──────────────────────────────────── */}
        <motion.div
          className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
          style={{ x: cx, y: cy }}
        >
          <motion.div
            animate={{ scale: hoverBtn ? 2.2 : 1, opacity: hoverBtn ? 0.55 : 0.88 }}
            transition={{ type: "spring", stiffness: 480, damping: 28 }}
            className="w-5 h-5 rounded-full"
            style={{ background: "var(--sage)", mixBlendMode: "multiply" }}
          />
        </motion.div>

        {/* ── PRE-LOADER ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              className="fixed inset-0 z-[9990] flex flex-col items-center justify-center select-none"
              style={{ background: "#181D16" }}
              exit={{
                clipPath: "inset(100% 0 0 0)",
                transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
              }}
            >
              {/* Concentric rings */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center mb-10"
              >
                {[128, 168, 212].map((sz, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width:  sz, height: sz,
                      border: `1px solid rgba(138,154,91,${0.18 - i * 0.05})`,
                    }}
                  />
                ))}
                <div className="text-center relative z-10">
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: "1em" }}
                    animate={{ opacity: 1, letterSpacing: "0.44em" }}
                    transition={{ duration: 1.6, delay: 0.3 }}
                    className="font-serif text-6xl font-light text-white"
                  >
                    R <span style={{ color: "var(--sage)" }}>&</span> J
                  </motion.p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="font-sans text-[10px] tracking-[0.55em] uppercase mb-12"
                style={{ color: "#525A4A" }}
              >
                A Celebration of Love
              </motion.p>

              {/* Progress bar */}
              <div className="relative w-52 h-px overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: "var(--sage)", width: `${loadPct}%` }}
                />
              </div>
              <p className="font-sans text-[9px] mt-3" style={{ color: "#3A4234" }}>
                {loadPct}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MUSIC TOGGLE ─────────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.7, type: "spring", stiffness: 220 }}
          onClick={toggleAudio}
          onMouseEnter={over} onMouseLeave={out}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="fixed top-4 right-4 z-[500] flex items-center gap-2 rounded-full px-4 py-2.5 border transition-colors duration-300"
          style={{
            background:    "rgba(250,249,246,0.6)",
            backdropFilter:"blur(24px)",
            WebkitBackdropFilter:"blur(24px)",
            borderColor:   "rgba(255,255,255,0.75)",
            boxShadow:     "0 2px 16px rgba(44,48,46,0.07)",
            color:         isPlaying ? "var(--sage)" : "#6A6A6A",
          }}
        >
          <motion.span
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            {isPlaying ? <Pause size={14} strokeWidth={1.8} /> : <Music2 size={14} strokeWidth={1.8} />}
          </motion.span>
          <span className="font-sans text-[10px] tracking-[0.22em] uppercase">
            {isPlaying ? "Pause" : "Music"}
          </span>
        </motion.button>

        {/* ═══════════════════════════════════════════════════════════════
            §1  HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
          style={{ height: "100svh", minHeight: "640px" }}
        >
          {/* Soft radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 90% 70% at 50% 58%, #EFF5E1 0%, transparent 68%)" }}
          />

          {/* Date pill — top */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65, duration: 0.85 }}
            className="absolute top-[env(safe-area-inset-top,0)] mt-6 flex justify-center w-full px-6"
          >
            <span
              className="font-sans text-[10px] tracking-[0.48em] uppercase px-5 py-2 rounded-full border"
              style={{
                borderColor: "var(--sage-light)",
                color:       "var(--sage)",
                background:  "rgba(244,248,236,0.9)",
              }}
            >
              {CONFIG.dateFormal}
            </span>
          </motion.div>

          {/* Names */}
          <motion.div
            style={{ y: heroY }}
            className="flex flex-col items-center z-10 w-full max-w-sm mx-auto"
          >
            <motion.div
              initial="hidden"
              animate={!loading ? "visible" : "hidden"}
              variants={vStagger}
              className="flex flex-col items-center w-full"
            >
              <motion.p
                variants={vFadeUp}
                className="font-sans text-[10px] tracking-[0.46em] uppercase mb-8"
                style={{ color: "#B0B0A8" }}
              >
                Together with their families
              </motion.p>

              <motion.h1
                variants={vFadeUp}
                className="font-serif font-light leading-none"
                style={{ fontSize: "clamp(3.6rem, 18vw, 8.5rem)", letterSpacing: "-0.02em" }}
              >
                {CONFIG.groom}
              </motion.h1>

              <motion.div
                variants={vFadeIn}
                className="flex items-center gap-4 my-3 w-full justify-center"
              >
                <div className="h-px flex-1 max-w-[90px]" style={{ background: "linear-gradient(to right, transparent, #C9D4A8)" }} />
                <span className="font-serif italic font-light select-none" style={{ fontSize: "clamp(2.4rem, 9vw, 4rem)", color: "var(--sage)" }}>
                  &
                </span>
                <div className="h-px flex-1 max-w-[90px]" style={{ background: "linear-gradient(to left, transparent, #C9D4A8)" }} />
              </motion.div>

              <motion.h1
                variants={vFadeUp}
                className="font-serif font-light leading-none"
                style={{ fontSize: "clamp(3.6rem, 18vw, 8.5rem)", letterSpacing: "-0.02em" }}
              >
                {CONFIG.bride}
              </motion.h1>

              <motion.div variants={vFadeIn} className="mt-8 mb-7 w-48 mx-auto">
                <OrnamentDivider />
              </motion.div>

              <motion.p
                variants={vFadeUp}
                className="font-sans text-[10px] tracking-[0.38em] uppercase"
                style={{ color: "#B0B0A8" }}
              >
                Request the honour of your presence
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 flex flex-col items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 3.9, duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-sans text-[9px] tracking-[0.44em] uppercase" style={{ color: "#C0C0B8" }}>
              Scroll
            </span>
            <ChevronDown size={16} strokeWidth={1.2} style={{ color: "#C0C0B8" }} />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §2  OPENING QUOTE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 max-w-xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={vStaggerFast}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              variants={vFadeIn}
              className="font-serif leading-none select-none"
              style={{ fontSize: "5.5rem", lineHeight: 1, color: "#DDE8C4", marginBottom: "-1.2rem" }}
            >
              "
            </motion.div>
            <motion.p
              variants={vFadeUp}
              className="font-serif text-xl md:text-2xl font-light italic leading-[1.9]"
              style={{ color: "#5A5A5A" }}
            >
              {CONFIG.quote}
            </motion.p>
            <motion.div variants={vFadeIn} className="w-full"><OrnamentDivider /></motion.div>
            <motion.div
              variants={vFadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6"
            >
              <p className="font-serif text-lg font-light">{CONFIG.groomFull}</p>
              <span className="font-serif italic text-2xl" style={{ color: "#C9D4A8" }}>&</span>
              <p className="font-serif text-lg font-light">{CONFIG.brideFull}</p>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §3  PARALLAX GALLERY
        ═══════════════════════════════════════════════════════════════ */}
        <section ref={galleryRef} className="py-20 px-4 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end justify-center">

              {/* Photo 1 — tall */}
              <motion.div
                style={{ y: photo1Y, rotate: photo1R }}
                className="w-full md:w-[48%] flex-shrink-0"
              >
                <div
                  className="w-full rounded-2xl overflow-hidden relative"
                  style={{
                    height:    "clamp(320px, 74vw, 620px)",
                    boxShadow: "0 24px 64px rgba(44,48,46,0.10)",
                  }}
                >
                  <Image src={CONFIG.photo1} alt="Couple photo one" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 48vw" priority />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(44,48,46,0.10), transparent)" }} />
                </div>
              </motion.div>

              {/* Photo 2 — shorter, offset */}
              <motion.div
                style={{ y: photo2Y, rotate: photo2R }}
                className="w-full md:w-[42%] flex-shrink-0 md:mb-0 md:mt-28"
              >
                <div
                  className="w-full rounded-2xl overflow-hidden relative"
                  style={{
                    height:     "clamp(320px, 72vw, 560px)",
                    boxShadow:  "0 24px 64px rgba(44,48,46,0.10)",
                    background: "#F4F8EC",
                  }}
                >
                  <Image src={CONFIG.photo2} alt="Couple photo two" fill style={{ objectFit: "contain", objectPosition: "center center", background: "#F4F8EC" }} sizes="(max-width: 768px) 100vw, 42vw" />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(44,48,46,0.06), transparent)" }} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §4  DARK INTERLUDE — SAVE THE DATE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="my-20 mx-4 md:mx-8 rounded-3xl overflow-hidden relative" style={{ background: "#1E2219" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(138,154,91,0.11) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 py-20 px-6 text-center max-w-xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={vStaggerFast}
              className="flex flex-col items-center gap-5"
            >
              <motion.div variants={vFadeIn}><OrnamentDivider light /></motion.div>
              <motion.p
                variants={vFadeUp}
                className="font-sans text-[10px] tracking-[0.46em] uppercase"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                Save the Date
              </motion.p>
              <motion.h2
                variants={vFadeUp}
                className="font-serif text-3xl md:text-5xl font-light text-white"
                style={{ letterSpacing: "-0.01em" }}
              >
                {CONFIG.date}
              </motion.h2>
              <motion.p
                variants={vFadeUp}
                className="font-serif text-xl italic"
                style={{ color: "rgba(201,212,168,0.65)" }}
              >
                {CONFIG.time}
              </motion.p>
              <motion.div variants={vFadeIn}><OrnamentDivider light /></motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §5  EVENT DETAILS
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-xl mx-auto">
          <SectionHead icon={Calendar} eyebrow="The Ceremony" title="Event Details" />

          <div className="flex flex-col gap-5">
            {/* Date */}
            <Card>
              <div className="p-9 text-center flex flex-col items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--sage-pale)" }}>
                  <Calendar size={18} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <p className="font-sans text-[10px] tracking-[0.42em] uppercase" style={{ color: "var(--lighter)" }}>Date</p>
                <p className="font-serif text-2xl md:text-3xl font-light">{CONFIG.date}</p>
              </div>
            </Card>

            {/* Time */}
            <Card>
              <div className="p-9 text-center flex flex-col items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--sage-pale)" }}>
                  <Clock size={18} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <p className="font-sans text-[10px] tracking-[0.42em] uppercase" style={{ color: "var(--lighter)" }}>Time</p>
                <p className="font-serif text-2xl md:text-3xl font-light italic">{CONFIG.time}</p>
              </div>
            </Card>

            {/* Venue */}
            <Card>
              <div className="p-9 text-center flex flex-col items-center gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "var(--sage-pale)" }}>
                  <MapPin size={18} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <p className="font-sans text-[10px] tracking-[0.42em] uppercase" style={{ color: "var(--lighter)" }}>Venue</p>
                <p className="font-serif text-2xl md:text-3xl font-light">{CONFIG.venue}</p>
                <p className="font-sans text-sm" style={{ color: "var(--muted)" }}>{CONFIG.address}</p>
                <motion.a
                  href={CONFIG.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={over} onMouseLeave={out}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 inline-flex items-center gap-2 rounded-full px-7 py-3 font-sans text-[10px] tracking-[0.3em] uppercase transition-all duration-400 border"
                  style={{ borderColor: "var(--charcoal)", color: "var(--charcoal)" }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--charcoal)";
                    (e.currentTarget as HTMLElement).style.color = "var(--cream)";
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--charcoal)";
                  }}
                >
                  <MapPin size={12} strokeWidth={1.6} />
                  Open in Maps
                </motion.a>
              </div>
            </Card>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §6  AMPLOP DIGITAL
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-xl mx-auto">
          <SectionHead icon={Gift} eyebrow="Amplop Digital" title="Wedding Gift" />

          <Card>
            <div className="p-9 md:p-12 flex flex-col items-center">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
                Your presence is the most precious gift of all. Should you wish to extend a blessing, you may do so here.
              </p>

              {/* QRIS — live image */}
              <div
                className="w-52 h-52 rounded-2xl border mb-8 overflow-hidden relative"
                style={{ borderColor: "var(--border)", background: "white" }}
              >
                <Image
                  src={CONFIG.qrisImg}
                  alt="QRIS Payment"
                  fill
                  style={{ objectFit: "contain", padding: "8px" }}
                />
              </div>

              {/* Bank info */}
              <div className="w-full text-center mb-6">
                <p className="font-sans text-[10px] tracking-[0.42em] uppercase mb-1.5" style={{ color: "var(--lighter)" }}>
                  {CONFIG.bankName}
                </p>
                <p className="font-serif text-3xl tracking-[0.07em] my-1" style={{ color: "var(--charcoal)" }}>
                  {CONFIG.bankAccount}
                </p>
                <p className="font-sans text-sm italic" style={{ color: "var(--muted)" }}>
                  a.n. {CONFIG.accountHolder}
                </p>
              </div>

              {/* Copy button */}
              <motion.button
                onClick={handleCopy}
                onMouseEnter={over} onMouseLeave={out}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl py-4 font-sans text-[10px] tracking-[0.32em] uppercase border transition-all duration-450"
                style={{
                  borderColor: "var(--sage)",
                  color:       copied ? "white"        : "var(--sage)",
                  background:  copied ? "var(--sage)"  : "transparent",
                }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                      <Check size={14} strokeWidth={2.2} /> Copied to Clipboard
                    </motion.span>
                  ) : (
                    <motion.span key="cp" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                      <Copy size={14} strokeWidth={1.6} /> Copy Account Number
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §7  GUESTBOOK
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-xl mx-auto">
          <SectionHead icon={PenLine} eyebrow="Leave a Blessing" title="Send a Wish" />

          <Card>
            <div className="p-9 md:p-12">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
                Your words are the flowers that bloom longest. Write us a note and it will go straight to our hearts.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-10 text-center"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--sage-pale)" }}>
                      <Sparkles size={22} strokeWidth={1.4} style={{ color: "var(--sage)" }} />
                    </div>
                    <p className="font-serif text-2xl font-light">Thank you!</p>
                    <p className="font-sans text-sm" style={{ color: "var(--muted)" }}>
                      Your wish has been sent. We are truly grateful.
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
                    <Field
                      id="w-name" label="Your Name"
                      value={name} onChange={setName}
                      placeholder="e.g. John & Family"
                    />
                    <Field
                      id="w-msg"  label="Your Message"
                      value={message} onChange={setMessage}
                      placeholder="Wishing you a lifetime of joy and love…"
                      multiline
                    />
                    <motion.button
                      type="submit"
                      onMouseEnter={over} onMouseLeave={out}
                      whileTap={{ scale: 0.98 }}
                      className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-xl py-4 font-sans text-[10px] tracking-[0.34em] uppercase transition-all duration-350"
                      style={{ background: "var(--charcoal)", color: "var(--cream)" }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--sage)"; }}
                      onMouseOut={e  => { (e.currentTarget as HTMLElement).style.background = "var(--charcoal)"; }}
                    >
                      <Send size={13} strokeWidth={1.6} />
                      Send via WhatsApp
                    </motion.button>
                    <p className="font-sans text-[10px] text-center" style={{ color: "var(--lighter)" }}>
                      Opens WhatsApp with your message pre-filled.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §8  CLOSING
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={vStaggerFast}
            className="flex flex-col items-center gap-5 max-w-sm mx-auto"
          >
            <motion.div variants={vFadeIn} className="w-full"><OrnamentDivider /></motion.div>
            <motion.h2
              variants={vFadeUp}
              className="font-serif font-light"
              style={{ fontSize: "clamp(2.6rem, 13vw, 4.8rem)", letterSpacing: "-0.02em" }}
            >
              {CONFIG.groom}{" "}
              <span className="italic" style={{ color: "var(--sage)" }}>&</span>{" "}
              {CONFIG.bride}
            </motion.h2>
            <motion.p
              variants={vFadeUp}
              className="font-sans text-[10px] tracking-[0.46em] uppercase"
              style={{ color: "var(--lighter)" }}
            >
              {CONFIG.dateFormal}
            </motion.p>
            <motion.div variants={vFadeIn} className="w-full"><OrnamentDivider /></motion.div>
            <motion.p
              variants={vFadeUp}
              className="font-serif text-lg italic"
              style={{ color: "#8A8A8A" }}
            >
              With love &amp; boundless gratitude.
            </motion.p>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            §9  STICKY RSVP BAR — MOBILE-FIRST
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.9, type: "spring", stiffness: 50, damping: 15 }}
          className="fixed bottom-0 inset-x-0 z-[9000]"
        >
          <div
            className="w-full border-t"
            style={{
              background:           "rgba(250,249,246,0.84)",
              backdropFilter:       "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderColor:          "rgba(238,235,229,0.95)",
              boxShadow:            "0 -8px 32px rgba(44,48,46,0.05)",
            }}
          >
            <div
              className="max-w-md mx-auto flex gap-3 items-center px-4 pt-3"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
            >
              {/* Attend */}
              <motion.a
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                  `✨ Warm greetings!\n\nI will joyfully attend the wedding of *${CONFIG.groomFull}* & *${CONFIG.brideFull}*.\n📅 ${CONFIG.date}\n\nSincerely, `
                )}`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={over} onMouseLeave={out}
                whileTap={{ scale: 0.97 }}
                className="pulse-attend flex-1 flex items-center justify-center gap-2 rounded-xl py-[14px] font-sans text-[10px] tracking-[0.3em] uppercase"
                style={{ background: "var(--charcoal)", color: "var(--cream)" }}
              >
                <Heart size={11} fill="currentColor" strokeWidth={0} />
                RSVP — Attend
              </motion.a>

              {/* Regrets */}
              <motion.a
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                  `With warm regards,\n\nI am unfortunately unable to attend the wedding of *${CONFIG.groomFull}* & *${CONFIG.brideFull}*.\n\nPlease accept my sincerest wishes for a beautiful celebration.`
                )}`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={over} onMouseLeave={out}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 flex items-center justify-center gap-2 rounded-xl py-[14px] px-5 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-300"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                Regrets
              </motion.a>
            </div>
          </div>
        </motion.div>

      </main>
    </>
  );
}