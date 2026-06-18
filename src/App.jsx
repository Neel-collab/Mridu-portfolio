import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Mail,
  Linkedin,
  Sparkles,
  MapPin,
  MonitorPlay,
  PenTool,
  Layers,
  X,
  Sun,
  Moon
} from "lucide-react";

/* ─── Animation Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

/* ─── Data ─── */
const projects = [
  { id: 1, title: "Botanical Skincare", tag: "Packaging Design", category: "Packaging", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop", desc: "A complete packaging overhaul focusing on sustainable materials and minimalist typography. Elevating the unboxing experience while communicating organic purity." },
  { id: 2, title: "Luxe Social Campaign", tag: "Social Media Design", category: "Digital", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop", desc: "A 30-day digital campaign featuring sleek motion graphics and high-contrast typography, resulting in a 45% increase in engagement." },
  { id: 3, title: "Artisan Coffee Co.", tag: "Branding & Identity", category: "Identity", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop", desc: "From logo creation to full brand guidelines, bridging heritage roasting techniques with modern café culture." },
  { id: 4, title: "Wellness A+ Content", tag: "Amazon A+ Content", category: "Strategy", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop", desc: "High-converting Amazon listing visuals utilizing lifestyle imagery and clean infographics to communicate product benefits instantly." },
  { id: 5, title: "Gourmet Delights", tag: "Catalogue Design", category: "Print", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop", desc: "A luxury food catalogue designed for high-end retail distributors, featuring bespoke editorial layouts." },
  { id: 6, title: "Bloom Cosmetics", tag: "Art Direction", category: "Art Direction", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop", desc: "Creative direction for a seasonal launch photoshoot, handling set design concepts and lighting moods." },
];

const heroImagesColumn1 = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop", // Abstract Art
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"  // Fluid Abstract
];

const heroImagesColumn2 = [
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop", // Minimalist Design
  "https://images.unsplash.com/photo-1500462918020-f16c47572e5f?q=80&w=800&auto=format&fit=crop"  // Vibrant Abstract
];

const categories = ["All", "Strategy", "Identity", "Packaging", "Digital", "Print", "Art Direction"];

const softwares = [
  { name: "Photoshop", icon: Layers },
  { name: "Illustrator", icon: PenTool },
  { name: "InDesign", icon: Layers },
  { name: "After Effects", icon: MonitorPlay },
  { name: "Premiere Pro", icon: MonitorPlay },
  { name: "Canva", icon: Sparkles }
];

const platformsList = ["Amazon", "Zepto", "Swiggy Instamart", "LinkedIn", "Google Ads", "First Cry", "Blinkit", "Meta", "Instagram"];

const brandsWorkedWith = ["Amazon", "Zepto", "Swiggy Instamart", "First Cry", "Blinkit"];

/* ─── Theme Helpers ─── */
const darkColors = {
  bg: "#050505",
  bgWarm: "#0a0a0a",
  bgCard: "#0d0d0d",
  bgDark: "#000000",
  bgElevated: "#111111",
  text: "#F7F7F7",
  textSecondary: "#A0A0A0",
  textTertiary: "#666666",
  textLight: "#FFFFFF",
  accent: "#2563EB",
  accentLight: "#60A5FA",
  border: "#222222",
  borderLight: "#333333",
};

const lightColors = {
  bg: "#F4F4F5",
  bgWarm: "#E4E4E7",
  bgCard: "#FFFFFF",
  bgDark: "#FFFFFF",
  bgElevated: "#FAFAFA",
  text: "#09090B",
  textSecondary: "#52525B",
  textTertiary: "#A1A1AA",
  textLight: "#09090B",
  accent: "#2563EB",
  accentLight: "#3B82F6",
  border: "#E4E4E7",
  borderLight: "#D4D4D8",
};

function useTheme(isDark) {
  return isDark ? darkColors : lightColors;
}

/* ─── CUSTOM CURSOR ─── */
function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices to avoid getting stuck
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .cursor-pointer')) setIsHovering(true);
      else setIsHovering(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
      style={{ zIndex: 99999 }}
      animate={{
        x: mousePos.x - (isHovering ? 24 : 10),
        y: mousePos.y - (isHovering ? 24 : 10),
        width: isHovering ? 48 : 20,
        height: isHovering ? 48 : 20,
        backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(160,160,160,0.8)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
    />
  );
}

/* ─── LOADING SCREEN ─── */
function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 999999, backgroundColor: "#050505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ width: 64, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, background: "#60A5FA" }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ color: "#666", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginTop: 24 }}
      >
        Loading
      </motion.p>
    </motion.div>
  );
}

/* ─── HEADER ─── */
function Header({ isDark, setIsDark, t }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
        backgroundColor: scrolled ? (isDark ? "rgba(5,5,5,0.85)" : "rgba(244,244,245,0.85)") : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        padding: scrolled ? "16px 0" : "24px 0",
        borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
        transition: "all 0.5s ease"
      }}
    >
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6%", maxWidth: 1600, margin: "0 auto" }}>
        <a href="#hero" style={{ color: t.textLight, fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", textDecoration: "none", cursor: "pointer" }}>
          Mridu Poddar
        </a>

        <button
          onClick={() => setIsDark(!isDark)}
          className="cursor-pointer"
          style={{
            position: "relative", width: 56, height: 28, borderRadius: 14,
            backgroundColor: t.border, border: `1px solid ${t.borderLight}`,
            display: "flex", alignItems: "center", padding: 3,
            cursor: "pointer", outline: "none",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)"
          }}
        >
          <motion.div
            layout
            style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.4)", zIndex: 2 }}
            animate={{ x: isDark ? 26 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {isDark ? <Moon style={{ width: 12, height: 12 }} /> : <Sun style={{ width: 12, height: 12 }} />}
          </motion.div>
          <Sun style={{ position: "absolute", left: 7, width: 11, height: 11, color: t.textTertiary }} />
          <Moon style={{ position: "absolute", right: 7, width: 11, height: 11, color: t.textTertiary }} />
        </button>
      </nav>
    </motion.header>
  );
}

/* ─── HERO (With Parallax Reveal Strips & Scroll-Pin) ─── */
function Hero({ t }) {
  const typeWords = ["SCALE", "SELL", "GROW", "LAUNCH", "EXPAND"];
  const [wordIndex, setWordIndex] = useState(0);

  const containerRef = useRef(null);
  // Target the outer 200vh container to track full pinning scroll progress
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.4, restDelta: 0.0001 });

  // Map translations to the first 50% of scroll progress (first 100vh scroll while Hero is pinned)
  // Left column goes DOWN (starts high at -45%, slides down to 5%)
  const y1 = useTransform(smoothProgress, [0, 0.5], ["-45%", "5%"]);
  // Right column goes UP (starts low at 5%, slides up to -45%)
  const y2 = useTransform(smoothProgress, [0, 0.5], ["5%", "-45%"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % typeWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} style={{ height: "200vh", position: "relative" }}>
      <section
        id="hero"
        className="sticky-section"
        style={{
          backgroundColor: t.bg,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          height: "100vh",
          position: "sticky",
          top: 0
        }}
      >
        <div className="ambient-glow glow-blue" style={{ width: 600, height: 600, top: "0%", right: "5%", position: "absolute" }} />
        <div className="ambient-glow glow-purple" style={{ width: 800, height: 800, bottom: "-20%", left: "-10%", position: "absolute" }} />

        <div style={{ position: "relative", zIndex: 10, padding: "0 6%", maxWidth: 1600, width: "100%", margin: "0 auto", height: "100vh", display: "flex", alignItems: "center" }}>
          
          {/* Left Side: Typography (100% on mobile, 55% on desktop) */}
          <div style={{ width: "100%", maxWidth: 700, flexShrink: 0, position: "relative", zIndex: 20 }}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.h1
                variants={fadeUp}
                custom={1}
                style={{
                  fontFamily: "Outfit, sans-serif", color: t.textLight,
                  fontSize: "clamp(2.5rem, 6.5vw, 6.5rem)",
                  fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.01em",
                  textAlign: "left",
                }}
              >
                Creative Solutions For{" "}
                <br className="hidden md:block" />
                Brands Ready To{" "}
                <span className="block md:inline-block" style={{ position: "relative", minWidth: 280, verticalAlign: "top" }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -24, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ position: "absolute", left: 0, top: 0, color: "#60A5FA", fontWeight: 700 }}
                    >
                      {typeWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                  <span style={{ visibility: "hidden", fontWeight: 700 }}>EXPAND</span>
                </span>
              </motion.h1>
            </motion.div>
          </div>

          {/* Right Side: Straight Parallax Reveal Strips (Hidden on mobile/tablet) */}
          <div className="hidden lg:flex" style={{ position: "absolute", right: "2%", top: "-25%", bottom: "-25%", width: "45%", gap: 24, transform: "rotate(-5deg)", opacity: 0.85 }}>
            
            {/* Column 1 (Scrolls Down) */}
            <motion.div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, y: y1, willChange: "transform" }}>
              {heroImagesColumn1.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ width: "100%", height: "42vh", borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", border: `1px solid ${t.border}` }}
                >
                  <img src={src} alt="Portfolio Sample" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </motion.div>
              ))}
            </motion.div>

            {/* Column 2 (Scrolls Up) */}
            <motion.div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, y: y2, willChange: "transform" }}>
              {heroImagesColumn2.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ width: "100%", height: "42vh", borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", border: `1px solid ${t.border}` }}
                >
                  <img src={src} alt="Portfolio Sample" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </motion.div>
              ))}
            </motion.div>
            
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 48, left: "6%", display: "flex", alignItems: "center", gap: 12, zIndex: 30 }}>
          <div className="animate-scroll-bounce">
            <ArrowDown style={{ width: 14, height: 14, color: t.textTertiary }} />
          </div>
          <span style={{ color: t.textTertiary, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500 }}>Scroll to Discover</span>
        </div>
      </section>
    </div>
  );
}


