"use client";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  UNDANGAN DIGITAL — page.tsx                                             ║
 * ║  Botanical Luxury · ULTRA PREMIUM · Mobile-First                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * KEY UPGRADES:
 *  • Loading screen: Cream/parchment palette — warm & bold mandala
 *  • Music: Autoplay on load + unlock via AudioContext on first user touch
 *  • Mobile: safe-area-inset everywhere, touch-action tuned, no jank
 *  • Typography: Larger, bolder, more impactful hero text
 *  • Animations: Refined timing, GPU-only (transform/opacity)
 *  • Cards: Premium glass-morphism, richer shadows
 *  • RSVP bar: Polished with haptic-like spring animation
 */

import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring, useReducedMotion,
  type Variants, type MotionValue,
} from "framer-motion";
import {
  Calendar, Clock, MapPin, Music2,
  ChevronDown, Copy, Check,
  Sparkles, Heart, Send,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// ① CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  groom:         "Rian",
  bride:         "Windi",
  groomFull:     "Rian Pebriansyah, S.Psi",
  brideFull:     "Windi Nuraeni",
  date:          "Minggu, 22 November 2026",
  dateFormal:    "22 · 11 · 2026",
  day:           "Minggu",
  time:          "Pukul 08.00 WIB",
  timeEn:        "Pukul Delapan Pagi",
  venue:         "Rumah Mempelai Wanita",
  address:       "Kp. Jatimulya 2 RT/RW 001/003 No. 1, Kel. Mekarjati, Karawang Barat, Kab. Karawang",
  mapsUrl:       "https://www.google.com/maps/place/Pengajian+Nurul+aini/@-6.2601681,107.2912323,17z/data=!3m1!4b1!4m6!3m5!1s0x2e6979006df0af83:0x9963dbe4291b465f!8m2!3d-6.2601681!4d107.2938072!16s%2Fg%2F11vrlyj5d8?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
  whatsapp:      "62895369942679",
  bankName:      "Bank Mandiri",
  bankAccount:   "1730006953229",
  accountHolder: "Windi Nuraeni",
  bankName2:     "Bank Danamon",
  bankAccount2:  "003673736199",
  accountHolder2:"Rian Pebriansyah",
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
  hidden:  { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease } },
};
const vIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.4 } },
};
const vScale: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.1, ease } },
};
const vStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.6 } },
};
const vFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const vSlideLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease } },
};
const vSlideRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease } },
};

// ─────────────────────────────────────────────────────────────────────────────
// ③ PURE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Gem = memo(({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" }) => {
  const c = light ? "rgba(255,255,255,0.5)" : "#A8BA78";
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
      style={{ color: light ? "rgba(255,255,255,0.5)" : "#9A9A90" }}
    >
      {label}
    </span>
    <Gem light={light} />
  </div>
));
SectionBadge.displayName = "SectionBadge";

const Card = memo(({ children, className = "", dark = false }: {
  children: React.ReactNode; className?: string; dark?: boolean;
}) => (
  <motion.div
    initial="hidden" whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={vScale}
    className={`relative overflow-hidden rounded-3xl ${className}`}
    style={{
      background: dark ? "#1A1F18" : "var(--cream)",
      border:     dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid #EFEDE8",
      boxShadow:  dark
        ? "0 20px 60px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)"
        : "0 2px 4px rgba(44,48,46,0.03), 0 20px 48px rgba(44,48,46,0.07)",
    }}
  >
    <div className="absolute top-0 inset-x-0 h-[1.5px]" style={{
      background: dark
        ? "linear-gradient(90deg,transparent,rgba(168,186,120,0.5) 40%,rgba(168,186,120,0.5) 60%,transparent)"
        : "linear-gradient(90deg,transparent,#A8BA78 40%,#A8BA78 60%,transparent)",
    }} />
    {children}
  </motion.div>
));
Card.displayName = "Card";

