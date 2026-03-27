/* Insights Page — Archival Prestige Design
 * Knowledge center with articles, reports, and analyst insights
 */
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Download, FileText, TrendingUp, Calendar, Tag } from "lucide-react";
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

const insightsData = [
  {
    id: 1,
    type: "report",
    tagEn: "Industry Report",
    tagTh: "รายงานอุตสาหกรรม",
    titleEn: "Thailand Document Management Market Report 2025",
    titleTh: "รายงานตลาดการจัดการเอกสารไทย 2568",
    summaryEn: "Comprehensive analysis of the Thai document management market, including digitization trends, regulatory changes, and growth forecasts through 2028.",
    summaryTh: "การวิเคราะห์ตลาดการจัดการเอกสารไทยอย่างครอบคลุม รวมถึงแนวโน้มการแปลงดิจิทัล การเปลี่ยนแปลงกฎระเบียบ และการคาดการณ์การเติบโตถึงปี 2571",
    date: "March 2025",
    readTime: "45 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    featured: true,
    downloadable: true,
  },
  {
    id: 2,
    type: "article",
    tagEn: "Best Practices",
    tagTh: "แนวปฏิบัติที่ดีที่สุด",
    titleEn: "PDPA Compliance Through Document Management: A Practical Guide",
    titleTh: "การปฏิบัติตาม PDPA ผ่านการจัดการเอกสาร: คู่มือปฏิบัติ",
    summaryEn: "How Thai organizations can achieve PDPA compliance through systematic document management, retention policies, and secure destruction protocols.",
    summaryTh: "วิธีที่องค์กรไทยสามารถบรรลุการปฏิบัติตาม PDPA ผ่านการจัดการเอกสารอย่างเป็นระบบ นโยบายการเก็บรักษา และโปรโตคอลการทำลายที่ปลอดภัย",
    date: "February 2025",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    featured: false,
    downloadable: false,
  },
  {
    id: 3,
    type: "whitepaper",
    tagEn: "White Paper",
    tagTh: "เอกสารวิชาการ",
    titleEn: "Microfilm vs. Digital: The Case for Hybrid Archival Strategy",
    titleTh: "ไมโครฟิล์มเทียบกับดิจิทัล: กรณีสำหรับกลยุทธ์การจัดเก็บแบบผสม",
    summaryEn: "An evidence-based analysis of why leading institutions combine microfilm and digital storage for optimal long-term document preservation.",
    summaryTh: "การวิเคราะห์ที่อิงหลักฐานว่าทำไมสถาบันชั้นนำจึงรวมไมโครฟิล์มและการจัดเก็บดิจิทัลเพื่อการอนุรักษ์เอกสารระยะยาวที่เหมาะสม",
    date: "January 2025",
    readTime: "20 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/services-microfilm_a37fc826.jpg",
    featured: false,
    downloadable: true,
  },
  {
    id: 4,
    type: "article",
    tagEn: "Technology",
    tagTh: "เทคโนโลยี",
    titleEn: "AI-Powered OCR: Transforming Document Digitization Accuracy",
    titleTh: "OCR ที่ขับเคลื่อนด้วย AI: การเปลี่ยนแปลงความแม่นยำในการแปลงดิจิทัลเอกสาร",
    summaryEn: "How artificial intelligence is revolutionizing optical character recognition, achieving 99.9% accuracy even for handwritten Thai documents.",
    summaryTh: "ปัญญาประดิษฐ์กำลังปฏิวัติการรู้จำตัวอักษรด้วยแสงอย่างไร บรรลุความแม่นยำ 99.9% แม้สำหรับเอกสารภาษาไทยที่เขียนด้วยลายมือ",
    date: "December 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    featured: false,
    downloadable: false,
  },
  {
    id: 5,
    type: "report",
    tagEn: "Analyst Report",
    tagTh: "รายงานนักวิเคราะห์",
    titleEn: "ROI Analysis: Document Digitization in Thai Government Agencies",
    titleTh: "การวิเคราะห์ ROI: การแปลงดิจิทัลเอกสารในหน่วยงานรัฐบาลไทย",
    summaryEn: "Quantitative analysis of return on investment from document digitization projects across 50 Thai government agencies over 5 years.",
    summaryTh: "การวิเคราะห์เชิงปริมาณของผลตอบแทนจากการลงทุนจากโครงการแปลงดิจิทัลเอกสารใน 50 หน่วยงานรัฐบาลไทยในช่วง 5 ปี",
    date: "November 2024",
    readTime: "30 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
    featured: false,
    downloadable: true,
  },
  {
    id: 6,
    type: "article",
    tagEn: "Heritage",
    tagTh: "มรดกวัฒนธรรม",
    titleEn: "Preserving Thailand's Cultural Heritage: Digital Conservation Methods",
    titleTh: "การอนุรักษ์มรดกวัฒนธรรมไทย: วิธีการอนุรักษ์ดิจิทัล",
    summaryEn: "Expert perspectives on combining traditional conservation techniques with modern digitization to preserve Thailand's irreplaceable historical documents.",
    summaryTh: "มุมมองของผู้เชี่ยวชาญในการผสมผสานเทคนิคการอนุรักษ์แบบดั้งเดิมกับการแปลงดิจิทัลสมัยใหม่เพื่ออนุรักษ์เอกสารประวัติศาสตร์ที่ไม่สามารถทดแทนได้ของไทย",
    date: "October 2024",
    readTime: "15 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/ancient-documents_9032e276.jpg",
    featured: false,
    downloadable: false,
  },
];

