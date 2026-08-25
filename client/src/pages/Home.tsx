/* Home Page — Archival Prestige Design
 * Hero: Full-bleed navy overlay on archive image, Playfair Display headline
 * Stats: Animated counters in ivory section
 * Services Preview: Card grid with gold accents
 * Conversion Diagram: Interactive SVG diagram
 * Results Dashboard: Recharts visualizations
 * Case Studies Preview: Filtered cards
 * CTA Section: Navy with gold
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  ArrowRight, FileText, Scan, Film, BookOpen, Workflow,
  RefreshCw, Users, Award, TrendingUp, ChevronRight,
  BarChart3, Shield, Clock, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Fade Up Animation Wrapper ─────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Service Card ──────────────────────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, desc, href }: { icon: any; title: string; desc: string; href: string }) {
  return (
    <Link href={href}>
      <div className="group bg-white border border-[oklch(0.88_0.015_75)] rounded-sm p-6 hover:border-[oklch(0.72_0.12_75/0.5)] hover:shadow-[0_8px_40px_oklch(0.22_0.06_250/0.08)] transition-all duration-300 cursor-pointer h-full">
        <div className="w-10 h-10 rounded-sm bg-[oklch(0.22_0.06_250/0.06)] flex items-center justify-center mb-4 group-hover:bg-[oklch(0.72_0.12_75/0.12)] transition-colors">
          <Icon size={20} className="text-[oklch(0.22_0.06_250)] group-hover:text-[oklch(0.60_0.14_75)] transition-colors" />
        </div>
        <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-[oklch(0.52_0.02_250)] leading-relaxed">{desc}</p>
        <div className="mt-4 flex items-center gap-1 text-xs font-body font-semibold text-[oklch(0.60_0.14_75)] opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Learn more</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

// ── Conversion Diagram ────────────────────────────────────────────────────────
function ConversionDiagram() {
  const { t } = useLanguage();
  const [activeArrow, setActiveArrow] = useState<string | null>(null);

  const arrowInfo: Record<string, { title: string; desc: string }> = {
    "paper-to-electronic": {
      title: "Paper → Electronic",
      desc: "High-resolution scanning with OCR, indexing, and quality assurance. Output formats: PDF/A, TIFF, JPEG2000.",
    },
    "electronic-to-paper": {
      title: "Electronic → Paper",
      desc: "High-fidelity printing and reproduction of digital documents to archival-grade paper.",
    },
    "electronic-to-microfilm": {
      title: "Electronic → Microfilm",
      desc: "COM (Computer Output Microfilm) conversion for long-term archival storage with 100+ year lifespan.",
    },
    "microfilm-to-electronic": {
      title: "Microfilm → Electronic",
      desc: "Precision microfilm scanning with image enhancement, straightening, and metadata extraction.",
    },
    "paper-to-microfilm": {
      title: "Paper → Microfilm",
      desc: "Direct document filming for space-efficient, long-term preservation compliant with ISO standards.",
    },
    "microfilm-to-paper": {
      title: "Microfilm → Paper",
      desc: "High-quality microfilm printing and enlargement to paper format for accessibility.",
    },
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 500 320" className="w-full max-w-2xl mx-auto" style={{ overflow: "visible" }}>
        {/* Nodes */}
        {/* Paper */}
        <g>
          <rect x="30" y="120" width="120" height="80" rx="4" fill="oklch(0.22 0.06 250)" />
          <text x="90" y="152" textAnchor="middle" fill="oklch(0.72 0.12 75)" fontSize="11" fontFamily="Playfair Display, serif" fontWeight="600">
            {t("conversion.paper")}
          </text>
          <text x="90" y="170" textAnchor="middle" fill="oklch(0.85 0.01 250)" fontSize="9" fontFamily="Source Sans 3, sans-serif">
            Documents
          </text>
          <FileText x="76" y="178" width="28" height="28" color="oklch(0.72 0.12 75)" />
        </g>

        {/* Electronic */}
        <g>
          <rect x="190" y="20" width="120" height="80" rx="4" fill="oklch(0.22 0.06 250)" />
          <text x="250" y="52" textAnchor="middle" fill="oklch(0.72 0.12 75)" fontSize="11" fontFamily="Playfair Display, serif" fontWeight="600">
            {t("conversion.electronic")}
          </text>
          <text x="250" y="70" textAnchor="middle" fill="oklch(0.85 0.01 250)" fontSize="9" fontFamily="Source Sans 3, sans-serif">
            Digital Files
          </text>
        </g>

        {/* Microfilm */}
        <g>
          <rect x="350" y="120" width="120" height="80" rx="4" fill="oklch(0.22 0.06 250)" />
          <text x="410" y="152" textAnchor="middle" fill="oklch(0.72 0.12 75)" fontSize="11" fontFamily="Playfair Display, serif" fontWeight="600">
            {t("conversion.microfilm")}
          </text>
          <text x="410" y="170" textAnchor="middle" fill="oklch(0.85 0.01 250)" fontSize="9" fontFamily="Source Sans 3, sans-serif">
            Archive Film
          </text>
        </g>

        {/* Arrows */}
        {/* Paper → Electronic */}
        <g
          className="cursor-pointer"
          onClick={() => setActiveArrow(activeArrow === "paper-to-electronic" ? null : "paper-to-electronic")}
        >
          <path d="M 150 140 Q 190 80 190 80" stroke={activeArrow === "paper-to-electronic" ? "oklch(0.72 0.12 75)" : "oklch(0.72 0.12 75 / 0.5)"} strokeWidth="2" fill="none" markerEnd="url(#arrowGold)" />
          <rect x="148" y="100" width="44" height="18" rx="3" fill="oklch(0.97 0.008 75)" stroke="oklch(0.72 0.12 75 / 0.3)" strokeWidth="1" />
          <text x="170" y="113" textAnchor="middle" fill="oklch(0.38 0.005 250)" fontSize="8" fontFamily="Source Sans 3, sans-serif">Scan</text>
        </g>

        {/* Electronic → Paper */}
        <g
          className="cursor-pointer"
          onClick={() => setActiveArrow(activeArrow === "electronic-to-paper" ? null : "electronic-to-paper")}
        >
          <path d="M 190 100 Q 150 160 150 160" stroke={activeArrow === "electronic-to-paper" ? "oklch(0.72 0.12 75)" : "oklch(0.72 0.12 75 / 0.5)"} strokeWidth="2" fill="none" markerEnd="url(#arrowGold)" strokeDasharray="5,3" />
          <rect x="145" y="128" width="44" height="18" rx="3" fill="oklch(0.97 0.008 75)" stroke="oklch(0.72 0.12 75 / 0.3)" strokeWidth="1" />
          <text x="167" y="141" textAnchor="middle" fill="oklch(0.38 0.005 250)" fontSize="8" fontFamily="Source Sans 3, sans-serif">Print</text>
        </g>

        {/* Electronic → Microfilm */}
        <g
          className="cursor-pointer"
          onClick={() => setActiveArrow(activeArrow === "electronic-to-microfilm" ? null : "electronic-to-microfilm")}
        >
          <path d="M 310 80 Q 350 140 350 140" stroke={activeArrow === "electronic-to-microfilm" ? "oklch(0.72 0.12 75)" : "oklch(0.72 0.12 75 / 0.5)"} strokeWidth="2" fill="none" markerEnd="url(#arrowGold)" />
          <rect x="308" y="100" width="44" height="18" rx="3" fill="oklch(0.97 0.008 75)" stroke="oklch(0.72 0.12 75 / 0.3)" strokeWidth="1" />
          <text x="330" y="113" textAnchor="middle" fill="oklch(0.38 0.005 250)" fontSize="8" fontFamily="Source Sans 3, sans-serif">COM</text>
        </g>

        {/* Microfilm → Electronic */}
        <g
          className="cursor-pointer"
          onClick={() => setActiveArrow(activeArrow === "microfilm-to-electronic" ? null : "microfilm-to-electronic")}
        >
          <path d="M 350 160 Q 310 100 310 100" stroke={activeArrow === "microfilm-to-electronic" ? "oklch(0.72 0.12 75)" : "oklch(0.72 0.12 75 / 0.5)"} strokeWidth="2" fill="none" markerEnd="url(#arrowGold)" strokeDasharray="5,3" />
          <rect x="308" y="128" width="44" height="18" rx="3" fill="oklch(0.97 0.008 75)" stroke="oklch(0.72 0.12 75 / 0.3)" strokeWidth="1" />
          <text x="330" y="141" textAnchor="middle" fill="oklch(0.38 0.005 250)" fontSize="8" fontFamily="Source Sans 3, sans-serif">Scan</text>
        </g>

        {/* Paper → Microfilm */}
        <g
          className="cursor-pointer"
          onClick={() => setActiveArrow(activeArrow === "paper-to-microfilm" ? null : "paper-to-microfilm")}
        >
          <path d="M 150 200 Q 250 260 350 200" stroke={activeArrow === "paper-to-microfilm" ? "oklch(0.72 0.12 75)" : "oklch(0.72 0.12 75 / 0.5)"} strokeWidth="2" fill="none" markerEnd="url(#arrowGold)" />
          <rect x="218" y="248" width="64" height="18" rx="3" fill="oklch(0.97 0.008 75)" stroke="oklch(0.72 0.12 75 / 0.3)" strokeWidth="1" />
          <text x="250" y="261" textAnchor="middle" fill="oklch(0.38 0.005 250)" fontSize="8" fontFamily="Source Sans 3, sans-serif">Film</text>
        </g>

        {/* Microfilm → Paper */}
        <g
          className="cursor-pointer"
          onClick={() => setActiveArrow(activeArrow === "microfilm-to-paper" ? null : "microfilm-to-paper")}
        >
          <path d="M 350 220 Q 250 280 150 220" stroke={activeArrow === "microfilm-to-paper" ? "oklch(0.72 0.12 75)" : "oklch(0.72 0.12 75 / 0.5)"} strokeWidth="2" fill="none" markerEnd="url(#arrowGold)" strokeDasharray="5,3" />
          <rect x="218" y="270" width="64" height="18" rx="3" fill="oklch(0.97 0.008 75)" stroke="oklch(0.72 0.12 75 / 0.3)" strokeWidth="1" />
          <text x="250" y="283" textAnchor="middle" fill="oklch(0.38 0.005 250)" fontSize="8" fontFamily="Source Sans 3, sans-serif">Print</text>
        </g>

        {/* Arrow Marker */}
        <defs>
          <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="oklch(0.72 0.12 75)" />
          </marker>
        </defs>
      </svg>

      {/* Info Panel */}
      {activeArrow && arrowInfo[activeArrow] && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-[oklch(0.22_0.06_250)] rounded-sm border-l-2 border-[oklch(0.72_0.12_75)]"
        >
          <h4 className="font-display font-semibold text-[oklch(0.72_0.12_75)] text-sm mb-1">
            {arrowInfo[activeArrow].title}
          </h4>
          <p className="text-xs text-[oklch(0.75_0.01_250)] leading-relaxed">
            {arrowInfo[activeArrow].desc}
          </p>
        </motion.div>
      )}
      {!activeArrow && (
        <p className="text-center text-xs text-[oklch(0.52_0.02_250)] mt-3 font-body italic">
          {t("conversion.click")}
        </p>
      )}
    </div>
  );
}

