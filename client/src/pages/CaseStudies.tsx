/* Case Studies Page — Archival Prestige Design
 * Filterable case study explorer with detailed cards
 */
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Filter, TrendingUp, Clock, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

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

const caseStudiesData = [
  {
    id: 1,
    tag: "government",
    industryEn: "Government",
    industryTh: "ภาครัฐ",
    clientEn: "Ministry of Finance, Thailand",
    clientTh: "กระทรวงการคลัง ประเทศไทย",
    titleEn: "Digitizing 40 Years of Financial Records",
    titleTh: "แปลงบันทึกทางการเงิน 40 ปีสู่ดิจิทัล",
    summaryEn: "Complete digitization of 12 million financial documents spanning four decades, enabling instant retrieval and regulatory compliance.",
    summaryTh: "การแปลงดิจิทัลเอกสารทางการเงิน 12 ล้านฉบับครอบคลุมสี่ทศวรรษ ทำให้ค้นหาได้ทันทีและปฏิบัติตามกฎระเบียบ",
    results: [
      { icon: TrendingUp, valueEn: "85% faster", valueTh: "เร็วขึ้น 85%", labelEn: "Document retrieval", labelTh: "การค้นหาเอกสาร" },
      { icon: DollarSign, valueEn: "60% reduction", valueTh: "ลดลง 60%", labelEn: "Storage costs", labelTh: "ต้นทุนการจัดเก็บ" },
      { icon: Shield, valueEn: "100%", valueTh: "100%", labelEn: "Compliance rate", labelTh: "อัตราการปฏิบัติตาม" },
    ],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    duration: "18 months",
    volume: "12M documents",
  },
  {
    id: 2,
    tag: "finance",
    industryEn: "Finance & Banking",
    industryTh: "การเงินและธนาคาร",
    clientEn: "Major Thai Commercial Bank",
    clientTh: "ธนาคารพาณิชย์ชั้นนำของไทย",
    titleEn: "Microfilm Archive Conversion for Regulatory Compliance",
    titleTh: "แปลงไมโครฟิล์มเพื่อการปฏิบัติตามกฎระเบียบ BOT",
    summaryEn: "Converting 30 years of banking microfilm archives to digital format while maintaining regulatory compliance with Bank of Thailand requirements.",
    summaryTh: "การแปลงไมโครฟิล์มธนาคาร 30 ปีเป็นรูปแบบดิจิทัลในขณะที่รักษาการปฏิบัติตามข้อกำหนดของธนาคารแห่งประเทศไทย",
    results: [
      { icon: Clock, valueEn: "3 min → 10 sec", valueTh: "3 นาที → 10 วินาที", labelEn: "Retrieval time", labelTh: "เวลาค้นหา" },
      { icon: Shield, valueEn: "100%", valueTh: "100%", labelEn: "BOT compliance", labelTh: "การปฏิบัติตาม BOT" },
      { icon: TrendingUp, valueEn: "8M reels", valueTh: "8 ล้านม้วน", labelEn: "Processed", labelTh: "ที่ดำเนินการ" },
    ],
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    duration: "24 months",
    volume: "8M microfilm reels",
  },
  {
    id: 3,
    tag: "education",
    industryEn: "Heritage & Education",
    industryTh: "มรดกวัฒนธรรมและการศึกษา",
    clientEn: "National Library of Thailand",
    clientTh: "หอสมุดแห่งชาติ",
    titleEn: "Preservation of 500-Year-Old Palm Leaf Manuscripts",
    titleTh: "การอนุรักษ์สมุดข่อยอายุ 500 ปี",
    summaryEn: "Expert conservation and digitization of 12,000 rare palm leaf manuscripts, creating a permanent digital archive accessible to researchers worldwide.",
    summaryTh: "การอนุรักษ์และแปลงดิจิทัลสมุดข่อยหายากจำนวน 12,000 เล่ม สร้างคลังดิจิทัลถาวรที่นักวิจัยทั่วโลกสามารถเข้าถึงได้",
    results: [
      { icon: Shield, valueEn: "12,000", valueTh: "12,000 เล่ม", labelEn: "Manuscripts preserved", labelTh: "ต้นฉบับที่อนุรักษ์" },
      { icon: TrendingUp, valueEn: "Global access", valueTh: "เข้าถึงได้ทั่วโลก", labelEn: "Digital availability", labelTh: "ความพร้อมดิจิทัล" },
      { icon: Clock, valueEn: "500+ years", valueTh: "500+ ปี", labelEn: "Preservation lifespan", labelTh: "อายุการอนุรักษ์" },
    ],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/ancient-documents_9032e276.jpg",
    duration: "36 months",
    volume: "12,000 manuscripts",
  },
  {
    id: 4,
    tag: "healthcare",
    industryEn: "Healthcare",
    industryTh: "สาธารณสุข",
    clientEn: "Leading Thai Hospital Group",
    clientTh: "กลุ่มโรงพยาบาลชั้นนำของไทย",
    titleEn: "Electronic Medical Records Workflow Implementation",
    titleTh: "การใช้งาน Workflow บันทึกทางการแพทย์อิเล็กทรอนิกส์",
    summaryEn: "Complete transformation from paper-based patient records to an intelligent electronic workflow system across 15 hospital branches.",
    summaryTh: "การเปลี่ยนแปลงสมบูรณ์จากบันทึกผู้ป่วยบนกระดาษเป็นระบบ workflow อิเล็กทรอนิกส์อัจฉริยะใน 15 สาขาโรงพยาบาล",
    results: [
      { icon: Clock, valueEn: "92% faster", valueTh: "เร็วขึ้น 92%", labelEn: "Record retrieval", labelTh: "การค้นหาบันทึก" },
      { icon: Shield, valueEn: "Zero", valueTh: "ศูนย์", labelEn: "Compliance violations", labelTh: "การละเมิดการปฏิบัติตาม" },
      { icon: DollarSign, valueEn: "฿45M saved", valueTh: "ประหยัด ฿45M", labelEn: "Annual savings", labelTh: "ประหยัดต่อปี" },
    ],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    duration: "12 months",
    volume: "3M patient records",
  },
  {
    id: 5,
    tag: "enterprise",
    industryEn: "Enterprise",
    industryTh: "องค์กรธุรกิจ",
    clientEn: "Thai Petrochemical Corporation",
    clientTh: "บริษัทปิโตรเคมีไทย",
    titleEn: "Engineering Document Management System",
    titleTh: "ระบบจัดการเอกสารวิศวกรรม",
    summaryEn: "Centralized management of 500,000+ engineering drawings, technical specifications, and compliance documents with version control.",
    summaryTh: "การจัดการแบบรวมศูนย์ของแบบวิศวกรรม ข้อกำหนดทางเทคนิค และเอกสารการปฏิบัติตามกว่า 500,000 ฉบับพร้อมการควบคุมเวอร์ชัน",
    results: [
      { icon: TrendingUp, valueEn: "75% faster", valueTh: "เร็วขึ้น 75%", labelEn: "Document access", labelTh: "การเข้าถึงเอกสาร" },
      { icon: Shield, valueEn: "ISO 9001", valueTh: "ISO 9001", labelEn: "Certification achieved", labelTh: "การรับรองที่ได้รับ" },
      { icon: DollarSign, valueEn: "500K+", valueTh: "500K+", labelEn: "Documents managed", labelTh: "เอกสารที่จัดการ" },
    ],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    duration: "9 months",
    volume: "500K+ documents",
  },
  {
    id: 6,
    tag: "government",
    industryEn: "Government",
    industryTh: "ภาครัฐ",
    clientEn: "Provincial Land Office",
    clientTh: "สำนักงานที่ดินจังหวัด",
    titleEn: "Land Title Document Digitization Project",
    titleTh: "โครงการแปลงดิจิทัลเอกสารโฉนดที่ดิน",
    summaryEn: "Digitization and indexing of 2 million land title documents, enabling online access for citizens and reducing processing time from weeks to minutes.",
    summaryTh: "การแปลงดิจิทัลและจัดทำดัชนีเอกสารโฉนดที่ดิน 2 ล้านฉบับ ทำให้ประชาชนเข้าถึงออนไลน์ได้และลดเวลาดำเนินการจากสัปดาห์เป็นนาที",
    results: [
      { icon: Clock, valueEn: "Weeks → Minutes", valueTh: "สัปดาห์ → นาที", labelEn: "Processing time", labelTh: "เวลาดำเนินการ" },
      { icon: TrendingUp, valueEn: "2M+", valueTh: "2M+", labelEn: "Documents digitized", labelTh: "เอกสารที่แปลงดิจิทัล" },
      { icon: Shield, valueEn: "Online access", valueTh: "เข้าถึงออนไลน์", labelEn: "Citizen service", labelTh: "บริการประชาชน" },
    ],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    duration: "15 months",
    volume: "2M documents",
  },
];

