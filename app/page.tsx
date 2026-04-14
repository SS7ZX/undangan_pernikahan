"use client";

import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring, useReducedMotion,
  type Variants, type MotionValue,
} from "framer-motion";
import {
  Calendar, Clock, MapPin, Music2, Pause,
  ChevronDown, Copy, Check, Sparkles, Heart, Send,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — edit only this block
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  groom:          "Rian",
  bride:          "Windi",
  groomFull:      "Rian Pebriansyah, S.Psi",
  brideFull:      "Windi Nuraeni",
  date:           "Minggu, 22 November 2026",
  dateFormal:     "22 · 11 · 2026",
  time:           "Pukul 08.00 WIB",
  timeEn:         "Pukul Delapan Pagi",
  venue:          "Rumah Mempelai Wanita",
  address:        "Kp. Jatimulya 2 RT/RW 001/003 No. 1, Kel. Mekarjati, Karawang Barat, Kab. Karawang",
  mapsUrl:        "https://www.google.com/maps/place/Pengajian+Nurul+aini/@-6.2601681,107.2912323,17z/data=!3m1!4b1!4m6!3m5!1s0x2e6979006df0af83:0x9963dbe4291b465f!8m2!3d-6.2601681!4d107.2938072!16s%2Fg%2F11vrlyj5d8?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
  whatsapp:       "62895369942679",
  bankName:       "Bank Mandiri",
  bankAccount:    "1730006953229",
  accountHolder:  "Windi Nuraeni",
  bankName2:      "Bank Danamon",
  bankAccount2:   "003673736199",
  accountHolder2: "Rian Pebriansyah",
  audioSrc:       "/wedding-song.mp3",
  photo1:         "/photo1.jpeg",
  photo2:         "/photo2.jpeg",
  qrisImg:        "/qris.png",
  quote:          "Dua jiwa yang menemukan rumah satu sama lain — kami bersyukur kau hadir menyaksikan awal perjalanan kami.",
  quoteEn:        "Two souls that found home in each other.",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;
const vUp: Variants      = { hidden: { opacity:0, y:40 },   visible: { opacity:1, y:0, transition:{ duration:1.1, ease } } };
const vIn: Variants      = { hidden: { opacity:0 },          visible: { opacity:1, transition:{ duration:1.3 } } };
const vScale: Variants   = { hidden: { opacity:0, scale:0.92 }, visible: { opacity:1, scale:1, transition:{ duration:1, ease } } };
const vStagger: Variants = { hidden: {}, visible: { transition:{ staggerChildren:0.13, delayChildren:0.55 } } };
const vFast: Variants    = { hidden: {}, visible: { transition:{ staggerChildren:0.09 } } };
const vLeft: Variants    = { hidden: { opacity:0, x:-32 },  visible: { opacity:1, x:0, transition:{ duration:1, ease } } };
const vRight: Variants   = { hidden: { opacity:0, x:32 },   visible: { opacity:1, x:0, transition:{ duration:1, ease } } };

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Gem = memo(({ light=false, size="md" }: { light?:boolean; size?:"sm"|"md" }) => {
  const c = light ? "rgba(180,140,60,0.55)" : "#A8BA78";
  const w = size==="sm" ? 56 : 80;
  return (
    <svg width={w} height={8} viewBox={`0 0 ${w} 8`} fill="none">
      <line x1="0" y1="4" x2={w*0.3} y2="4" stroke={c} strokeWidth="0.8"/>
      <rect x={w*0.32} y="2.5" width="3" height="3" transform={`rotate(45 ${w*0.335} 4)`} fill={c}/>
      <line x1={w*0.38} y1="4" x2={w*0.48} y2="4" stroke={c} strokeWidth="0.8"/>
      <circle cx={w/2} cy={4} r="2.5" fill={c}/>
      <line x1={w*0.52} y1="4" x2={w*0.62} y2="4" stroke={c} strokeWidth="0.8"/>
      <rect x={w*0.645} y="2.5" width="3" height="3" transform={`rotate(45 ${w*0.66} 4)`} fill={c}/>
      <line x1={w*0.7} y1="4" x2={w} y2="4" stroke={c} strokeWidth="0.8"/>
    </svg>
  );
});
Gem.displayName = "Gem";

const SectionBadge = memo(({ label, light=false }: { label:string; light?:boolean }) => (
  <div className="flex items-center justify-center gap-3 mb-5">
    <Gem light={light}/>
    <span className="font-sans text-[9px] tracking-[0.52em] uppercase" style={{ color: light ? "rgba(180,140,60,0.6)" : "#9A9A90" }}>
      {label}
    </span>
    <Gem light={light}/>
  </div>
));
SectionBadge.displayName = "SectionBadge";

const Card = memo(({ children, className="" }: { children:React.ReactNode; className?:string }) => (
  <motion.div
    initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-50px" }} variants={vScale}
    className={`relative overflow-hidden rounded-3xl ${className}`}
    style={{ background:"var(--cream)", border:"1px solid #EFEDE8", boxShadow:"0 4px 6px rgba(44,48,46,0.04),0 16px 40px rgba(44,48,46,0.06)" }}
  >
    <div className="absolute top-0 inset-x-0 h-[1.5px]" style={{ background:"linear-gradient(90deg,transparent,#A8BA78 40%,#A8BA78 60%,transparent)" }}/>
    {children}
  </motion.div>
));
Card.displayName = "Card";

const Field = memo(({ id, label, value, onChange, placeholder, rows }: {
  id:string; label:string; value:string; onChange:(v:string)=>void; placeholder:string; rows?:number;
}) => {
  const [focused, setFocused] = useState(false);
  const s: React.CSSProperties = {
    background:"transparent", border:"none", outline:"none", width:"100%",
    padding:"6px 0 12px", fontFamily:"'Playfair Display',Georgia,serif",
    fontSize:"1.1rem", color:"#2C302E", resize:"none" as const,
    borderBottom:`1px solid ${focused?"#8A9A5B":"#E4E0D8"}`, transition:"border-color 0.3s ease",
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-sans text-[10px] tracking-[0.4em] uppercase" style={{ color:"#9A9A90" }}>{label}</label>
      {rows
        ? <textarea id={id} rows={rows} required value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
        : <input   id={id} type="text" required value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
      }
    </div>
  );
});
Field.displayName = "Field";

function useParallax(v:MotionValue<number>, range:[string,string]) {
  return useTransform(v,[0,1],range);
}

// ─────────────────────────────────────────────────────────────────────────────
// COPY BUTTON — reusable for both bank accounts
// ─────────────────────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text:string }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text.replace(/\s/g,""));
    setDone(true);
    setTimeout(()=>setDone(false), 2500);
  };
  return (
    <button onClick={copy}
      className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-[9px] tracking-[0.28em] uppercase border transition-all duration-300"
      style={{ borderColor:done?"var(--sage)":"rgba(138,154,91,0.4)", color:done?"white":"var(--sage)", background:done?"var(--sage)":"transparent" }}
    >
      <AnimatePresence mode="wait">
        {done
          ? <motion.span key="y" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} className="flex items-center gap-1.5"><Check size={11} strokeWidth={2.2}/> Tersalin!</motion.span>
          : <motion.span key="n" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} className="flex items-center gap-1.5"><Copy size={11} strokeWidth={1.6}/> Salin</motion.span>
        }
      </AnimatePresence>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function WeddingInvitation() {
  const prefersReducedMotion = useReducedMotion();

  const [loading,   setLoading]   = useState(true);
  const [loadPct,   setLoadPct]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverBtn,  setHoverBtn]  = useState(false);
  const [name,      setName]      = useState("");
  const [msg,       setMsg]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const cx = useSpring(mx, { stiffness:520, damping:34, mass:0.35 });
  const cy = useSpring(my, { stiffness:520, damping:34, mass:0.35 });

  const { scrollYProgress: heroSY }    = useScroll({ target:heroRef,    offset:["start start","end start"] });
  const { scrollYProgress: gallerySY } = useScroll({ target:galleryRef, offset:["start end","end start"] });
  const heroTY = useParallax(heroSY,    isMobile||!!prefersReducedMotion ? ["0%","0%"] : ["0%","18%"]);
  const p1Y    = useParallax(gallerySY, isMobile||!!prefersReducedMotion ? ["0%","0%"] : ["-8%","8%"]);
  const p2Y    = useParallax(gallerySY, isMobile||!!prefersReducedMotion ? ["0%","0%"] : ["8%","-8%"]);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive:true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── AUDIO + LOADER (single effect — eliminates race condition) ──────────────
  // Strategy: create Audio, wait for 'canplaythrough' OR 3s timeout,
  // whichever fires first — then attempt play after loader exits.
  useEffect(() => {
    const a = new Audio(C.audioSrc);
    a.loop    = true;
    a.volume  = 0.32;
    a.preload = "auto";
    audioRef.current = a;

    let audioReady  = false;
    let loaderDone  = false;
    let playAttempted = false;

    const tryPlay = () => {
      if (!audioReady || !loaderDone || playAttempted) return;
      playAttempted = true;
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => {/* browser policy — Music button is fallback */});
    };

    // Mark audio ready when enough data buffered
    const onReady = () => { audioReady = true; tryPlay(); };
    a.addEventListener("canplaythrough", onReady, { once:true });
    // Fallback: if audio never fires canplaythrough (e.g. file missing), still attempt after 1s
    const audioFallback = setTimeout(() => { audioReady = true; tryPlay(); }, 1000);

    // Loader progress
    let t = 0;
    const iv = setInterval(() => {
      t += Math.random() * 18 + 10;
      setLoadPct(Math.min(Math.round(t), 100));
      if (t >= 100) clearInterval(iv);
    }, 100);

    // Loader done
    const tm = setTimeout(() => {
      setLoading(false);
      // Give loader exit animation 700ms to clear, then play
      setTimeout(() => { loaderDone = true; tryPlay(); }, 700);
    }, 2800);

    return () => {
      clearInterval(iv);
      clearTimeout(tm);
      clearTimeout(audioFallback);
      a.removeEventListener("canplaythrough", onReady);
      a.pause();
      a.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor
  useEffect(() => {
    if (isMobile) return;
    const fn = (e:MouseEvent) => { mx.set(e.clientX-10); my.set(e.clientY-10); };
    window.addEventListener("mousemove", fn, { passive:true });
    return () => window.removeEventListener("mousemove", fn);
  }, [isMobile, mx, my]);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(()=>{});
    setIsPlaying(p => !p);
  }, [isPlaying]);

  const handleWish = useCallback((e:React.FormEvent) => {
    e.preventDefault();
    const txt = `✨ *Doa & Ucapan untuk ${C.groom} & ${C.bride}* ✨\n\n*Dari:* ${name}\n\n*Pesan:*\n_${msg}_\n\n— Dikirim via Undangan Digital · ${C.dateFormal}`;
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(txt)}`, "_blank");
    setSubmitted(true); setName(""); setMsg("");
    setTimeout(() => setSubmitted(false), 4500);
  }, [name, msg]);

  const h = { onMouseEnter:()=>setHoverBtn(true), onMouseLeave:()=>setHoverBtn(false) };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; -webkit-tap-highlight-color:transparent; -webkit-touch-callout:none; }
        :root {
          --sage:#8A9A5B; --sage-m:#A8BA78; --sage-l:#C9D4A8; --sage-p:#F2F5E8;
          --charcoal:#1E2219; --ink:#2E3228; --cream:#FAF8F3;
          --muted:#78786E; --light:#ABAB9E; --border:#ECEAE3;
          --gold:#C8A84B; --gold-l:#E8D4A0; --gold-p:#FBF6EC;
        }
        html { scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
        body { font-family:'Jost',sans-serif; background:var(--cream); color:var(--ink);
          -webkit-font-smoothing:antialiased; overflow-x:hidden; overscroll-behavior-y:none; }
        body::after { content:''; position:fixed; inset:0; pointer-events:none; z-index:9997; opacity:0.03;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E"); }
        .font-serif { font-family:'Playfair Display',Georgia,serif; }
        .font-sans  { font-family:'Jost',sans-serif; }
        ::selection { background:var(--sage-l); color:var(--charcoal); }
        @media (max-width:768px) { ::-webkit-scrollbar{display:none} body{scrollbar-width:none} }

        /* Flower rain */
        @keyframes petal-a {
          0%   { transform:translateY(-90px) translateX(0)    rotate(0deg)   scale(1);    opacity:0; }
          5%   { opacity:0.7; }
          30%  { transform:translateY(28vh)  translateX(-18px) rotate(110deg) scale(0.95); }
          60%  { transform:translateY(58vh)  translateX(12px)  rotate(240deg) scale(1.02); opacity:0.48; }
          90%  { opacity:0.25; }
          100% { transform:translateY(112vh) translateX(-8px)  rotate(380deg) scale(0.9);  opacity:0; }
        }
        @keyframes petal-b {
          0%   { transform:translateY(-90px) translateX(0)    rotate(20deg)  scale(0.9);  opacity:0; }
          7%   { opacity:0.65; }
          35%  { transform:translateY(32vh)  translateX(22px)  rotate(150deg) scale(1.05); }
          65%  { transform:translateY(65vh)  translateX(-14px) rotate(280deg) scale(0.95); opacity:0.4; }
          92%  { opacity:0.2; }
          100% { transform:translateY(114vh) translateX(6px)   rotate(400deg) scale(0.85); opacity:0; }
        }
        @keyframes petal-c {
          0%   { transform:translateY(-70px) rotate(0deg)   scale(0.8);  opacity:0; }
          8%   { opacity:0.6; }
          50%  { transform:translateY(50vh)  rotate(300deg) scale(0.85); opacity:0.36; }
          100% { transform:translateY(112vh) rotate(600deg) scale(0.75); opacity:0; }
        }
        .petal { position:fixed; top:-90px; pointer-events:none; z-index:2; will-change:transform; }
        .petal-a { animation:petal-a ease-in-out infinite; }
        .petal-b { animation:petal-b ease-in-out infinite; }
        .petal-c { animation:petal-c linear       infinite; }

        /* Shimmer */
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .shimmer { background:linear-gradient(105deg,#F0EDE4 30%,#FAF8F3 50%,#F0EDE4 70%); background-size:200% 100%; animation:shimmer 2s ease-in-out infinite; }

        /* RSVP pulse */
        @keyframes attend-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(138,154,91,0.5)} 60%{box-shadow:0 0 0 12px rgba(138,154,91,0)} }
        .attend-pulse { animation:attend-pulse 2.6s ease infinite; }

        /* Waveform */
        @keyframes wave { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
        .bar { animation:wave 0.8s ease-in-out infinite; transform-origin:bottom; }
        .bar:nth-child(2){animation-delay:0.15s} .bar:nth-child(3){animation-delay:0.3s} .bar:nth-child(4){animation-delay:0.12s}

        /* Mandala loader — cream spinning rings */
        @keyframes spin-cw  { to{transform:rotate(360deg)} }
        @keyframes spin-ccw { to{transform:rotate(-360deg)} }
        .ring-cw  { animation:spin-cw  linear infinite; transform-origin:center; }
        .ring-ccw { animation:spin-ccw linear infinite; transform-origin:center; }

        /* Loader gold bar top/bottom */
        @keyframes bar-grow { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }
        .loader-bar { animation:bar-grow 1.2s 0.3s ease forwards; transform-origin:center; opacity:0; }

        input::placeholder, textarea::placeholder { color:#C8C2B8; font-style:italic; font-family:'Playfair Display',Georgia,serif; }
        a,button { cursor:none !important; }
        @media (pointer:coarse) { a,button{cursor:pointer !important} }
        @media (prefers-reduced-motion:reduce) { .petal,.bar,.attend-pulse,.ring-cw,.ring-ccw{animation:none !important} }
      `}</style>

      <main className="relative min-h-screen overflow-x-hidden cursor-none"
        style={{ background:"var(--cream)", paddingBottom:"calc(80px + env(safe-area-inset-bottom))" }}>

        {/* ── FLOWER RAIN ── */}
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
          const anim = i%3===0?"petal-a":i%3===1?"petal-b":"petal-c";
          return (
            <div key={i} className={`petal ${anim}`} style={{ left:p.l, animationDelay:p.d, animationDuration:p.t }}>
              {p.type==="rose" && (
                <svg width={p.sz} height={p.sz*1.2} viewBox="0 0 24 28" fill="none">
                  <path d="M12 2 C8 2 3 7 3 13 C3 20 7 26 12 26 C17 26 21 20 21 13 C21 7 16 2 12 2Z" fill={p.col} opacity={p.op}/>
                  <path d="M12 5 C10 8 9 11 10 16 C10.5 19 11.5 22 12 24" stroke={p.col} strokeWidth="0.5" opacity="0.3" fill="none"/>
                </svg>
              )}
              {p.type==="cherry" && (
                <svg width={p.sz} height={p.sz} viewBox="0 0 32 32" fill="none">
                  {[0,72,144,216,288].map((r,ri) => <ellipse key={ri} cx="16" cy="7" rx="4.5" ry="7" fill={p.col} opacity={p.op} transform={`rotate(${r} 16 16)`}/>)}
                  <circle cx="16" cy="16" r="2.5" fill={p.col} opacity="0.4"/>
                </svg>
              )}
              {p.type==="floret" && (
                <svg width={p.sz} height={p.sz} viewBox="0 0 24 24" fill="none">
                  {[0,45,90,135,180,225,270,315].map((deg,di) => (
                    <ellipse key={di} cx="12" cy="5" rx="2.2" ry="4.5" fill={p.col} opacity={p.op} transform={`rotate(${deg} 12 12)`}/>
                  ))}
                  <circle cx="12" cy="12" r="2" fill={p.col} opacity="0.5"/>
                </svg>
              )}
            </div>
          );
        })}

        {/* ── CUSTOM CURSOR ── */}
        {!isMobile && (
          <motion.div className="fixed top-0 left-0 z-[9999] pointer-events-none" style={{ x:cx, y:cy }}>
            <motion.div
              animate={{ scale:hoverBtn?2.4:1, opacity:hoverBtn?0.5:0.85 }}
              transition={{ type:"spring", stiffness:500, damping:30 }}
              className="w-5 h-5 rounded-full"
              style={{ background:"var(--sage)", mixBlendMode:"multiply" }}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            LOADER — Cream Indian Mandala
        ════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              className="fixed inset-0 z-[9990] flex flex-col items-center justify-center overflow-hidden select-none"
              style={{ background:"var(--cream)" }}
              exit={{ clipPath:"inset(100% 0 0 0)", transition:{ duration:1.2, ease:[0.76,0,0.24,1], delay:0.05 } }}
            >
              {/* Subtle warm radial glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background:"radial-gradient(ellipse 72% 58% at 50% 46%, rgba(200,168,75,0.10) 0%, rgba(168,186,120,0.06) 50%, transparent 75%)",
              }}/>

              {/* Top ornamental band */}
              <div className="loader-bar absolute top-0 inset-x-0 h-[2px]" style={{
                background:"linear-gradient(90deg,transparent,var(--gold-l) 25%,var(--gold) 50%,var(--gold-l) 75%,transparent)",
              }}/>
              {/* Bottom ornamental band */}
              <div className="loader-bar absolute bottom-0 inset-x-0 h-[2px]" style={{
                background:"linear-gradient(90deg,transparent,var(--gold-l) 25%,var(--gold) 50%,var(--gold-l) 75%,transparent)",
              }}/>

              {/* ── MANDALA ── */}
              <motion.div
                initial={{ opacity:0, scale:0.65, rotate:-25 }}
                animate={{ opacity:1, scale:1,    rotate:0   }}
                transition={{ duration:1.5, ease:[0.16,1,0.3,1] }}
                className="relative flex items-center justify-center mb-8"
                style={{ width:"min(78vw,300px)", height:"min(78vw,300px)" }}
              >
                {/* Ring 1 — outermost, slow CW, 16 petals */}
                <div className="ring-cw absolute inset-0" style={{ animationDuration:"50s" }}>
                  <svg viewBox="0 0 300 300" width="100%" height="100%">
                    {Array.from({length:16}).map((_,i) => (
                      <ellipse key={i} cx="150" cy="20" rx="6" ry="15"
                        fill="none" stroke="var(--gold)" strokeWidth="0.7" opacity="0.3"
                        transform={`rotate(${i*22.5} 150 150)`}/>
                    ))}
                    {Array.from({length:24}).map((_,i) => (
                      <circle key={i}
                        cx={150+139*Math.cos((i*15-90)*Math.PI/180)}
                        cy={150+139*Math.sin((i*15-90)*Math.PI/180)}
                        r="1.6" fill="var(--gold)" opacity="0.35"/>
                    ))}
                  </svg>
                </div>

                {/* Ring 2 — CCW, 12 arch petals */}
                <div className="ring-ccw absolute" style={{ inset:"13%", animationDuration:"36s" }}>
                  <svg viewBox="0 0 228 228" width="100%" height="100%">
                    {Array.from({length:12}).map((_,i) => (
                      <ellipse key={i} cx="114" cy="15" rx="8" ry="20"
                        fill="rgba(200,168,75,0.07)" stroke="var(--gold)" strokeWidth="0.6" opacity="0.45"
                        transform={`rotate(${i*30} 114 114)`}/>
                    ))}
                    {Array.from({length:12}).map((_,i) => {
                      const a=(i*30-90)*Math.PI/180;
                      const x=114+103*Math.cos(a), y=114+103*Math.sin(a);
                      return <rect key={i} x={x-2.5} y={y-2.5} width="5" height="5"
                        fill="var(--gold)" opacity="0.5" transform={`rotate(45 ${x} ${y})`}/>;
                    })}
                  </svg>
                </div>

                {/* Ring 3 — CW, 8 lotus petals */}
                <div className="ring-cw absolute" style={{ inset:"27%", animationDuration:"24s" }}>
                  <svg viewBox="0 0 162 162" width="100%" height="100%">
                    {Array.from({length:8}).map((_,i) => (
                      <ellipse key={i} cx="81" cy="13" rx="9" ry="22"
                        fill="rgba(168,186,120,0.10)" stroke="var(--sage-m)" strokeWidth="0.7" opacity="0.55"
                        transform={`rotate(${i*45} 81 81)`}/>
                    ))}
                    <circle cx="81" cy="81" r="26" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.35" strokeDasharray="3 3"/>
                  </svg>
                </div>

                {/* Ring 4 — CCW innermost, pure circle */}
                <div className="ring-ccw absolute" style={{ inset:"40%", animationDuration:"16s" }}>
                  <svg viewBox="0 0 108 108" width="100%" height="100%">
                    {Array.from({length:8}).map((_,i) => {
                      const a=(i*45-90)*Math.PI/180;
                      const x=54+44*Math.cos(a), y=54+44*Math.sin(a);
                      return <circle key={i} cx={x} cy={y} r="3" fill="var(--sage-m)" opacity="0.4"/>;
                    })}
                    <circle cx="54" cy="54" r="18" fill="none" stroke="var(--sage-l)" strokeWidth="0.6" opacity="0.5"/>
                  </svg>
                </div>

                {/* Centre — lotus + initials */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale:[1,1.05,1] }}
                    transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
                    className="flex flex-col items-center"
                    style={{ gap:"6px" }}
                  >
                    {/* Lotus */}
                    <svg width="48" height="28" viewBox="0 0 48 28" fill="none">
                      <path d="M24 26 C20 21 13 18 7 20 C11 12 18 9 24 11 C30 9 37 12 41 20 C35 18 28 21 24 26Z"
                        fill="rgba(200,168,75,0.15)" stroke="var(--gold)" strokeWidth="0.8"/>
                      <path d="M24 24 C22 20 17 17 13 18 C16 13 21 10 24 12 C27 10 32 13 35 18 C31 17 26 20 24 24Z"
                        fill="rgba(200,168,75,0.22)" stroke="var(--gold)" strokeWidth="0.7"/>
                      <path d="M24 22 C22 18 20 17 18 18 C20 14 22 13 24 14 C26 13 28 14 30 18 C28 17 26 18 24 22Z"
                        fill="rgba(200,168,75,0.32)" stroke="var(--gold)" strokeWidth="0.6"/>
                      <line x1="24" y1="22" x2="24" y2="28" stroke="var(--gold)" strokeWidth="0.7" opacity="0.45"/>
                    </svg>
                    {/* Initials */}
                    <motion.p
                      initial={{ opacity:0, scale:0.85 }}
                      animate={{ opacity:1, scale:1 }}
                      transition={{ delay:0.8, duration:1.2 }}
                      className="font-serif font-light text-center"
                      style={{
                        fontSize:"clamp(2rem,8vw,3rem)",
                        color:"var(--ink)",
                        letterSpacing:"0.28em",
                        lineHeight:1,
                        textShadow:"0 0 24px rgba(200,168,75,0.25)",
                      }}
                    >
                      {C.bride[0]} <span style={{ color:"var(--gold)", fontSize:"0.7em" }}>✦</span> {C.groom[0]}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Ornament row */}
              <motion.div
                initial={{ opacity:0, scaleX:0 }}
                animate={{ opacity:1, scaleX:1 }}
                transition={{ delay:0.85, duration:1.1, ease:[0.16,1,0.3,1] }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="h-px w-14" style={{ background:"linear-gradient(to right,transparent,var(--gold))" }}/>
                <span style={{ color:"var(--gold)", fontSize:"12px" }}>✦ ✦ ✦</span>
                <div className="h-px w-14" style={{ background:"linear-gradient(to left,transparent,var(--gold))" }}/>
              </motion.div>

              {/* Label */}
              <motion.p
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:1.1, duration:0.9 }}
                className="font-sans text-[9px] tracking-[0.62em] uppercase mb-10"
                style={{ color:"rgba(180,140,60,0.55)" }}
              >
                Memuat Undangan
              </motion.p>

              {/* Progress bar */}
              <div className="w-52 h-[1.5px] relative rounded-full overflow-hidden" style={{ background:"rgba(200,168,75,0.15)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background:"linear-gradient(90deg,var(--sage-m),var(--gold),#E8D08A)",
                    width:`${loadPct}%`,
                    transition:"width 0.12s linear",
                    boxShadow:"0 0 6px rgba(200,168,75,0.4)",
                  }}
                />
              </div>
              <p className="font-sans mt-2.5 tabular-nums" style={{ color:"rgba(180,140,60,0.35)", fontSize:"9px", letterSpacing:"0.15em" }}>
                {loadPct}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MUSIC BUTTON ── */}
        <motion.button
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:3.3, type:"spring", stiffness:240, damping:18 }}
          onClick={toggleAudio} {...h}
          aria-label={isPlaying?"Pause":"Play"}
          className="fixed top-4 right-4 z-[600] flex items-center gap-2.5 rounded-full px-4 py-2.5 border"
          style={{
            background:"rgba(250,248,243,0.72)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
            borderColor:"rgba(255,255,255,0.8)", boxShadow:"0 2px 20px rgba(30,34,25,0.08)",
            color:isPlaying?"var(--sage)":"var(--muted)",
          }}
        >
          {isPlaying
            ? <div className="flex items-end gap-[2.5px] h-3.5 w-4">{[1,2,3,4].map(i=><div key={i} className="bar flex-1 rounded-full" style={{ background:"var(--sage)", height:"100%" }}/>)}</div>
            : <Music2 size={14} strokeWidth={1.8}/>
          }
          <span className="font-sans text-[10px] tracking-[0.22em] uppercase">{isPlaying?"Pause":"Musik"}</span>
        </motion.button>

        {/* ════════════════════════════════════════════════════════════════
            §1  HERO
        ════════════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ height:"100svh", minHeight:660 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 110% 80% at 50% 60%,#EBF0D8 0%,transparent 65%)" }}/>
          <motion.div initial={{ opacity:0, scale:0.6, rotate:-20 }} animate={!loading?{ opacity:0.18, scale:1, rotate:0 }:{}} transition={{ delay:1, duration:1.8, ease }}
            className="absolute top-0 left-0 pointer-events-none select-none" style={{ fontSize:"9rem", lineHeight:1, color:"var(--sage-l)", fontFamily:"serif" }} aria-hidden>❧</motion.div>
          <motion.div initial={{ opacity:0, scale:0.6, rotate:20 }} animate={!loading?{ opacity:0.18, scale:1, rotate:0 }:{}} transition={{ delay:1.2, duration:1.8, ease }}
            className="absolute bottom-16 right-0 pointer-events-none select-none" style={{ fontSize:"9rem", lineHeight:1, color:"var(--sage-l)", transform:"scaleX(-1) rotate(-15deg)", fontFamily:"serif" }} aria-hidden>❧</motion.div>
          <motion.div initial={{ opacity:0, y:-16 }} animate={!loading?{ opacity:1, y:0 }:{}} transition={{ delay:0.7, duration:0.9 }}
            className="absolute flex justify-center w-full px-6" style={{ top:"calc(env(safe-area-inset-top,0px) + 20px)" }}>
            <span className="font-sans text-[9px] tracking-[0.52em] uppercase px-5 py-2 rounded-full"
              style={{ border:"1px solid #C9D4A8", color:"var(--sage)", background:"rgba(242,245,232,0.9)" }}>
              {C.dateFormal}
            </span>
          </motion.div>
          <motion.div style={{ y:heroTY }} className="flex flex-col items-center z-10 w-full">
            <motion.div initial="hidden" animate={!loading?"visible":"hidden"} variants={vStagger} className="flex flex-col items-center">
              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.52em] uppercase mb-9" style={{ color:"#AAAA9A" }}>
                Bersama keluarga, mengundang kehadiran Anda
              </motion.p>
              <motion.h1 variants={vLeft} className="font-serif font-light leading-none"
                style={{ fontSize:"clamp(3.8rem,19vw,9rem)", letterSpacing:"-0.025em", color:"var(--ink)" }}>
                {C.groom}
              </motion.h1>
              <motion.div variants={vIn} className="flex items-center gap-4 my-2.5 w-full justify-center">
                <div className="h-px flex-1 max-w-[100px]" style={{ background:"linear-gradient(to right,transparent,var(--sage-l))" }}/>
                <motion.span animate={{ scale:[1,1.08,1] }} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
                  className="font-serif italic font-light select-none" style={{ fontSize:"clamp(2.6rem,10vw,4.5rem)", color:"var(--sage)", lineHeight:1 }}>&</motion.span>
                <div className="h-px flex-1 max-w-[100px]" style={{ background:"linear-gradient(to left,transparent,var(--sage-l))" }}/>
              </motion.div>
              <motion.h1 variants={vRight} className="font-serif font-light leading-none"
                style={{ fontSize:"clamp(3.8rem,19vw,9rem)", letterSpacing:"-0.025em", color:"var(--ink)" }}>
                {C.bride}
              </motion.h1>
              <motion.div variants={vIn} className="mt-9 mb-7 mx-auto flex justify-center"><Gem/></motion.div>
              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.42em] uppercase" style={{ color:"#B0AEA6" }}>
                Meminta kehadiran Anda dengan penuh kehormatan
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div className="absolute bottom-8 flex flex-col items-center gap-2"
            initial={{ opacity:0 }} animate={{ opacity:[0,1,0] }}
            transition={{ delay:4, duration:3, repeat:Infinity, ease:"easeInOut" }}>
            <span className="font-sans text-[8px] tracking-[0.5em] uppercase" style={{ color:"#C0BEB4" }}>Scroll</span>
            <ChevronDown size={15} strokeWidth={1.2} style={{ color:"#C0BEB4" }}/>
          </motion.div>
        </section>

        {/* §2 QUOTE */}
        <section className="py-24 px-6" style={{ background:"var(--cream)" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={vFast}
            className="max-w-lg mx-auto flex flex-col items-center gap-6 text-center">
            <motion.div variants={vIn} className="font-serif leading-none select-none"
              style={{ fontSize:"6rem", lineHeight:0.8, color:"var(--sage-l)", marginBottom:"-1rem" }}>"</motion.div>
            <motion.p variants={vUp} className="font-serif font-light italic leading-[1.85] text-lg md:text-xl" style={{ color:"#5A5850" }}>{C.quote}</motion.p>
            <motion.p variants={vUp} className="font-sans text-[10px] tracking-[0.3em] uppercase" style={{ color:"var(--sage)" }}>{C.quoteEn}</motion.p>
            <motion.div variants={vIn}><Gem/></motion.div>
            <motion.div variants={vUp} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <p className="font-serif text-lg font-light">{C.groomFull}</p>
              <span className="font-serif italic text-2xl" style={{ color:"var(--sage-l)" }}>&</span>
              <p className="font-serif text-lg font-light">{C.brideFull}</p>
            </motion.div>
          </motion.div>
        </section>

        {/* §3 GALLERY */}
        <section ref={galleryRef} className="py-16 px-4 overflow-hidden" style={{ background:"var(--cream)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center md:items-end justify-center">
              <motion.div style={{ y:p1Y }} className="w-full md:w-[52%] flex-shrink-0">
                <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:1, ease }}
                  className="relative w-full rounded-3xl overflow-hidden shimmer"
                  style={{ height:"clamp(340px,80vw,580px)", boxShadow:"0 20px 60px rgba(30,34,25,0.12)" }}>
                  <Image src={C.photo1} alt={`${C.groomFull} & ${C.brideFull}`} fill sizes="(max-width:768px) 100vw,52vw" style={{ objectFit:"cover", objectPosition:"center top" }} priority/>
                  <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none" style={{ background:"linear-gradient(to top,rgba(30,34,25,0.22),transparent)" }}/>
                  <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-none">
                    <span className="font-serif italic text-white/80 text-sm tracking-wide">{C.groom} & {C.bride}</span>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div style={{ y:p2Y }} className="w-full md:w-[44%] flex-shrink-0 md:mt-24">
                <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:1, delay:0.15, ease }}
                  className="relative w-full rounded-3xl overflow-hidden"
                  style={{ height:"clamp(340px,76vw,520px)", background:"#EDF1E4", boxShadow:"0 20px 60px rgba(30,34,25,0.10)" }}>
                  <Image src={C.photo2} alt={`${C.groomFull} & ${C.brideFull}`} fill sizes="(max-width:768px) 100vw,44vw" style={{ objectFit:"contain", objectPosition:"center center" }}/>
                  <div className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none" style={{ background:"linear-gradient(to top,rgba(30,34,25,0.08),transparent)" }}/>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* §4 SAVE THE DATE */}
        <section className="relative mx-4 md:mx-6 my-16 rounded-[2rem] overflow-hidden" style={{ background:"var(--charcoal)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 85% 65% at 50% 50%,rgba(168,186,120,0.10) 0%,transparent 68%)" }}/>
          <div className="relative z-10 py-20 px-6 text-center max-w-lg mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={vFast} className="flex flex-col items-center gap-5">
              <motion.div variants={vIn}><Gem light size="sm"/></motion.div>
              <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.55em] uppercase" style={{ color:"rgba(168,186,120,0.45)" }}>Simpan Tanggal Ini</motion.p>
              <motion.h2 variants={vUp} className="font-serif font-light text-white" style={{ fontSize:"clamp(1.8rem,6vw,3.2rem)" }}>{C.date}</motion.h2>
              <motion.p variants={vUp} className="font-serif italic" style={{ color:"rgba(201,212,168,0.6)", fontSize:"1.15rem" }}>{C.timeEn}</motion.p>
              <motion.p variants={vUp} className="font-sans text-sm" style={{ color:"rgba(168,186,120,0.5)" }}>{C.venue}</motion.p>
              <motion.div variants={vIn}><Gem light size="sm"/></motion.div>
            </motion.div>
          </div>
        </section>

        {/* §5 EVENT DETAILS */}
        <section className="py-24 px-4 max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Acara Pernikahan"/></motion.div>
            <motion.h2 variants={vUp} className="font-serif text-4xl md:text-5xl font-light" style={{ color:"var(--ink)" }}>Detail Acara</motion.h2>
          </motion.div>
          <div className="flex flex-col gap-4">
            <Card>
              <div className="p-8 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background:"var(--sage-p)" }}>
                  <Calendar size={20} strokeWidth={1.3} style={{ color:"var(--sage)" }}/>
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color:"var(--light)" }}>Hari & Tanggal</p>
                  <p className="font-serif text-xl font-light">{C.date}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-8 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background:"var(--sage-p)" }}>
                  <Clock size={20} strokeWidth={1.3} style={{ color:"var(--sage)" }}/>
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color:"var(--light)" }}>Waktu</p>
                  <p className="font-serif text-xl font-light">{C.time}</p>
                  <p className="font-sans text-xs mt-0.5 italic" style={{ color:"var(--muted)" }}>{C.timeEn}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-8 flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background:"var(--sage-p)" }}>
                    <MapPin size={20} strokeWidth={1.3} style={{ color:"var(--sage)" }}/>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color:"var(--light)" }}>Lokasi</p>
                    <p className="font-serif text-xl font-light">{C.venue}</p>
                    <p className="font-sans text-sm mt-0.5" style={{ color:"var(--muted)" }}>{C.address}</p>
                  </div>
                </div>
                <motion.a href={C.mapsUrl} target="_blank" rel="noreferrer" {...h} whileTap={{ scale:0.97 }}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 font-sans text-[10px] tracking-[0.3em] uppercase border transition-all duration-300"
                  style={{ borderColor:"var(--border)", color:"var(--muted)" }}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.cssText+=";background:var(--ink);color:white;border-color:var(--ink)"}}
                  onMouseOut={e =>{(e.currentTarget as HTMLElement).style.cssText+=";background:transparent;color:var(--muted);border-color:var(--border)"}}>
                  <MapPin size={12} strokeWidth={1.6}/> Buka di Maps
                </motion.a>
              </div>
            </Card>
          </div>
        </section>

        {/* §6 AMPLOP DIGITAL */}
        <section className="py-24 px-4 max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Amplop Digital"/></motion.div>
            <motion.h2 variants={vUp} className="font-serif text-4xl md:text-5xl font-light" style={{ color:"var(--ink)" }}>Hadiah Pernikahan</motion.h2>
          </motion.div>
          <Card>
            <div className="p-9 md:p-12 flex flex-col items-center">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color:"var(--muted)", maxWidth:"30ch", margin:"0 auto 2.5rem" }}>
                Kehadiran Anda adalah hadiah yang paling berarti. Namun jika Anda ingin memberikan restu, Anda dapat melakukannya di sini.
              </p>
              {/* QRIS */}
              <div className="relative rounded-2xl overflow-hidden mb-8"
                style={{ width:"clamp(180px,55vw,220px)", height:"clamp(180px,55vw,220px)", background:"var(--cream)", border:"1px solid var(--border)", boxShadow:"0 8px 32px rgba(30,34,25,0.07)" }}>
                <Image src={C.qrisImg} alt="QRIS Payment" fill style={{ objectFit:"contain", padding:"6px" }}/>
              </div>
              {/* Both bank accounts */}
              <div className="w-full flex flex-col gap-3 mb-2">
                {/* Bride */}
                <div className="w-full text-center py-5 px-4 rounded-2xl" style={{ background:"var(--sage-p)" }}>
                  <p className="font-sans text-[8px] tracking-[0.44em] uppercase mb-1" style={{ color:"var(--sage)" }}>
                    {C.bankName} — Mempelai Wanita
                  </p>
                  <p className="font-serif text-xl tracking-[0.06em]" style={{ color:"var(--ink)" }}>{C.bankAccount}</p>
                  <p className="font-sans text-[11px] mt-1 italic" style={{ color:"var(--muted)" }}>a.n. {C.accountHolder}</p>
                  <CopyBtn text={C.bankAccount}/>
                </div>
                {/* Groom */}
                <div className="w-full text-center py-5 px-4 rounded-2xl" style={{ background:"var(--sage-p)" }}>
                  <p className="font-sans text-[8px] tracking-[0.44em] uppercase mb-1" style={{ color:"var(--sage)" }}>
                    {C.bankName2} — Mempelai Pria
                  </p>
                  <p className="font-serif text-xl tracking-[0.06em]" style={{ color:"var(--ink)" }}>{C.bankAccount2}</p>
                  <p className="font-sans text-[11px] mt-1 italic" style={{ color:"var(--muted)" }}>a.n. {C.accountHolder2}</p>
                  <CopyBtn text={C.bankAccount2}/>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* §7 GUESTBOOK */}
        <section className="py-24 px-4 max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={vFast} className="text-center mb-14">
            <motion.div variants={vIn}><SectionBadge label="Ucapan & Doa"/></motion.div>
            <motion.h2 variants={vUp} className="font-serif text-4xl md:text-5xl font-light" style={{ color:"var(--ink)" }}>Kirim Ucapan</motion.h2>
          </motion.div>
          <Card>
            <div className="p-9 md:p-12">
              <p className="font-sans text-sm text-center leading-relaxed mb-10" style={{ color:"var(--muted)" }}>
                Kata-kata Anda adalah bunga yang mekar paling lama. Tuliskan ucapan Anda dan kami akan menerimanya dengan sepenuh hati.
              </p>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="thanks" initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                    className="flex flex-col items-center gap-4 py-12 text-center">
                    <motion.div animate={{ rotate:[0,10,-10,0], scale:[1,1.15,1] }} transition={{ duration:0.7, delay:0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background:"var(--sage-p)" }}>
                      <Sparkles size={24} strokeWidth={1.4} style={{ color:"var(--sage)" }}/>
                    </motion.div>
                    <p className="font-serif text-2xl font-light">Terima Kasih! 🙏</p>
                    <p className="font-sans text-sm" style={{ color:"var(--muted)" }}>Doa dan ucapan Anda telah terkirim. Kami sangat bersyukur.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onSubmit={handleWish} className="flex flex-col gap-8">
                    <Field id="f-name" label="Nama Anda"    value={name} onChange={setName} placeholder="mis. Budi & Keluarga"/>
                    <Field id="f-msg"  label="Ucapan & Doa" value={msg}  onChange={setMsg}  placeholder="Semoga selalu bahagia dan penuh berkah…" rows={4}/>
                    <motion.button type="submit" {...h} whileTap={{ scale:0.97 }}
                      className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 font-sans text-[10px] tracking-[0.34em] uppercase transition-colors duration-300"
                      style={{ background:"var(--ink)", color:"var(--cream)" }}
                      onMouseOver={e=>{(e.currentTarget as HTMLElement).style.background="var(--sage)"}}
                      onMouseOut={e =>{(e.currentTarget as HTMLElement).style.background="var(--ink)"}}>
                      <Send size={13} strokeWidth={1.6}/> Kirim via WhatsApp
                    </motion.button>
                    <p className="font-sans text-[9px] text-center" style={{ color:"#C0BEB4" }}>Pesan akan langsung dikirim ke WhatsApp mempelai.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </section>

        {/* §8 CLOSING */}
        <section className="py-28 px-6 text-center" style={{ background:"var(--cream)" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={vFast} className="flex flex-col items-center gap-5 max-w-sm mx-auto">
            <motion.div variants={vIn}><Gem/></motion.div>
            <motion.h2 variants={vUp} className="font-serif font-light"
              style={{ fontSize:"clamp(2.8rem,13vw,5rem)", letterSpacing:"-0.02em", color:"var(--ink)" }}>
              {C.groom} <span className="italic" style={{ color:"var(--sage)" }}>&</span> {C.bride}
            </motion.h2>
            <motion.p variants={vUp} className="font-sans text-[9px] tracking-[0.48em] uppercase" style={{ color:"var(--light)" }}>{C.dateFormal}</motion.p>
            <motion.div variants={vIn}><Gem/></motion.div>
            <motion.p variants={vUp} className="font-serif text-lg italic" style={{ color:"var(--muted)" }}>Dengan cinta &amp; rasa syukur yang tak terhingga.</motion.p>
          </motion.div>
        </section>

        {/* §9 STICKY RSVP */}
        <motion.div initial={{ y:120 }} animate={{ y:0 }} transition={{ delay:3.5, type:"spring", stiffness:52, damping:16 }}
          className="fixed bottom-0 inset-x-0 z-[9000]">
          <div className="w-full border-t"
            style={{ background:"rgba(250,248,243,0.88)", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)", borderColor:"rgba(236,234,227,0.95)", boxShadow:"0 -8px 36px rgba(30,34,25,0.06)" }}>
            <div className="max-w-md mx-auto flex gap-3 px-4 pt-3" style={{ paddingBottom:"calc(0.75rem + env(safe-area-inset-bottom,0px))" }}>
              <motion.a
                href={`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(`✨ *Konfirmasi Kehadiran*\n\nAssalamualaikum,\n\nSaya menyatakan *hadir* di pernikahan *${C.groomFull}* & *${C.brideFull}*.\n\n📅 ${C.date}\n🕌 ${C.venue}\n\nSalam hangat,`)}`}
                target="_blank" rel="noreferrer" {...h} whileTap={{ scale:0.97 }}
                className="attend-pulse flex-1 flex items-center justify-center gap-2 rounded-2xl py-[15px] font-sans text-[10px] tracking-[0.28em] uppercase"
                style={{ background:"var(--ink)", color:"var(--cream)" }}>
                <Heart size={11} fill="currentColor" strokeWidth={0}/> Konfirmasi Hadir
              </motion.a>
              <motion.a
                href={`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(`Assalamualaikum,\n\nMohon maaf, saya tidak dapat hadir di pernikahan *${C.groomFull}* & *${C.brideFull}*.\n\nSemoga acara berjalan lancar dan penuh berkah. 🤲`)}`}
                target="_blank" rel="noreferrer" {...h} whileTap={{ scale:0.97 }}
                className="flex-shrink-0 flex items-center justify-center rounded-2xl py-[15px] px-5 font-sans text-[10px] tracking-[0.28em] uppercase border transition-all duration-300"
                style={{ borderColor:"var(--border)", color:"var(--muted)", background:"transparent" }}>
                Tidak Hadir
              </motion.a>
            </div>
          </div>
        </motion.div>

      </main>
    </>
  );
}