const typeFilters = ["all", "article", "report", "whitepaper"];

export default function Insights() {
  const { t, language } = useLanguage();
  const [activeType, setActiveType] = useState("all");

  const filtered = activeType === "all"
    ? insightsData
    : insightsData.filter((item) => item.type === activeType);

  const featured = insightsData.find((item) => item.featured);
  const rest = insightsData.filter((item) => !item.featured);

  const typeLabels: Record<string, string> = {
    all: language === "en" ? "All Content" : "เนื้อหาทั้งหมด",
    article: language === "en" ? "Articles" : "บทความ",
    report: language === "en" ? "Reports" : "รายงาน",
    whitepaper: language === "en" ? "White Papers" : "เอกสารวิชาการ",
  };

  const typeColors: Record<string, string> = {
    report: "bg-[oklch(0.22_0.06_250)] text-white",
    article: "bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)]",
    whitepaper: "bg-[oklch(0.38_0.005_250)] text-white",
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
                {language === "en" ? "Knowledge Center" : "ศูนย์ความรู้"}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-4xl lg:text-5xl mb-4">
              {t("insights.title")}
            </h1>
            <p className="text-[oklch(0.70_0.01_250)] font-body text-lg max-w-2xl">
              {t("insights.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-12 bg-white border-b border-[oklch(0.88_0.015_75)]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="relative rounded-sm overflow-hidden aspect-video shadow-[0_20px_60px_oklch(0.22_0.06_250/0.15)]">
                  <img src={featured.image} alt={language === "en" ? featured.titleEn : featured.titleTh}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.06_250/0.4)] to-transparent" />
                  <span className="absolute top-4 left-4 bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] text-[10px] font-body font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                    {language === "en" ? "Featured" : "แนะนำ"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-body font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm ${typeColors[featured.type]}`}>
                      {language === "en" ? featured.tagEn : featured.tagTh}
                    </span>
                    <span className="text-xs text-[oklch(0.52_0.02_250)] font-body flex items-center gap-1">
                      <Calendar size={11} /> {featured.date}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl lg:text-3xl mb-4 leading-tight">
                    {language === "en" ? featured.titleEn : featured.titleTh}
                  </h2>
                  <p className="text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-6">
                    {language === "en" ? featured.summaryEn : featured.summaryTh}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => toast.info(language === "en" ? "Full report coming soon" : "รายงานฉบับเต็มเร็วๆ นี้")}
                      className="bg-[oklch(0.22_0.06_250)] text-white hover:bg-[oklch(0.28_0.07_250)] font-body font-medium text-sm"
                    >
                      {t("insights.readMore")} <ArrowRight size={14} className="ml-2" />
                    </Button>
                    {featured.downloadable && (
                      <Button
                        variant="outline"
                        onClick={() => toast.success(language === "en" ? "Download started" : "เริ่มดาวน์โหลดแล้ว")}
                        className="border-[oklch(0.22_0.06_250)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.22_0.06_250)] hover:text-white font-body font-medium text-sm"
                      >
                        <Download size={14} className="mr-2" /> {t("insights.downloadReport")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* Filter + Articles */}
      <section className="py-16 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex items-center gap-2 mb-10 flex-wrap">
              <Tag size={14} className="text-[oklch(0.52_0.02_250)]" />
              {typeFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2 rounded-sm text-sm font-body font-medium transition-all ${
                    activeType === type
                      ? "bg-[oklch(0.22_0.06_250)] text-white"
                      : "bg-white border border-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] hover:border-[oklch(0.72_0.12_75/0.4)]"
                  }`}
                >
                  {typeLabels[type]}
                </button>
              ))}
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.filter((item) => !item.featured || activeType !== "all").map((item, i) => (
              <FadeUp key={item.id} delay={i * 0.08}>
                <div className="bg-white border border-[oklch(0.88_0.015_75)] rounded-sm overflow-hidden hover:border-[oklch(0.72_0.12_75/0.4)] hover:shadow-[0_8px_40px_oklch(0.22_0.06_250/0.08)] transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.image} alt={language === "en" ? item.titleEn : item.titleTh}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] font-body font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${typeColors[item.type]}`}>
                        {language === "en" ? item.tagEn : item.tagTh}
                      </span>
                      <span className="text-xs text-[oklch(0.52_0.02_250)] font-body">{item.readTime}</span>
                    </div>
                    <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base leading-snug mb-2">
                      {language === "en" ? item.titleEn : item.titleTh}
                    </h3>
                    <p className="text-xs text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-4 line-clamp-2">
                      {language === "en" ? item.summaryEn : item.summaryTh}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[oklch(0.52_0.02_250)] font-body flex items-center gap-1">
                        <Calendar size={11} /> {item.date}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toast.info(language === "en" ? "Article coming soon" : "บทความเร็วๆ นี้")}
                          className="text-xs font-body font-semibold text-[oklch(0.72_0.12_75)] hover:text-[oklch(0.60_0.14_75)] flex items-center gap-1 transition-colors"
                        >
                          {t("insights.readMore")} <ArrowRight size={12} />
                        </button>
                        {item.downloadable && (
                          <button
                            onClick={() => toast.success(language === "en" ? "Download started" : "เริ่มดาวน์โหลดแล้ว")}
                            className="text-xs font-body font-semibold text-[oklch(0.52_0.02_250)] hover:text-[oklch(0.22_0.06_250)] flex items-center gap-1 transition-colors"
                          >
                            <Download size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-[oklch(0.22_0.06_250)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="max-w-xl mx-auto text-center">
              <BookOpen size={32} className="text-[oklch(0.72_0.12_75)] mx-auto mb-4" />
              <h2 className="font-display font-bold text-white text-2xl lg:text-3xl mb-3">
                {language === "en" ? "Stay Ahead with Expert Insights" : "ก้าวนำด้วยข้อมูลเชิงลึกจากผู้เชี่ยวชาญ"}
              </h2>
              <p className="text-[oklch(0.70_0.01_250)] font-body mb-6">
                {language === "en"
                  ? "Receive our monthly digest of document management trends, regulatory updates, and best practices."
                  : "รับสรุปรายเดือนเกี่ยวกับแนวโน้มการจัดการเอกสาร การอัปเดตกฎระเบียบ และแนวปฏิบัติที่ดีที่สุด"}
              </p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder={language === "en" ? "Your email address" : "ที่อยู่อีเมลของคุณ"}
                  className="flex-1 bg-[oklch(0.28_0.07_250)] border border-[oklch(0.72_0.12_75/0.3)] rounded-sm px-4 py-2.5 text-sm text-white placeholder-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.12_75)] transition-colors"
                />
                <Button
                  onClick={() => toast.success(language === "en" ? "Subscribed successfully!" : "สมัครสมาชิกสำเร็จ!")}
                  className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold px-5 shrink-0"
                >
                  {language === "en" ? "Subscribe" : "สมัคร"}
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
