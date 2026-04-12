/* Products Page — Archival Prestige Design
 * Specialized document management equipment and software
 */
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Filter, Star, Package, Monitor, Archive, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const categories = ["all", "scanners", "microfilm", "software", "archival", "accessories"];

const products = [
  {
    id: 1,
    category: "scanners",
    name: "DocuScan Pro 9000",
    nameEn: "DocuScan Pro 9000",
    nameTh: "DocuScan Pro 9000",
    descEn: "High-speed production scanner for large-volume document digitization. 200 ppm duplex scanning with advanced image processing.",
    descTh: "เครื่องสแกนผลิตความเร็วสูงสำหรับการแปลงเอกสารปริมาณมาก สแกนสองหน้า 200 หน้าต่อนาที พร้อมการประมวลผลภาพขั้นสูง",
    specs: ["200 ppm duplex", "600 DPI optical", "A3 flatbed", "Auto document feeder"],
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80",
    badge: "Best Seller",
    price: "Contact for pricing",
  },
  {
    id: 2,
    category: "scanners",
    name: "OverSize Scan 4800",
    nameEn: "OverSize Scan 4800",
    nameTh: "OverSize Scan 4800",
    descEn: "Large format scanner for maps, blueprints, and oversized documents up to A0 size with 1200 DPI resolution.",
    descTh: "เครื่องสแกนรูปแบบขนาดใหญ่สำหรับแผนที่ พิมพ์เขียว และเอกสารขนาดใหญ่ถึง A0 ด้วยความละเอียด 1200 DPI",
    specs: ["A0 format", "1200 DPI", "Contact image sensor", "USB 3.0"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: null,
    price: "Contact for pricing",
  },
  {
    id: 3,
    category: "microfilm",
    name: "MicroReader Elite 3000",
    nameEn: "MicroReader Elite 3000",
    nameTh: "MicroReader Elite 3000",
    descEn: "Professional microfilm reader-scanner for 16mm and 35mm film with digital output capabilities and LED illumination.",
    descTh: "เครื่องอ่านและสแกนไมโครฟิล์มระดับมืออาชีพสำหรับฟิล์ม 16mm และ 35mm พร้อมความสามารถในการส่งออกดิจิทัลและไฟ LED",
    specs: ["16mm & 35mm", "LED illumination", "Digital output", "Motorized transport"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    badge: "New",
    price: "Contact for pricing",
  },
  {
    id: 4,
    category: "microfilm",
    name: "COM Writer Pro",
    nameEn: "COM Writer Pro",
    nameTh: "COM Writer Pro",
    descEn: "Computer Output Microfilm (COM) recorder for converting digital files to archival-grade microfilm at 1800 DPI.",
    descTh: "เครื่องบันทึก COM สำหรับแปลงไฟล์ดิจิทัลเป็นไมโครฟิล์มระดับหอจดหมายเหตุที่ 1800 DPI",
    specs: ["1800 DPI output", "16mm & 35mm", "Network ready", "High-speed processing"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    badge: null,
    price: "Contact for pricing",
  },
  {
    id: 5,
    category: "software",
    name: "RoterDMS Enterprise",
    nameEn: "RoterDMS Enterprise",
    nameTh: "RoterDMS Enterprise",
    descEn: "Comprehensive document management system with workflow automation, full-text search, and enterprise integration capabilities.",
    descTh: "ระบบจัดการเอกสารครบวงจรพร้อมระบบอัตโนมัติ workflow การค้นหาข้อความเต็ม และความสามารถในการผสานรวมองค์กร",
    specs: ["Unlimited users", "AI-powered search", "API integration", "Cloud or on-premise"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    badge: "Featured",
    price: "From ฿150,000/year",
  },
  {
    id: 6,
    category: "software",
    name: "RoterOCR Pro",
    nameEn: "RoterOCR Pro",
    nameTh: "RoterOCR Pro",
    descEn: "Advanced OCR software with Thai language support, table recognition, and batch processing for high-volume digitization.",
    descTh: "ซอฟต์แวร์ OCR ขั้นสูงพร้อมรองรับภาษาไทย การรู้จำตาราง และการประมวลผลแบบ batch สำหรับการแปลงดิจิทัลปริมาณมาก",
    specs: ["Thai language OCR", "Table recognition", "Batch processing", "99.9% accuracy"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    badge: null,
    price: "From ฿45,000/year",
  },
  {
    id: 7,
    category: "archival",
    name: "Archival Storage System",
    nameEn: "Archival Storage System",
    nameTh: "ระบบจัดเก็บระดับหอจดหมายเหตุ",
    descEn: "Complete archival storage solution including acid-free boxes, folders, and climate-controlled cabinet systems.",
    descTh: "โซลูชันการจัดเก็บระดับหอจดหมายเหตุครบวงจร รวมถึงกล่อง โฟลเดอร์ปราศจากกรด และระบบตู้ควบคุมสภาพอากาศ",
    specs: ["Acid-free materials", "Climate control", "Fire resistant", "Archival-grade storage"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    badge: null,
    price: "Contact for pricing",
  },
  {
    id: 8,
    category: "accessories",
    name: "Document Handling Kit",
    nameEn: "Document Handling Kit",
    nameTh: "ชุดอุปกรณ์จัดการเอกสาร",
    descEn: "Professional kit for handling fragile and historical documents including cotton gloves, spatulas, and magnification tools.",
    descTh: "ชุดอุปกรณ์มืออาชีพสำหรับจัดการเอกสารที่เปราะบางและทางประวัติศาสตร์ รวมถึงถุงมือฝ้าย ไม้พาย และเครื่องมือขยาย",
    specs: ["Cotton gloves", "Microspatulas", "Magnification loupe", "Archival tissue"],
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    badge: null,
    price: "From ฿2,500",
  },
];

export default function Products() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const categoryLabels: Record<string, string> = {
    all: language === "en" ? "All Products" : "สินค้าทั้งหมด",
    scanners: language === "en" ? "Scanners" : "เครื่องสแกน",
    microfilm: language === "en" ? "Microfilm Equipment" : "อุปกรณ์ไมโครฟิล์ม",
    software: language === "en" ? "Software" : "ซอฟต์แวร์",
    archival: language === "en" ? "Archival Supplies" : "อุปกรณ์จัดเก็บ",
    accessories: language === "en" ? "Accessories" : "อุปกรณ์เสริม",
  };

  const categoryIcons: Record<string, any> = {
    all: Layers, scanners: Monitor, microfilm: Archive, software: Package, archival: Archive, accessories: Package,
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[oklch(0.22_0.06_250)] pt-28 pb-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
              <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                {language === "en" ? "Equipment & Software" : "อุปกรณ์และซอฟต์แวร์"}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-4xl lg:text-5xl mb-4">
              {t("products.title")}
            </h1>
            <p className="text-[oklch(0.70_0.01_250)] font-body text-lg max-w-2xl">
              {t("products.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Filter + Products */}
      <section className="py-16 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <FadeUp>
            <div className="flex items-center gap-2 mb-10 flex-wrap">
              <Filter size={14} className="text-[oklch(0.52_0.02_250)]" />
              {categories.map((cat) => {
                const Icon = categoryIcons[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-body font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-[oklch(0.22_0.06_250)] text-white shadow-sm"
                        : "bg-white border border-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] hover:border-[oklch(0.72_0.12_75/0.4)]"
                    }`}
                  >
                    <Icon size={13} />
                    {categoryLabels[cat]}
                  </button>
                );
              })}
            </div>
          </FadeUp>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <FadeUp key={product.id} delay={i * 0.06}>
                <div className="group bg-white border border-[oklch(0.88_0.015_75)] rounded-sm overflow-hidden hover:border-[oklch(0.72_0.12_75/0.4)] hover:shadow-[0_8px_40px_oklch(0.22_0.06_250/0.08)] transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className={`absolute top-3 left-3 text-[10px] font-body font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm ${
                        product.badge === "Featured" ? "bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)]" :
                        product.badge === "New" ? "bg-[oklch(0.22_0.06_250)] text-white" :
                        "bg-white text-[oklch(0.22_0.06_250)]"
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-body font-semibold tracking-widest uppercase text-[oklch(0.72_0.12_75)]">
                      {categoryLabels[product.category]}
                    </span>
                    <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mt-1 mb-2">
                      {language === "en" ? product.nameEn : product.nameTh}
                    </h3>
                    <p className="text-xs text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-3 line-clamp-2">
                      {language === "en" ? product.descEn : product.descTh}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.specs.slice(0, 3).map((spec) => (
                        <span key={spec} className="text-[10px] bg-[oklch(0.97_0.008_75)] text-[oklch(0.38_0.005_250)] px-2 py-0.5 rounded-sm font-body">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-body font-semibold text-[oklch(0.22_0.06_250)]">{product.price}</span>
                      <button
                        onClick={() => toast.success(language === "en" ? "We'll contact you about this product" : "เราจะติดต่อคุณเกี่ยวกับสินค้านี้")}
                        className="text-xs font-body font-semibold text-[oklch(0.72_0.12_75)] hover:text-[oklch(0.60_0.14_75)] flex items-center gap-1 transition-colors"
                      >
                        {language === "en" ? "Inquire" : "สอบถาม"} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Products */}
      <section className="py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl lg:text-3xl mb-8 text-center">
              {language === "en" ? "Why Choose Roter Products?" : "ทำไมต้องเลือกสินค้าโรเตอร์?"}
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                    { icon: Star, title: language === "en" ? "Premium Quality" : "คุณภาพที่ยอดนิยม", desc: language === "en" ? "All products are carefully selected and tested for superior performance and reliability." : "สินค้าทั้งหมดถูกคัดเลือกและทดสอบเพื่อสร้างสุดยอด" },
              { icon: Package, title: language === "en" ? "Expert Support" : "การสนับสนุนจากผู้เชี่ยวชาญ", desc: language === "en" ? "Dedicated technical support team with 25+ years of industry experience." : "ทีมสนับสนุนด้านเทคนิคเฉพาะทางที่มีประสบการณ์กว่า 25 ปี" },
              { icon: Archive, title: language === "en" ? "Local Stock" : "สต็อกในประเทศ", desc: language === "en" ? "Products available in Thailand with fast delivery and local service." : "สินค้าพร้อมจำหน่ายในไทยพร้อมจัดส่งรวดเร็วและบริการในประเทศ" },
              { icon: Monitor, title: language === "en" ? "Training Included" : "รวมการฝึกอบรม", desc: language === "en" ? "Comprehensive training programs for all equipment and software purchases." : "โปรแกรมฝึกอบรมครบวงจรสำหรับการซื้ออุปกรณ์และซอฟต์แวร์ทั้งหมด" },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div className="text-center p-5">
                  <div className="w-12 h-12 rounded-sm bg-[oklch(0.22_0.06_250/0.06)] flex items-center justify-center mx-auto mb-4">
                    <item.icon size={22} className="text-[oklch(0.22_0.06_250)]" />
                  </div>
                  <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-[oklch(0.52_0.02_250)] font-body leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[oklch(0.22_0.06_250)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-bold text-white text-2xl lg:text-3xl mb-4">
              {language === "en" ? "Need Help Selecting the Right Equipment?" : "ต้องการความช่วยเหลือในการเลือกอุปกรณ์ที่เหมาะสม?"}
            </h2>
            <p className="text-[oklch(0.70_0.01_250)] font-body mb-6 max-w-lg mx-auto">
              {language === "en"
                ? "Our specialists will assess your requirements and recommend the optimal solution for your budget."
                : "ผู้เชี่ยวชาญของเราจะประเมินความต้องการและแนะนำโซลูชันที่เหมาะสมที่สุดสำหรับงบประมาณของคุณ"}
            </p>
            <Link href="/contact">
              <Button className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold px-8">
                {language === "en" ? "Get Expert Advice" : "รับคำแนะนำจากผู้เชี่ยวชาญ"} <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