/* ─── WRITEUP ─── */
function Writeup({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="sticky-section"
      style={{ backgroundColor: t.bgWarm, zIndex: 20, display: "flex", flexDirection: "column", justifyItems: "center", justifyContent: "center", padding: "100px 0", borderTop: `1px solid ${t.border}` }}
    >
      <div style={{ padding: "0 6%", maxWidth: 1600, width: "100%", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          style={{ maxWidth: 900 }}
        >
          <h2 style={{ fontFamily: "Outfit, sans-serif", color: t.textLight, fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 48 }}>
            Hey!
          </h2>

          <p style={{ color: t.textLight, fontSize: "clamp(1.25rem, 3vw, 2.25rem)", fontWeight: 300, lineHeight: 1.4, marginBottom: 32 }}>
            In a world crowded with content, I specialise in building design systems that help brands scale consistently across channels, teams, and touchpoints.
          </p>
          <p style={{ color: t.textSecondary, fontSize: "clamp(1rem, 1.5vw, 1.25rem)", fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
            From translating brand essence into structured visual languages to ensuring every asset aligns with a larger framework, my work goes beyond aesthetics; it enables speed, consistency and cohesion at scale.
          </p>
          <p style={{ color: t.textSecondary, fontSize: "clamp(1rem, 1.5vw, 1.25rem)", fontWeight: 300, lineHeight: 1.7 }}>
            Working at the intersection of storytelling and system thinking, I help brands move from scattered execution to unified, scalable communication.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SELECTED WORK ─── */
function SelectedWork({ t }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filteredProjects = projects.filter(p => activeFilter === "All" || p.category === activeFilter);

  useEffect(() => {
    if (selectedProject) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
  }, [selectedProject]);

  return (
    <section
      id="work"
      ref={ref}
      className="sticky-section"
      style={{ backgroundColor: t.bgCard, zIndex: 30, display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 0", borderTop: `1px solid ${t.border}` }}
    >
      <div style={{ padding: "0 6%", maxWidth: 1600, width: "100%", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 32 }}
        >
          <span style={{ color: t.textSecondary, fontSize: 11, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase" }}>Portfolio</span>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700, color: t.textLight, marginTop: 8 }}>
            Selected <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 400, color: t.textTertiary }}>Projects</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="cursor-pointer"
              style={{
                padding: "8px 20px", borderRadius: 20,
                border: `1px solid ${activeFilter === cat ? t.accentLight : t.border}`,
                backgroundColor: activeFilter === cat ? (t.accent + "18") : "transparent",
                color: activeFilter === cat ? t.accentLight : t.textSecondary,
                fontSize: 13, fontWeight: 500, letterSpacing: "0.05em",
                cursor: "pointer", outline: "none",
                transition: "all 0.3s ease",
                boxShadow: activeFilter === cat ? `0 0 12px rgba(96,165,250,0.2)` : "none"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid (Responsive Columns) */}
        <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} t={t} onClick={() => setSelectedProject(project)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }} onClick={() => setSelectedProject(null)} />
            <motion.div
              layoutId={`card-${selectedProject.id}`}
              style={{
                position: "relative", width: "100%", maxWidth: 1000, maxHeight: "90vh", overflowY: "auto",
                backgroundColor: t.bgCard, border: `1px solid ${t.border}`,
                borderRadius: 24, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", zIndex: 10,
                display: "flex", flexDirection: "column" // row on desktop handled via media query usually, but inline styles are tricky for media queries. We'll simulate row via flexWrap.
              }}
              className="md:flex-row overflow-hidden"
            >
              <button onClick={() => setSelectedProject(null)} className="cursor-pointer absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/90 hover:bg-black/60 hover:text-white transition-colors z-20 outline-none">
                <X style={{ width: 18, height: 18 }} />
              </button>
              
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto" style={{ backgroundColor: t.bgElevated, position: "relative", overflow: "hidden" }}>
                {/* Modal Sample Image */}
                <img src={selectedProject.image} alt={selectedProject.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 60%, ${t.bgCard} 100%)` }} className="md:hidden" />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, transparent 60%, ${t.bgCard} 100%)` }} className="hidden md:block" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <span style={{ color: t.accentLight, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{selectedProject.category}</span>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: t.textLight, marginTop: 12, marginBottom: 16, lineHeight: 1.1 }}>{selectedProject.title}</h3>
                <p style={{ color: t.textSecondary, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>{selectedProject.desc}</p>
                <div style={{ paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
                  <span style={{ color: t.textTertiary, fontSize: 12, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase" }}>{selectedProject.tag}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, t, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      layoutId={`card-${project.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer"
      style={{ cursor: "pointer" }}
    >
      <div className="premium-card" style={{ position: "relative", overflow: "hidden", borderRadius: 16, marginBottom: 16, border: `1px solid ${t.border}`, aspectRatio: "4/3" }}>
        
        {/* Sample Image */}
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          style={{ position: "absolute", inset: 0, backgroundColor: t.bgElevated }}
        >
          <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: hovered ? 0.8 : 0.4 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
        />
        
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{String(project.id).padStart(2, "0")}</span>
        </div>
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(37,99,235,0.3)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(96,165,250,0.4)", boxShadow: "0 0 20px rgba(96,165,250,0.3)" }}
        >
          <ArrowUpRight style={{ width: 22, height: 22, color: "#fff" }} />
        </motion.div>
      </div>
      <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: hovered ? "#60A5FA" : t.textLight, transition: "color 0.4s ease" }}>
        {project.title}
      </h3>
    </motion.article>
  );
}

/* ─── TOOLS, PLATFORMS & BRANDS ─── */
function ToolsPlatforms({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="tools"
      ref={ref}
      className="sticky-section"
      style={{ backgroundColor: t.bgWarm, zIndex: 40, display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 0", borderTop: `1px solid ${t.border}` }}
    >
      <div className="ambient-glow glow-blue" style={{ width: 800, height: 800, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.08 }} />

      <div style={{ padding: "0 6%", maxWidth: 1600, width: "100%", margin: "0 auto", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 48 }}
        >
          <span style={{ color: t.textSecondary, fontSize: 11, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase" }}>Capabilities</span>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700, color: t.textLight, marginTop: 8 }}>
            Tools, Platforms & Brands
          </h2>
        </motion.div>

        {/* Responsive CSS Grid (1 col mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Software */}
          <div>
            <h3 style={{ color: t.textLight, fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>Software Expertise</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {softwares.map((sw) => (
                <div
                  key={sw.name}
                  className="premium-card"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, backgroundColor: t.bg, border: `1px solid ${t.border}`, transition: "all 0.3s ease" }}
                >
                  <sw.icon style={{ width: 16, height: 16, color: t.textSecondary }} />
                  <span style={{ color: t.textLight, fontSize: 14, fontWeight: 500 }}>{sw.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 style={{ color: t.textLight, fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>Platforms Worked On</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {platformsList.map((platform) => (
                <span
                  key={platform}
                  className="premium-card"
                  style={{ padding: "10px 16px", borderRadius: 20, border: `1px solid ${t.border}`, color: t.textSecondary, fontSize: 14, fontWeight: 500, backgroundColor: t.bg, transition: "all 0.3s ease", cursor: "default" }}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 style={{ color: t.textLight, fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>Brands Worked With</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {brandsWorkedWith.map((brand) => (
                <span
                  key={brand}
                  className="premium-card"
                  style={{ padding: "10px 16px", borderRadius: 20, border: `1px solid ${t.border}`, color: t.textSecondary, fontSize: 14, fontWeight: 500, backgroundColor: t.bg, transition: "all 0.3s ease", cursor: "default" }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer({ t }) {
  return (
    <footer
      id="contact"
      className="sticky-section"
      style={{ backgroundColor: t.bgDark, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderTop: `1px solid ${t.border}` }}
    >
      <div className="ambient-glow glow-purple" style={{ width: 1000, height: 1000, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.08 }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "100%", padding: "0 6%" }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(3.5rem, 12vw, 10rem)", fontWeight: 700, lineHeight: 0.85, color: t.textLight, marginBottom: 64 }}>
          Let's <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 400, color: t.textTertiary }}>Talk</span>
        </h2>

        {/* 3 icons in a row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <a
            href="mailto:mridu.poddar2001@gmail.com"
            className="cursor-pointer"
            style={{ width: 64, height: 64, borderRadius: 32, border: `1px solid ${t.border}`, backgroundColor: t.bgCard, display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, textDecoration: "none", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#60A5FA"; e.currentTarget.style.borderColor = "#60A5FA"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <Mail style={{ width: 24, height: 24 }} />
          </a>
          <a
            href="https://www.linkedin.com/in/mridu-poddar?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank" rel="noopener noreferrer"
            className="cursor-pointer"
            style={{ width: 64, height: 64, borderRadius: 32, border: `1px solid ${t.border}`, backgroundColor: t.bgCard, display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, textDecoration: "none", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#60A5FA"; e.currentTarget.style.borderColor = "#60A5FA"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <Linkedin style={{ width: 24, height: 24 }} />
          </a>
          <div
            style={{ width: 64, height: 64, borderRadius: 32, border: `1px solid ${t.border}`, backgroundColor: t.bgCard, display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, position: "relative", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", cursor: "default" }}
            className="group"
            onMouseEnter={(e) => { e.currentTarget.style.color = "#60A5FA"; e.currentTarget.style.borderColor = "#60A5FA"; e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.querySelector('.tooltip').style.opacity = 1; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.querySelector('.tooltip').style.opacity = 0; }}
          >
            <MapPin style={{ width: 24, height: 24 }} />
            <div className="tooltip" style={{ position: "absolute", top: -40, backgroundColor: t.bgElevated, border: `1px solid ${t.border}`, color: t.textLight, fontSize: 12, padding: "6px 14px", borderRadius: 8, opacity: 0, transition: "opacity 0.3s ease", pointerEvents: "none", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              Mumbai, Maharashtra
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 32, width: "100%", display: "flex", justifyContent: "center" }}>
        <p style={{ color: t.textTertiary, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
          © {new Date().getFullYear()} Mridu Poddar
        </p>
      </div>
    </footer>
  );
}

/* ─── APP ─── */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const t = useTheme(isDark);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="grain-overlay"
      >
        <Header isDark={isDark} setIsDark={setIsDark} t={t} />

        <main style={{ position: "relative" }}>
          <Hero t={t} />
          <Writeup t={t} />
          <SelectedWork t={t} />
          <ToolsPlatforms t={t} />
        </main>

        <Footer t={t} />
      </motion.div>
    </>
  );
}