const Field = memo(({ id, label, value, onChange, placeholder, rows }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; placeholder: string; rows?: number;
}) => {
  const [focused, setFocused] = useState(false);
  const shared: React.CSSProperties = {
    background: "transparent", border: "none", outline: "none",
    width: "100%", padding: "6px 0 12px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.15rem", color: "#2C302E", resize: "none" as const,
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

const MapsLink = memo(({ href }: { href: string }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-300"
      style={{
        borderColor: hov ? "var(--ink)" : "var(--border)",
        color:       hov ? "white"      : "var(--muted)",
        background:  hov ? "var(--ink)" : "transparent",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <MapPin size={12} strokeWidth={1.6} /> Buka di Google Maps
    </a>
  );
});
MapsLink.displayName = "MapsLink";

const SendButton = memo(() => {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 font-sans text-[10px] tracking-[0.34em] uppercase transition-all duration-300"
      style={{ background: hov ? "var(--sage)" : "var(--ink)", color: "var(--cream)" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Send size={13} strokeWidth={1.6} />
      Kirim via WhatsApp
    </button>
  );
});
SendButton.displayName = "SendButton";

const RSVPLink = memo(({ href, variant, children }: {
  href: string; variant: "primary" | "secondary"; children: React.ReactNode;
}) => {
  const [hov, setHov] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      className={[
        "flex items-center justify-center gap-2 rounded-2xl py-4 font-sans text-[10px] tracking-[0.28em] uppercase transition-all duration-300",
        isPrimary ? "attend-pulse flex-1" : "flex-shrink-0 border px-5",
      ].join(" ")}
      style={isPrimary ? {
        background: hov ? "var(--sage)" : "var(--ink)",
        color: "var(--cream)",
      } : {
        borderColor: hov ? "#d8d4cc"        : "var(--border)",
        background:  hov ? "#f5f2ed"        : "transparent",
        color: "var(--muted)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
});
RSVPLink.displayName = "RSVPLink";

// ─────────────────────────────────────────────────────────────────────────────
// ④ MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function WeddingInvitation() {
  const prefersReducedMotion = useReducedMotion();

  const [loading,   setLoading]   = useState(true);
  const [loadPct,   setLoadPct]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied,    setCopied]    = useState<"" | "1" | "2">("");
  const [hoverBtn,  setHoverBtn]  = useState(false);
  const [name,      setName]      = useState("");
  const [msg,       setMsg]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const unlocked   = useRef(false);

  // Custom cursor (desktop only)
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const cx = useSpring(mx, { stiffness: 520, damping: 34, mass: 0.35 });
  const cy = useSpring(my, { stiffness: 520, damping: 34, mass: 0.35 });

  // Parallax
  const { scrollYProgress: heroSY }    = useScroll({ target: heroRef,    offset: ["start start", "end start"] });
  const { scrollYProgress: gallerySY } = useScroll({ target: galleryRef, offset: ["start end",   "end start"] });
  const heroTY  = useParallax(heroSY,    isMobile || prefersReducedMotion ? ["0%","0%"] : ["0%","18%"]);
  const p1Y     = useParallax(gallerySY, isMobile || prefersReducedMotion ? ["0%","0%"] : ["-8%","8%"]);
  const p2Y     = useParallax(gallerySY, isMobile || prefersReducedMotion ? ["0%","0%"] : ["8%","-8%"]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── AUDIO: Create early, autoplay after load, unlock on first touch ──────
  useEffect(() => {
    const a = new Audio(C.audioSrc);
    a.loop = true;
    a.volume = 0.32;
    audioRef.current = a;

    // Unlock on first user interaction (mobile requires this)
    const unlock = () => {
      if (unlocked.current) return;
      unlocked.current = true;
      if (!isPlaying) {
        a.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("click",      unlock, { once: true });

    // Progress bar
    let t = 0;
    const iv = setInterval(() => {
      t += Math.random() * 18 + 10;
      setLoadPct(Math.min(Math.round(t), 100));
      if (t >= 100) clearInterval(iv);
    }, 90);

    // After loader
    const tm = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        a.play()
          .then(() => { setIsPlaying(true); unlocked.current = true; })
          .catch(() => {
            // Desktop may block; mobile unlock handler covers it
          });
      }, 700);
    }, 2800);

    return () => {
      clearInterval(iv);
      clearTimeout(tm);
      a.pause();
      a.src = "";
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click",      unlock);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const fn = (e: MouseEvent) => { mx.set(e.clientX - 10); my.set(e.clientY - 10); };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [isMobile, mx, my]);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleCopy = useCallback((which: "1" | "2") => {
    const val = which === "1" ? C.bankAccount : C.bankAccount2;
    navigator.clipboard.writeText(val.replace(/\s/g, ""));
    setCopied(which);
    setTimeout(() => setCopied(""), 2500);
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

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cormorant+SC:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

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
          --light:      #ABABA0;
          --border:     #ECEAE3;
          --dark:       #161A14;
          /* Cream loader palette */
          --gold-deep:  #8B6914;
          --gold-mid:   #B8922A;
          --gold-warm:  #D4A84B;
          --gold-pale:  #E8C878;
          --parch:      #F5EDD8;
          --parch-d:    #EDE0C4;
          --parch-dk:   #C8B484;
        }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
          overscroll-behavior-y: none;
        }
        body::after {
          content: '';
          position: fixed; inset: 0;
          pointer-events: none; z-index: 9997; opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E");
        }
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-sc    { font-family: 'Cormorant SC', Georgia, serif; }
        .font-sans  { font-family: 'DM Sans', sans-serif; }
        ::selection { background: var(--sage-l); color: var(--charcoal); }

        @media (max-width: 768px) {
          ::-webkit-scrollbar { display: none; }
          body { scrollbar-width: none; }
        }

        /* ── PETAL RAIN ── */
        @keyframes petal-a {
          0%   { transform: translateY(-90px) translateX(0)    rotate(0deg)   scale(1);    opacity: 0; }
          6%   { opacity: 0.7; }
          30%  { transform: translateY(28vh)  translateX(-18px) rotate(110deg) scale(0.95);}
          60%  { transform: translateY(58vh)  translateX(12px)  rotate(240deg) scale(1.02); opacity: 0.45;}
          92%  { opacity: 0.22; }
          100% { transform: translateY(112vh) translateX(-8px)  rotate(380deg) scale(0.9); opacity: 0;}
        }
        @keyframes petal-b {
          0%   { transform: translateY(-90px) translateX(0)    rotate(20deg) scale(0.9); opacity: 0; }
          8%   { opacity: 0.65; }
          35%  { transform: translateY(32vh)  translateX(22px)  rotate(150deg) scale(1.05);}
          65%  { transform: translateY(65vh)  translateX(-14px) rotate(280deg) scale(0.95); opacity: 0.4;}
          92%  { opacity: 0.2; }
          100% { transform: translateY(114vh) translateX(6px)   rotate(400deg) scale(0.85); opacity: 0;}
        }
        @keyframes petal-c {
          0%   { transform: translateY(-70px) rotate(0deg)   scale(0.8); opacity: 0; }
          9%   { opacity: 0.6; }
          50%  { transform: translateY(50vh)  rotate(300deg) scale(0.85); opacity: 0.36;}
          100% { transform: translateY(112vh) rotate(600deg) scale(0.75); opacity: 0;}
        }
        .petal   { position: fixed; top: -90px; pointer-events: none; z-index: 2; will-change: transform; }
        .petal-a { animation: petal-a ease-in-out infinite; }
        .petal-b { animation: petal-b ease-in-out infinite; }
        .petal-c { animation: petal-c linear       infinite; }

        /* ── SHIMMER ── */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .shimmer {
          background: linear-gradient(105deg,#F0EDE4 30%,#FAF8F3 50%,#F0EDE4 70%);
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        /* ── RSVP PULSE ── */
        @keyframes attend-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(138,154,91,0.55); }
          60%      { box-shadow: 0 0 0 14px rgba(138,154,91,0); }
        }
        .attend-pulse { animation: attend-pulse 2.8s ease infinite; }

        /* ── WAVEFORM ── */
        @keyframes wave {
          0%,100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1.0);  }
        }
        .bar { animation: wave 0.8s ease-in-out infinite; transform-origin: bottom; }
        .bar:nth-child(2) { animation-delay: 0.15s; }
        .bar:nth-child(3) { animation-delay: 0.30s; }
        .bar:nth-child(4) { animation-delay: 0.12s; }

        /* ── MANDALA RING GLOW ── */
        @keyframes ring-glow {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 0.90; }
        }
        .ring-glow { animation: ring-glow 3.5s ease-in-out infinite; }

        /* ── LOTUS BREATHE ── */
        @keyframes lotus-breathe {
          0%,100% { transform: scale(1)    rotate(0deg); }
          50%      { transform: scale(1.06) rotate(1deg); }
        }
        .lotus-breathe { animation: lotus-breathe 4.5s ease-in-out infinite; }

        /* ── PLACEHOLDER ── */
        input::placeholder, textarea::placeholder {
          color: #C8C2B8; font-style: italic;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        /* ── CURSOR ── */
        a, button { cursor: none !important; }
        @media (pointer: coarse) { a, button { cursor: pointer !important; } }

        @media (prefers-reduced-motion: reduce) {
          .petal, .bar, .attend-pulse, .ring-glow, .lotus-breathe { animation: none !important; opacity: 0.5 !important; }
        }
      `}</style>

      <main
        className="relative min-h-screen overflow-x-hidden"
        style={{ background: "var(--cream)", paddingBottom: "calc(90px + env(safe-area-inset-bottom))" }}
      >

        {/* ── PETAL RAIN ───────────────────────────────────────────────────── */}
        {([
          { l:"4%",  d:"0s",    t:"18s", type:"rose",   sz:18, col:"#EDE8DC", op:"0.72" },
          { l:"11%", d:"6.2s",  t:"23s", type:"rose",   sz:13, col:"#F5F0E6", op:"0.60" },
          { l:"22%", d:"2.8s",  t:"20s", type:"rose",   sz:20, col:"#E8E0D0", op:"0.65" },
          { l:"34%", d:"9.5s",  t:"26s", type:"rose",   sz:15, col:"#F0EBE0", op:"0.58" },
          { l:"44%", d:"1.1s",  t:"17s", type:"cherry", sz:22, col:"#F2ECE0", op:"0.68" },
          { l:"55%", d:"7.4s",  t:"22s", type:"cherry", sz:16, col:"#E9E2D4", op:"0.62" },
          { l:"64%", d:"3.9s",  t:"19s", type:"cherry", sz:24, col:"#F5F0E8", op:"0.70" },
          { l:"74%", d:"11.2s", t:"25s", type:"cherry", sz:14, col:"#ECE6D8", op:"0.55" },
          { l:"8%",  d:"4.5s",  t:"21s", type:"floret", sz:12, col:"#F8F4EC", op:"0.65" },
          { l:"18%", d:"13s",   t:"28s", type:"floret", sz:10, col:"#EDE7DB", op:"0.58" },
          { l:"48%", d:"5.1s",  t:"16s", type:"floret", sz:14, col:"#F2EDE3", op:"0.62" },
          { l:"80%", d:"0.8s",  t:"20s", type:"floret", sz:11, col:"#E8E2D6", op:"0.55" },
          { l:"88%", d:"8.8s",  t:"22s", type:"rose",   sz:17, col:"#F0EBE1", op:"0.63" },
          { l:"95%", d:"3.3s",  t:"19s", type:"rose",   sz:12, col:"#F6F1E8", op:"0.57" },
          { l:"29%", d:"15s",   t:"24s", type:"cherry", sz:19, col:"#EDE7DC", op:"0.60" },
          { l:"68%", d:"6.6s",  t:"17s", type:"floret", sz:13, col:"#F4EFE6", op:"0.64" },
        ] as const).map((p, i) => {
          const anim = i % 3 === 0 ? "petal-a" : i % 3 === 1 ? "petal-b" : "petal-c";
          return (
            <div key={i} className={`petal ${anim}`} style={{ left: p.l, animationDelay: p.d, animationDuration: p.t }}>
              {p.type === "rose" && (
                <svg width={p.sz} height={p.sz * 1.2} viewBox="0 0 24 28" fill="none">
                  <path d="M12 2 C8 2 3 7 3 13 C3 20 7 26 12 26 C17 26 21 20 21 13 C21 7 16 2 12 2Z"
                    fill={p.col} opacity={p.op} />
                  <path d="M12 5 C10 8 9 11 10 16 C10.5 19 11.5 22 12 24"
                    stroke={p.col} strokeWidth="0.5" opacity="0.3" fill="none"/>
                </svg>
              )}
              {p.type === "cherry" && (
                <svg width={p.sz} height={p.sz} viewBox="0 0 32 32" fill="none">
                  {[0,72,144,216,288].map(deg => (
                    <ellipse key={deg} cx="16" cy="7" rx="4.5" ry="7" fill={p.col} opacity={p.op}
                      transform={`rotate(${deg} 16 16)`} />
                  ))}
                  <circle cx="16" cy="16" r="2.5" fill={p.col} opacity="0.4" />
                </svg>
              )}
              {p.type === "floret" && (
                <svg width={p.sz} height={p.sz} viewBox="0 0 24 24" fill="none">
                  {[0,45,90,135,180,225,270,315].map(deg => (
                    <ellipse key={deg} cx="12" cy="5" rx="2.2" ry="4.5"
                      fill={p.col} opacity={p.op}
                      transform={`rotate(${deg} 12 12)`} />
                  ))}
                  <circle cx="12" cy="12" r="2" fill={p.col} opacity="0.5" />
                </svg>
              )}
            </div>
          );
        })}

        {/* ── CUSTOM CURSOR ─────────────────────────────────────────────────── */}
        {!isMobile && (
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            style={{ x: cx, y: cy }}
          >
            <motion.div
              animate={{ scale: hoverBtn ? 2.6 : 1, opacity: hoverBtn ? 0.45 : 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full"
              style={{ background: "var(--sage)", mixBlendMode: "multiply" }}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            PRE-LOADER — Cream Mandala (warm parchment palette)
        ════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              className="fixed inset-0 z-[9990] flex flex-col items-center justify-center overflow-hidden"
              style={{ background: "var(--parch)" }}
              exit={{ clipPath: "inset(100% 0 0 0)", transition: { duration: 1.2, ease: [0.76,0,0.24,1], delay: 0.05 } }}
            >
              {/* Parchment texture radial */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 80% 65% at 50% 48%, rgba(248,236,196,0.9) 0%, rgba(230,210,160,0.5) 50%, transparent 80%)",
              }} />
              {/* Warm vignette edges */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(180,148,84,0.22) 100%)",
              }} />

              {/* Top ornamental band */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.1 }}
                className="absolute top-0 inset-x-0 pointer-events-none"
              >
                <div className="h-[3px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold-mid) 25%, var(--gold-deep) 50%, var(--gold-mid) 75%, transparent)" }} />
                <div className="h-[1px] mt-1" style={{ background: "linear-gradient(90deg, transparent, var(--parch-dk) 30%, var(--parch-dk) 70%, transparent)", opacity: 0.5 }} />
              </motion.div>

              {/* Bottom ornamental band */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.1 }}
                className="absolute bottom-0 inset-x-0 pointer-events-none"
              >
                <div className="h-[1px] mb-1" style={{ background: "linear-gradient(90deg, transparent, var(--parch-dk) 30%, var(--parch-dk) 70%, transparent)", opacity: 0.5 }} />
                <div className="h-[3px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold-mid) 25%, var(--gold-deep) 50%, var(--gold-mid) 75%, transparent)" }} />
              </motion.div>

              {/* Corner ornaments */}
              {["top-3 left-3", "top-3 right-3 scale-x-[-1]", "bottom-3 left-3 scale-y-[-1]", "bottom-3 right-3 -scale-x-100 -scale-y-100"].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`absolute ${pos} pointer-events-none`}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M2 2 L18 2 M2 2 L2 18" stroke="var(--gold-mid)" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
                    <path d="M8 2 L8 8 L2 8" stroke="var(--gold-warm)" strokeWidth="0.8" opacity="0.4" fill="none"/>
                    <circle cx="2" cy="2" r="2" fill="var(--gold-mid)" opacity="0.5"/>
                  </svg>
                </motion.div>
              ))}

              {/* ── BIG MANDALA ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.7, ease: [0.16,1,0.3,1] }}
                className="relative flex items-center justify-center mb-7"
                style={{ width: "min(88vw, 340px)", height: "min(88vw, 340px)" }}
              >
                {/* Ring 1 — outermost, slow CW */}
                <motion.div
                  className="absolute inset-0 ring-glow"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 340 340" width="100%" height="100%">
                    {Array.from({length:20}).map((_,i) => (
                      <ellipse key={i} cx="170" cy="22" rx="7" ry="20"
                        fill="rgba(184,146,42,0.08)" stroke="var(--gold-mid)" strokeWidth="0.9" opacity="0.5"
                        transform={`rotate(${i*18} 170 170)`} />
                    ))}
                    {Array.from({length:40}).map((_,i) => (
                      <circle key={i}
                        cx={170 + 162*Math.cos((i*9-90)*Math.PI/180)}
                        cy={170 + 162*Math.sin((i*9-90)*Math.PI/180)}
                        r="1.8" fill="var(--gold-deep)" opacity="0.45" />
                    ))}
                    {/* Outer ring line */}
                    <circle cx="170" cy="170" r="160" stroke="var(--gold-mid)" strokeWidth="0.5"
                      strokeDasharray="3 5" opacity="0.3" fill="none" />
                  </svg>
                </motion.div>

                {/* Ring 2 — slow CCW */}
                <motion.div
                  className="absolute"
                  style={{ inset: "11%" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 260 260" width="100%" height="100%">
                    {Array.from({length:16}).map((_,i) => (
                      <ellipse key={i} cx="130" cy="16" rx="9" ry="24"
                        fill="rgba(184,146,42,0.10)" stroke="var(--gold-warm)" strokeWidth="0.8" opacity="0.6"
                        transform={`rotate(${i*22.5} 130 130)`} />
                    ))}
                    {Array.from({length:16}).map((_,i) => {
                      const a = (i*22.5 - 90)*Math.PI/180;
                      const x = 130 + 118*Math.cos(a), y = 130 + 118*Math.sin(a);
                      return <rect key={i} x={x-3.5} y={y-3.5} width="7" height="7"
                        fill="var(--gold-warm)" opacity="0.6"
                        transform={`rotate(45 ${x} ${y})`} />;
                    })}
                    <circle cx="130" cy="130" r="118" stroke="var(--gold-warm)" strokeWidth="0.6"
                      strokeDasharray="2 4" opacity="0.35" fill="none" />
                  </svg>
                </motion.div>

                {/* Ring 3 — medium CW */}
                <motion.div
                  className="absolute"
                  style={{ inset: "24%" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 192 192" width="100%" height="100%">
                    {Array.from({length:12}).map((_,i) => (
                      <ellipse key={i} cx="96" cy="14" rx="10" ry="26"
                        fill="rgba(139,105,20,0.13)" stroke="var(--gold-deep)" strokeWidth="1" opacity="0.65"
                        transform={`rotate(${i*30} 96 96)`} />
                    ))}
                    {Array.from({length:24}).map((_,i) => (
                      <circle key={i}
                        cx={96 + 84*Math.cos((i*15-90)*Math.PI/180)}
                        cy={96 + 84*Math.sin((i*15-90)*Math.PI/180)}
                        r="1.4" fill="var(--gold-deep)" opacity="0.5" />
                    ))}
                    <circle cx="96" cy="96" r="84" stroke="var(--gold-deep)" strokeWidth="0.6"
                      strokeDasharray="4 3" opacity="0.4" fill="none" />
                  </svg>
                </motion.div>

                {/* Ring 4 — inner, medium CCW */}
                <motion.div
                  className="absolute"
                  style={{ inset: "36%" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 132 132" width="100%" height="100%">
                    {Array.from({length:8}).map((_,i) => (
                      <ellipse key={i} cx="66" cy="12" rx="9" ry="22"
                        fill="rgba(184,146,42,0.18)" stroke="var(--gold-warm)" strokeWidth="1.1" opacity="0.7"
                        transform={`rotate(${i*45} 66 66)`} />
                    ))}
                    <circle cx="66" cy="66" r="54" fill="rgba(245,237,216,0.5)"
                      stroke="var(--gold-warm)" strokeWidth="0.8" opacity="0.5" />
                  </svg>
                </motion.div>

                {/* ── Centre: Lotus + Initials ── */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="lotus-breathe flex flex-col items-center">
                    {/* Lotus */}
                    <svg width="64" height="40" viewBox="0 0 64 40" fill="none" style={{ marginBottom: "4px" }}>
                      {/* Outer petals */}
                      <path d="M32 38 C25 28 12 22 4 26 C10 14 22 8 32 12 C42 8 54 14 60 26 C52 22 39 28 32 38Z"
                        fill="rgba(184,146,42,0.18)" stroke="var(--gold-mid)" strokeWidth="1.2"/>
                      {/* Middle petals */}
                      <path d="M32 36 C27 26 18 22 13 24 C18 14 26 10 32 13 C38 10 46 14 51 24 C46 22 37 26 32 36Z"
                        fill="rgba(184,146,42,0.26)" stroke="var(--gold-mid)" strokeWidth="1"/>
                      {/* Inner petals */}
                      <path d="M32 33 C29 25 24 22 21 23 C24 16 28 13 32 15 C36 13 40 16 43 23 C40 22 35 25 32 33Z"
                        fill="rgba(184,146,42,0.38)" stroke="var(--gold-warm)" strokeWidth="0.9"/>
                      {/* Centre */}
                      <path d="M32 31 C31 26 29 24 28 24.5 C30 20 31.5 18.5 32 19.5 C32.5 18.5 34 20 36 24.5 C35 24 33 26 32 31Z"
                        fill="rgba(139,105,20,0.5)" stroke="var(--gold-deep)" strokeWidth="0.7"/>
                      {/* Stem */}
                      <line x1="32" y1="31" x2="32" y2="39" stroke="var(--gold-mid)" strokeWidth="1" opacity="0.5"/>
                    </svg>

                    {/* Initials */}
                    <p
                      className="font-sc text-center"
                      style={{
                        fontSize: "clamp(2.6rem,10vw,3.8rem)",
                        color: "var(--gold-deep)",
                        letterSpacing: "0.28em",
                        lineHeight: 1,
                        fontWeight: 600,
                        textShadow: "0 2px 12px rgba(139,105,20,0.2)",
                      }}
                    >
                      {C.bride[0]}
                      <span style={{ color: "var(--gold-warm)", fontSize: "0.7em", fontWeight: 300 }}> ✦ </span>
                      {C.groom[0]}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Ornament divider ── */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.7, duration: 1.1, ease: [0.16,1,0.3,1] }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, var(--gold-mid))" }} />
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                  <path d="M12 1 L14 6 L12 11 L10 6 Z" fill="var(--gold-warm)" opacity="0.8"/>
                  <path d="M4 6 L8 4 L8 8 Z" fill="var(--gold-mid)" opacity="0.5"/>
                  <path d="M20 6 L16 4 L16 8 Z" fill="var(--gold-mid)" opacity="0.5"/>
                </svg>
                <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, var(--gold-mid))" }} />
              </motion.div>

              {/* ── Names bold ── */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="font-serif text-center mb-1"
                style={{
                  fontSize: "clamp(1.05rem,4.2vw,1.55rem)",
                  color: "var(--gold-deep)",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                }}
              >
                {C.brideFull} &amp; {C.groomFull}
              </motion.p>

              {/* ── Label ── */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.9 }}
                className="font-sans text-[9px] tracking-[0.58em] uppercase mb-8"
                style={{ color: "var(--parch-dk)", opacity: 0.6 }}
              >
                Memuat Undangan
              </motion.p>

              {/* ── Progress bar ── */}
              <div className="w-56 h-[2px] relative rounded-full overflow-hidden" style={{ background: "rgba(139,105,20,0.15)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--gold-deep), var(--gold-warm), var(--gold-pale))",
                    width: `${loadPct}%`,
                    transition: "width 0.1s linear",
                    boxShadow: "0 0 10px rgba(184,146,42,0.6)",
                  }}
                />
              </div>
              <p className="font-sans mt-2 tabular-nums"
                style={{ color: "var(--parch-dk)", fontSize: "9px", letterSpacing: "0.15em", opacity: 0.5 }}>
                {loadPct}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MUSIC BUTTON ─────────────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.3, type: "spring", stiffness: 240, damping: 18 }}
          onClick={toggleAudio}
          {...hover}
          aria-label={isPlaying ? "Pause" : "Play musik"}
          className="fixed top-4 right-4 z-[600] flex items-center gap-2.5 rounded-full px-4 py-2.5 border"
          style={{
            background: "rgba(250,248,243,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderColor: isPlaying ? "rgba(168,186,120,0.5)" : "rgba(255,255,255,0.9)",
            boxShadow: isPlaying
              ? "0 2px 20px rgba(138,154,91,0.15), 0 0 0 1px rgba(168,186,120,0.2)"
              : "0 2px 20px rgba(30,34,25,0.08)",
            color: isPlaying ? "var(--sage)" : "var(--muted)",
            transition: "all 0.3s ease",
          }}
        >
          {isPlaying ? (
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
          style={{ height: "100svh", minHeight: 680 }}
        >
          {/* Botanical bg */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 130% 90% at 50% 60%, #EBF0D8 0%, transparent 65%)",
          }} />

          {/* Corner floral — top left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={!loading ? { opacity: 0.16, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 1, duration: 2, ease }}
            className="absolute top-0 left-0 pointer-events-none select-none"
            style={{ fontSize: "10rem", lineHeight: 1, color: "var(--sage-l)", userSelect: "none", fontFamily: "serif" }}
            aria-hidden
          >❧</motion.div>

          {/* Corner floral — bottom right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
            animate={!loading ? { opacity: 0.16, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 1.2, duration: 2, ease }}
            className="absolute bottom-16 right-0 pointer-events-none select-none"
            style={{ fontSize: "10rem", lineHeight: 1, color: "var(--sage-l)", transform: "scaleX(-1) rotate(-15deg)", userSelect: "none", fontFamily: "serif" }}
            aria-hidden
          >❧</motion.div>

          {/* Date pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="absolute flex justify-center w-full px-6"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 20px)" }}
          >
            <span className="font-sans text-[9px] tracking-[0.5em] uppercase px-5 py-2 rounded-full" style={{
              border: "1px solid #C9D4A8",
              color: "var(--sage)",
              background: "rgba(242,245,232,0.92)",
              boxShadow: "0 2px 12px rgba(138,154,91,0.12)",
            }}>
              {C.dateFormal}
            </span>
          </motion.div>

          {/* Names block */}
          <motion.div style={{ y: heroTY }} className="flex flex-col items-center z-10 w-full">
            <motion.div
              initial="hidden"
              animate={!loading ? "visible" : "hidden"}
              variants={vStagger}
              className="flex flex-col items-center"
            >
              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.5em] uppercase mb-10" style={{ color: "#ABABA0" }}>
                Bersama keluarga, mengundang kehadiran Anda
              </motion.p>

              {/* GROOM — massive */}
              <motion.h1
                variants={vSlideLeft}
                className="font-serif font-light leading-none"
                style={{
                  fontSize: "clamp(4.4rem,22vw,10.5rem)",
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  lineHeight: 0.92,
                }}
              >
                {C.groom}
              </motion.h1>

              {/* Ampersand row */}
              <motion.div variants={vIn} className="flex items-center gap-4 my-3 w-full justify-center">
                <div className="h-px flex-1 max-w-[120px]" style={{ background: "linear-gradient(to right,transparent,var(--sage-l))" }} />
                <motion.span
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="font-serif italic font-light select-none"
                  style={{ fontSize: "clamp(3rem,12vw,5.5rem)", color: "var(--sage)", lineHeight: 1 }}
                >
                  &
                </motion.span>
                <div className="h-px flex-1 max-w-[120px]" style={{ background: "linear-gradient(to left,transparent,var(--sage-l))" }} />
              </motion.div>

              {/* BRIDE — massive */}
              <motion.h1
                variants={vSlideRight}
                className="font-serif font-light leading-none"
                style={{
                  fontSize: "clamp(4.4rem,22vw,10.5rem)",
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  lineHeight: 0.92,
                }}
              >
                {C.bride}
              </motion.h1>

              <motion.div variants={vIn} className="mt-10 mb-8 flex justify-center"><Gem /></motion.div>

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
            transition={{ delay: 4, duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-sans text-[8px] tracking-[0.5em] uppercase" style={{ color: "#C0BEB4" }}>Gulir</span>
            <ChevronDown size={15} strokeWidth={1.2} style={{ color: "#C0BEB4" }} />
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §2  QUOTE
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6" style={{ background: "var(--cream)" }}>
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={vFast}
            className="max-w-lg mx-auto flex flex-col items-center gap-6 text-center"
          >
            <motion.div variants={vIn} className="font-serif leading-none select-none" style={{
              fontSize: "7rem", lineHeight: 0.75, color: "var(--sage-l)", marginBottom: "-1.2rem",
            }}>
              "
            </motion.div>
            <motion.p variants={vUp} className="font-serif font-light italic leading-[1.85] text-xl md:text-2xl" style={{ color: "#5A5850" }}>
              {C.quote}
            </motion.p>
            <motion.p variants={vUp} className="font-sans text-[10px] tracking-[0.32em] uppercase" style={{ color: "var(--sage)" }}>
              {C.quoteEn}
            </motion.p>
            <motion.div variants={vIn}><Gem /></motion.div>
            <motion.div variants={vUp} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <p className="font-serif text-lg md:text-xl font-light">{C.groomFull}</p>
              <span className="font-serif italic text-3xl" style={{ color: "var(--sage-l)" }}>&</span>
              <p className="font-serif text-lg md:text-xl font-light">{C.brideFull}</p>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §3  GALLERY
        ════════════════════════════════════════════════════════════════════ */}
        <section ref={galleryRef} className="py-16 px-4 overflow-hidden" style={{ background: "var(--cream)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center md:items-end justify-center">
              <motion.div style={{ y: p1Y }} className="w-full md:w-[52%] flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 1.1, ease }}
                  className="relative w-full rounded-3xl overflow-hidden shimmer"
                  style={{ height: "clamp(360px, 82vw, 600px)", boxShadow: "0 24px 72px rgba(30,34,25,0.14)" }}
                >
                  <Image
                    src={C.photo1} alt={`${C.groomFull} & ${C.brideFull}`}
                    fill sizes="(max-width:768px) 100vw, 52vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none" style={{
                    background: "linear-gradient(to top, rgba(30,34,25,0.26), transparent)",
                  }} />
                  <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-none">
                    <span className="font-serif italic text-white/80 text-sm tracking-wide">
                      {C.groom} & {C.bride}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div style={{ y: p2Y }} className="w-full md:w-[44%] flex-shrink-0 md:mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.15, ease }}
                  className="relative w-full rounded-3xl overflow-hidden"
                  style={{
                    height: "clamp(360px, 78vw, 540px)",
                    background: "#EDF1E4",
                    boxShadow: "0 24px 72px rgba(30,34,25,0.10)",
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
            §4  DARK SAVE-THE-DATE
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative mx-4 md:mx-6 my-16 rounded-[2.5rem] overflow-hidden"
          style={{ background: "var(--charcoal)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(168,186,120,0.12) 0%, transparent 68%)",
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(168,186,120,0.06) 0%, transparent 100%)",
          }} />

          <div className="relative z-10 py-24 px-6 text-center max-w-lg mx-auto">
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
              <motion.h2 variants={vUp} className="font-serif font-light text-white" style={{
                fontSize: "clamp(2rem,7vw,3.5rem)", letterSpacing: "-0.01em",
              }}>
                {C.date}
              </motion.h2>
              <motion.p variants={vUp} className="font-serif italic" style={{ color: "rgba(201,212,168,0.65)", fontSize: "1.2rem" }}>
                {C.timeEn}
              </motion.p>
              <motion.p variants={vUp} className="font-sans text-sm text-center" style={{ color: "rgba(168,186,120,0.5)", maxWidth: "28ch" }}>
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
            <motion.h2 variants={vUp} className="font-serif font-light" style={{ fontSize: "clamp(2.4rem,8vw,3.5rem)", color: "var(--ink)" }}>
              Detail Acara
            </motion.h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            <Card>
              <div className="p-8 flex items-center gap-5">
                <div className="w-13 h-13 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--sage-p)", width: 52, height: 52 }}>
                  <Calendar size={22} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1.5" style={{ color: "var(--light)" }}>Hari & Tanggal</p>
                  <p className="font-serif text-xl md:text-2xl font-light">{C.date}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-8 flex items-center gap-5">
                <div className="w-13 h-13 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--sage-p)", width: 52, height: 52 }}>
                  <Clock size={22} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1.5" style={{ color: "var(--light)" }}>Waktu</p>
                  <p className="font-serif text-xl md:text-2xl font-light">{C.time}</p>
                  <p className="font-sans text-xs mt-0.5 italic" style={{ color: "var(--muted)" }}>{C.timeEn}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-8 flex flex-col gap-5">
                <div className="flex items-start gap-5">
                  <div className="w-13 h-13 rounded-2xl flex-shrink-0 flex items-center justify-center mt-1" style={{ background: "var(--sage-p)", width: 52, height: 52 }}>
                    <MapPin size={22} strokeWidth={1.3} style={{ color: "var(--sage)" }} />
                  </div>
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1.5" style={{ color: "var(--light)" }}>Lokasi</p>
                    <p className="font-serif text-xl md:text-2xl font-light">{C.venue}</p>
                    <p className="font-sans text-sm mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{C.address}</p>
                  </div>
                </div>
                <MapsLink href={C.mapsUrl} />
              </div>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §6  AMPLOP DIGITAL
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Amplop Digital" /></motion.div>
            <motion.h2 variants={vUp} className="font-serif font-light" style={{ fontSize: "clamp(2.4rem,8vw,3.5rem)", color: "var(--ink)" }}>
              Hadiah Pernikahan
            </motion.h2>
          </motion.div>

          <Card>
            <div className="p-9 md:p-12 flex flex-col items-center gap-0">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color: "var(--muted)", maxWidth: "32ch", margin: "0 auto 2.5rem" }}>
                Kehadiran Anda adalah hadiah yang paling berarti. Namun jika Anda ingin memberikan restu, Anda dapat melakukannya di sini.
              </p>

              {/* QRIS */}
              <div
                className="relative rounded-3xl overflow-hidden mb-8"
                style={{
                  width: "clamp(190px, 58vw, 236px)",
                  height: "clamp(190px, 58vw, 236px)",
                  background: "white",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 40px rgba(30,34,25,0.08)",
                }}
              >
                <Image
                  src={C.qrisImg} alt="QRIS Payment"
                  fill style={{ objectFit: "contain", padding: "8px" }}
                />
              </div>

              {/* Bank accounts */}
              <div className="w-full flex flex-col gap-3 mb-4">
                {/* Bride */}
                <div className="w-full text-center py-6 px-5 rounded-2xl" style={{ background: "var(--sage-p)" }}>
                  <p className="font-sans text-[8px] tracking-[0.44em] uppercase mb-2" style={{ color: "var(--sage)" }}>
                    {C.bankName} — Mempelai Wanita
                  </p>
                  <p className="font-serif text-2xl tracking-[0.08em] font-light" style={{ color: "var(--ink)" }}>
                    {C.bankAccount}
                  </p>
                  <p className="font-sans text-[11px] mt-1 italic" style={{ color: "var(--muted)" }}>
                    a.n. {C.accountHolder}
                  </p>
                  <button
                    onClick={() => handleCopy("1")}
                    className="mt-3 inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-sans text-[9px] tracking-[0.28em] uppercase border transition-all duration-300"
                    style={{
                      borderColor: copied === "1" ? "var(--sage)" : "rgba(138,154,91,0.4)",
                      color:       copied === "1" ? "white"       : "var(--sage)",
                      background:  copied === "1" ? "var(--sage)" : "transparent",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {copied === "1" ? (
                        <motion.span key="y" initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }} className="flex items-center gap-1.5">
                          <Check size={11} strokeWidth={2.2} /> Tersalin!
                        </motion.span>
                      ) : (
                        <motion.span key="n" initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }} className="flex items-center gap-1.5">
                          <Copy size={11} strokeWidth={1.6} /> Salin Nomor
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Groom */}
                <div className="w-full text-center py-6 px-5 rounded-2xl" style={{ background: "var(--sage-p)" }}>
                  <p className="font-sans text-[8px] tracking-[0.44em] uppercase mb-2" style={{ color: "var(--sage)" }}>
                    {C.bankName2} — Mempelai Pria
                  </p>
                  <p className="font-serif text-2xl tracking-[0.08em] font-light" style={{ color: "var(--ink)" }}>
                    {C.bankAccount2}
                  </p>
                  <p className="font-sans text-[11px] mt-1 italic" style={{ color: "var(--muted)" }}>
                    a.n. {C.accountHolder2}
                  </p>
                  <button
                    onClick={() => handleCopy("2")}
                    className="mt-3 inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-sans text-[9px] tracking-[0.28em] uppercase border transition-all duration-300"
                    style={{
                      borderColor: copied === "2" ? "var(--sage)" : "rgba(138,154,91,0.4)",
                      color:       copied === "2" ? "white"       : "var(--sage)",
                      background:  copied === "2" ? "var(--sage)" : "transparent",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {copied === "2" ? (
                        <motion.span key="y" initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }} className="flex items-center gap-1.5">
                          <Check size={11} strokeWidth={2.2} /> Tersalin!
                        </motion.span>
                      ) : (
                        <motion.span key="n" initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }} className="flex items-center gap-1.5">
                          <Copy size={11} strokeWidth={1.6} /> Salin Nomor
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §7  UCAPAN & DOA
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Ucapan & Doa" /></motion.div>
            <motion.h2 variants={vUp} className="font-serif font-light" style={{ fontSize: "clamp(2.4rem,8vw,3.5rem)", color: "var(--ink)" }}>
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-12 text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.18, 1] }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "var(--sage-p)" }}
                    >
                      <Sparkles size={26} strokeWidth={1.4} style={{ color: "var(--sage)" }} />
                    </motion.div>
                    <p className="font-serif text-2xl md:text-3xl font-light">Terima Kasih! 🙏</p>
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
                    <SendButton />
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
        <section className="py-32 px-6 text-center" style={{ background: "var(--cream)" }}>
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
              style={{ fontSize: "clamp(3rem,14vw,5.5rem)", letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1 }}
            >
              {C.groom}{" "}
              <span className="italic" style={{ color: "var(--sage)" }}>&</span>{" "}
              {C.bride}
            </motion.h2>
            <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.5em] uppercase" style={{ color: "var(--light)" }}>
              {C.dateFormal}
            </motion.p>
            <motion.div variants={vIn}><Gem /></motion.div>
            <motion.p variants={vUp} className="font-serif text-xl italic" style={{ color: "var(--muted)" }}>
              Dengan cinta & rasa syukur yang tak terhingga.
            </motion.p>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            §9  STICKY RSVP BAR
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ y: 130 }}
          animate={{ y: 0 }}
          transition={{ delay: 3.5, type: "spring", stiffness: 48, damping: 15 }}
          className="fixed bottom-0 inset-x-0 z-[9000]"
        >
          <div
            className="w-full border-t"
            style={{
              background: "rgba(250,248,243,0.9)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderColor: "rgba(236,234,227,0.9)",
              boxShadow: "0 -10px 40px rgba(30,34,25,0.07)",
            }}
          >
            <div
              className="max-w-md mx-auto flex gap-3 px-4 pt-3"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
            >
              <RSVPLink
                href={`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(
                  `✨ *Konfirmasi Kehadiran*\n\nAssalamualaikum,\n\nSaya menyatakan *hadir* di pernikahan *${C.groomFull}* & *${C.brideFull}*.\n\n📅 ${C.date}\n🕌 ${C.venue}\n\nSalam hangat,`
                )}`}
                variant="primary"
              >
                <Heart size={12} fill="currentColor" strokeWidth={0} />
                Konfirmasi Hadir
              </RSVPLink>

              <RSVPLink
                href={`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(
                  `Assalamualaikum,\n\nMohon maaf, saya tidak dapat hadir di pernikahan *${C.groomFull}* & *${C.brideFull}*.\n\nSemoga acara berjalan lancar dan penuh berkah. 🤲`
                )}`}
                variant="secondary"
              >
                Tidak Hadir
              </RSVPLink>
            </div>
          </div>
        </motion.div>

      </main>
    </>
  );
}