// ── Main Home Component ───────────────────────────────────────────────────────
export default function Home() {
  const { t, language } = useLanguage();

  const stats = [
    { value: 100, suffix: "+", label: t("hero.stat.clients") },
    { value: 50, suffix: "M+", label: t("hero.stat.documents") },
    { value: 35, suffix: "+", label: t("hero.stat.years") },
    { value: 98, suffix: "%", label: t("hero.stat.satisfaction") },
  ];

  const services = [
    { icon: Scan, title: t("services.scanning.title"), desc: t("services.scanning.desc"), href: "/services#scanning" },
    { icon: FileText, title: t("services.electronic.title"), desc: t("services.electronic.desc"), href: "/services#electronic" },
    { icon: Film, title: t("services.microfilm.title"), desc: t("services.microfilm.desc"), href: "/services#microfilm" },
    { icon: BookOpen, title: t("services.ancient.title"), desc: t("services.ancient.desc"), href: "/services#ancient" },
    { icon: Workflow, title: t("services.workflow.title"), desc: t("services.workflow.desc"), href: "/services#workflow" },
    { icon: RefreshCw, title: t("services.conversion.title"), desc: t("services.conversion.desc"), href: "/services#conversion" },
  ];

  const efficiencyData = [
    { month: "Before", value: 100 },
    { month: "Month 3", value: 145 },
    { month: "Month 6", value: 198 },
    { month: "Month 12", value: 267 },
    { month: "Month 18", value: 340 },
  ];

  const industryData = [
    { name: language === "en" ? "Government" : "ภาครัฐ", value: 35, color: "oklch(0.22 0.06 250)" },
    { name: language === "en" ? "Finance" : "การเงิน", value: 28, color: "oklch(0.72 0.12 75)" },
    { name: language === "en" ? "Healthcare" : "สาธารณสุข", value: 18, color: "oklch(0.38 0.005 250)" },
    { name: language === "en" ? "Education" : "การศึกษา", value: 12, color: "oklch(0.60 0.14 75)" },
    { name: language === "en" ? "Enterprise" : "องค์กร", value: 7, color: "oklch(0.50 0.08 250)" },
  ];

  const caseStudies = [
    {
      industry: language === "en" ? "Government" : "ภาครัฐ",
      client: language === "en" ? "Ministry of Finance" : "กระทรวงการคลัง",
      title: language === "en"
        ? "Digitizing 40 Years of Financial Records"
        : "แปลงบันทึกทางการเงิน 40 ปีสู่ดิจิทัล",
      result: language === "en" ? "85% faster retrieval" : "ค้นหาเร็วขึ้น 85%",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
      tag: "government",
    },
    {
      industry: language === "en" ? "Finance" : "การเงิน",
      client: language === "en" ? "Major Thai Bank" : "ธนาคารพาณิชย์ชั้นนำ",
      title: language === "en"
        ? "Microfilm Archive Conversion for Regulatory Compliance"
        : "แปลงไมโครฟิล์มเพื่อการปฏิบัติตามกฎระเบียบ",
      result: language === "en" ? "100% compliance achieved" : "ปฏิบัติตามกฎระเบียบ 100%",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80",
      tag: "finance",
    },
    {
      industry: language === "en" ? "Heritage" : "มรดกวัฒนธรรม",
      client: language === "en" ? "National Library of Thailand" : "หอสมุดแห่งชาติ",
      title: language === "en"
        ? "Preservation of 500-Year-Old Palm Leaf Manuscripts"
        : "อนุรักษ์สมุดข่อยอายุ 500 ปี",
      result: language === "en" ? "12,000 manuscripts preserved" : "อนุรักษ์ต้นฉบับ 12,000 เล่ม",
      image: "/images/ancient-documents.svg",
      tag: "education",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-main.svg"
            alt="Document archive"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.05_250/0.95)] via-[oklch(0.14_0.05_250/0.80)] to-[oklch(0.14_0.05_250/0.40)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-10 bg-[oklch(0.72_0.12_75)]" />
              <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                {language === "en" ? "Roter (Thailand) Company Limited" : "บริษัท โรเตอร์ (ประเทศไทย) จำกัด"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            >
              {t("hero.tagline")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-[oklch(0.80_0.01_250)] text-lg leading-relaxed mb-8 font-body"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/services">
                <Button className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold px-6 py-3 h-auto text-sm tracking-wide">
                  {t("hero.cta.primary")}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>

            </motion.div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[oklch(0.97_0.008_75)] to-transparent" />
      </section>

      {/* ── STATS SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.97_0.008_75)] py-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-display font-bold text-[oklch(0.22_0.06_250)] text-4xl lg:text-5xl mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="h-px w-8 bg-[oklch(0.72_0.12_75)] mx-auto mb-2" />
                  <p className="text-sm font-body text-[oklch(0.52_0.02_250)]">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
                <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {language === "en" ? "What We Do" : "สิ่งที่เราทำ"}
                </span>
              </div>
              <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-3xl lg:text-4xl mb-4">
                {t("services.title")}
              </h2>
              <p className="text-[oklch(0.52_0.02_250)] font-body leading-relaxed">
                {t("services.subtitle")}
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <FadeUp key={svc.title} delay={i * 0.08}>
                <ServiceCard {...svc} />
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3} className="mt-10 text-center">
            <Link href="/services">
              <Button variant="outline" className="border-[oklch(0.22_0.06_250)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.22_0.06_250)] hover:text-white font-body font-medium px-8">
                {language === "en" ? "View All Services" : "ดูบริการทั้งหมด"}
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── CONVERSION DIAGRAM SECTION ────────────────────────────────────── */}
      <section className="py-20 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
                <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {language === "en" ? "Media Conversion" : "การแปลงสื่อ"}
                </span>
              </div>
              <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-3xl lg:text-4xl mb-4">
                {t("conversion.title")}
              </h2>
              <p className="text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-6">
                {t("conversion.subtitle")}
              </p>
              <div className="space-y-3">
                {[
                  { icon: RefreshCw, text: language === "en" ? "Fully bidirectional — convert in any direction" : "แปลงได้ทุกทิศทาง ไม่มีข้อจำกัด" },
                  { icon: Shield, text: language === "en" ? "ISO-compliant archival standards" : "มาตรฐาน ISO สำหรับการจัดเก็บระยะยาว" },
                  { icon: CheckCircle, text: language === "en" ? "Quality assurance at every conversion step" : "การประกันคุณภาพทุกขั้นตอน" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon size={16} className="text-[oklch(0.72_0.12_75)] shrink-0" />
                    <span className="text-sm font-body text-[oklch(0.38_0.005_250)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <ConversionDiagram />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── RESULTS DASHBOARD ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[oklch(0.22_0.06_250)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
                <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {language === "en" ? "Client Results" : "ผลลัพธ์ลูกค้า"}
                </span>
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
              </div>
              <h2 className="font-display font-bold text-white text-3xl lg:text-4xl mb-4">
                {t("results.title")}
              </h2>
              <p className="text-[oklch(0.70_0.01_250)] font-body max-w-xl mx-auto">
                {t("results.subtitle")}
              </p>
            </div>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Efficiency Chart */}
            <FadeUp delay={0.1}>
              <div className="bg-[oklch(0.28_0.07_250)] rounded-sm p-6 border border-[oklch(0.72_0.12_75/0.15)]">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-[oklch(0.72_0.12_75)]" />
                  <h3 className="font-display font-semibold text-white text-sm">
                    {language === "en" ? "Operational Efficiency Over Time" : "ประสิทธิภาพการดำเนินงานตามเวลา"}
                  </h3>
                </div>
                <p className="text-xs text-[oklch(0.60_0.01_250)] mb-4 font-body">
                  {language === "en" ? "Average across 100+ enterprise clients" : "ค่าเฉลี่ยจากลูกค้าองค์กรกว่า 100 ราย"}
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={efficiencyData}>
                    <defs>
                      <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.72 0.12 75 / 0.1)" />
                    <XAxis dataKey="month" tick={{ fill: "oklch(0.60 0.01 250)", fontSize: 11, fontFamily: "Source Sans 3" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "oklch(0.60 0.01 250)", fontSize: 11, fontFamily: "Source Sans 3" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.22 0.06 250)", border: "1px solid oklch(0.72 0.12 75 / 0.3)", borderRadius: "4px", color: "white", fontFamily: "Source Sans 3" }}
                    />
                    <Area type="monotone" dataKey="value" stroke="oklch(0.72 0.12 75)" fill="url(#effGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </FadeUp>

            {/* Industry Distribution */}
            <FadeUp delay={0.2}>
              <div className="bg-[oklch(0.28_0.07_250)] rounded-sm p-6 border border-[oklch(0.72_0.12_75/0.15)]">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={16} className="text-[oklch(0.72_0.12_75)]" />
                  <h3 className="font-display font-semibold text-white text-sm">
                    {language === "en" ? "Client Distribution by Industry" : "การกระจายลูกค้าตามอุตสาหกรรม"}
                  </h3>
                </div>
                <p className="text-xs text-[oklch(0.60_0.01_250)] mb-4 font-body">
                  {language === "en" ? "Percentage of total enterprise clients" : "สัดส่วนของลูกค้าองค์กรทั้งหมด"}
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={industryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.72 0.12 75 / 0.1)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "oklch(0.60 0.01 250)", fontSize: 11, fontFamily: "Source Sans 3" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.75 0.01 250)", fontSize: 11, fontFamily: "Source Sans 3" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.22 0.06 250)", border: "1px solid oklch(0.72 0.12 75 / 0.3)", borderRadius: "4px", color: "white", fontFamily: "Source Sans 3" }}
                      formatter={(value) => [`${value}%`, ""]}
                    />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {industryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </FadeUp>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { icon: TrendingUp, value: "240%", label: t("results.efficiency") },
              { icon: Clock, value: "62%", label: t("results.costReduction") },
              { icon: BarChart3, value: "85%", label: t("results.retrievalTime") },
              { icon: Award, value: "99.8%", label: t("results.compliance") },
            ].map((kpi, i) => (
              <FadeUp key={kpi.label} delay={i * 0.08}>
                <div className="bg-[oklch(0.28_0.07_250)] rounded-sm p-5 border border-[oklch(0.72_0.12_75/0.15)] text-center">
                  <kpi.icon size={20} className="text-[oklch(0.72_0.12_75)] mx-auto mb-2" />
                  <div className="font-display font-bold text-white text-2xl mb-1">{kpi.value}</div>
                  <p className="text-xs text-[oklch(0.60_0.01_250)] font-body leading-tight">{kpi.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-office.svg"
            alt="Office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[oklch(0.14_0.05_250/0.92)]" />
        </div>
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="h-px w-16 bg-[oklch(0.72_0.12_75)] mx-auto mb-6" />
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl mb-4">
              {language === "en"
                ? "Ready to Transform Your Document Operations?"
                : "พร้อมเปลี่ยนแปลงการจัดการเอกสารของคุณ?"}
            </h2>
            <p className="text-[oklch(0.75_0.01_250)] font-body text-lg max-w-xl mx-auto mb-8">
              {language === "en"
                ? "Speak with our specialists to design a tailored document management solution for your organization."
                : "พูดคุยกับผู้เชี่ยวชาญของเราเพื่อออกแบบโซลูชันการจัดการเอกสารที่เหมาะกับองค์กรของคุณ"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold px-8 py-3 h-auto">
                  {t("nav.getConsultation")}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-body font-medium px-8 py-3 h-auto bg-transparent">
                  {language === "en" ? "Explore Services" : "สำรวจบริการ"}
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