const filterTags = ["all", "government", "finance", "healthcare", "education", "enterprise"];

export default function CaseStudies() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeFilter === "all"
    ? caseStudiesData
    : caseStudiesData.filter((cs) => cs.tag === activeFilter);

  const filterLabels: Record<string, string> = {
    all: t("caseStudies.filter.all"),
    government: t("caseStudies.filter.government"),
    finance: t("caseStudies.filter.finance"),
    healthcare: t("caseStudies.filter.healthcare"),
    education: t("caseStudies.filter.education"),
    enterprise: t("caseStudies.filter.enterprise"),
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
                {language === "en" ? "Proven Results" : "ผลลัพธ์ที่พิสูจน์แล้ว"}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-4xl lg:text-5xl mb-4">
              {t("caseStudies.title")}
            </h1>
            <p className="text-[oklch(0.70_0.01_250)] font-body text-lg max-w-2xl">
              {t("caseStudies.subtitle")}
            </p>
          </FadeUp>

          {/* Stats */}
          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              {[
                { value: "500+", label: language === "en" ? "Projects Completed" : "โครงการที่เสร็จสิ้น" },
                { value: "50M+", label: language === "en" ? "Documents Processed" : "เอกสารที่ดำเนินการ" },
                { value: "25+", label: language === "en" ? "Industries Served" : "อุตสาหกรรมที่ให้บริการ" },
                { value: "98%", label: language === "en" ? "Client Retention" : "การรักษาลูกค้า" },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 border-[oklch(0.72_0.12_75)] pl-4">
                  <div className="font-display font-bold text-white text-2xl">{stat.value}</div>
                  <p className="text-xs text-[oklch(0.60_0.01_250)] font-body mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Filter + Case Studies */}
      <section className="py-16 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <FadeUp>
            <div className="flex items-center gap-2 mb-10 flex-wrap">
              <Filter size={14} className="text-[oklch(0.52_0.02_250)]" />
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-sm text-sm font-body font-medium transition-all ${
                    activeFilter === tag
                      ? "bg-[oklch(0.22_0.06_250)] text-white"
                      : "bg-white border border-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] hover:border-[oklch(0.72_0.12_75/0.4)]"
                  }`}
                >
                  {filterLabels[tag]}
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Case Study Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cs, i) => (
              <FadeUp key={cs.id} delay={i * 0.08}>
                <div
                  className="bg-white border border-[oklch(0.88_0.015_75)] rounded-sm overflow-hidden hover:border-[oklch(0.72_0.12_75/0.4)] hover:shadow-[0_8px_40px_oklch(0.22_0.06_250/0.08)] transition-all duration-300 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === cs.id ? null : cs.id)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={cs.image} alt={language === "en" ? cs.titleEn : cs.titleTh}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.06_250/0.6)] to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] text-[10px] font-body font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                        {language === "en" ? cs.industryEn : cs.industryTh}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[oklch(0.52_0.02_250)] font-body mb-1.5">
                      {language === "en" ? cs.clientEn : cs.clientTh}
                    </p>
                    <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base leading-snug mb-3">
                      {language === "en" ? cs.titleEn : cs.titleTh}
                    </h3>

                    {expandedId === cs.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <p className="text-sm text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-4">
                          {language === "en" ? cs.summaryEn : cs.summaryTh}
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {cs.results.map((result, ri) => (
                            <div key={ri} className="bg-[oklch(0.97_0.008_75)] p-2.5 rounded-sm text-center">
                              <result.icon size={14} className="text-[oklch(0.72_0.12_75)] mx-auto mb-1" />
                              <div className="font-display font-bold text-[oklch(0.22_0.06_250)] text-xs leading-tight">
                                {language === "en" ? result.valueEn : result.valueTh}
                              </div>
                              <p className="text-[10px] text-[oklch(0.52_0.02_250)] font-body mt-0.5 leading-tight">
                                {language === "en" ? result.labelEn : result.labelTh}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3 text-xs text-[oklch(0.52_0.02_250)] font-body">
                          <span>{language === "en" ? "Duration:" : "ระยะเวลา:"} {cs.duration}</span>
                          <span>·</span>
                          <span>{language === "en" ? "Volume:" : "ปริมาณ:"} {cs.volume}</span>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-3 flex items-center gap-1 text-xs font-body font-semibold text-[oklch(0.72_0.12_75)]">
                      <CheckCircle size={12} />
                      <span>{language === "en" ? cs.results[0].valueEn : cs.results[0].valueTh} {language === "en" ? cs.results[0].labelEn : cs.results[0].labelTh}</span>
                    </div>
                  </div>
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
              {language === "en" ? "Ready to Write Your Success Story?" : "พร้อมที่จะสร้างความสำเร็จของคุณ?"}
            </h2>
            <p className="text-[oklch(0.70_0.01_250)] font-body mb-6 max-w-lg mx-auto">
              {language === "en"
                ? "Join 500+ organizations that have transformed their document operations with Roter Thailand."
                : "เข้าร่วมกับองค์กรกว่า 500 แห่งที่เปลี่ยนแปลงการดำเนินงานเอกสารด้วยโรเตอร์ (ประเทศไทย)"}
            </p>
            <Link href="/contact">
              <Button className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold px-8">
                {t("nav.getConsultation")} <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
