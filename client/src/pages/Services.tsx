/* Services Page — Archival Prestige Design
 * Full service breakdown with interactive workflow diagram
 * Navy hero, ivory content sections, gold accents
 */
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Scan, FileText, Film, BookOpen, Workflow, RefreshCw,
  Users, Briefcase, ArrowRight, CheckCircle, ChevronDown
} from "lucide-react";
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

interface ServiceDetailProps {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  reverse?: boolean;
}

function ServiceDetail({ id, icon: Icon, title, subtitle, description, features, image, reverse }: ServiceDetailProps) {
  return (
    <div id={id} className={`grid lg:grid-cols-2 gap-12 items-center py-16 border-b border-[oklch(0.88_0.015_75)] last:border-0 ${reverse ? "lg:grid-flow-dense" : ""}`}>
      <FadeUp className={reverse ? "lg:col-start-2" : ""}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-sm bg-[oklch(0.22_0.06_250/0.08)] flex items-center justify-center">
            <Icon size={20} className="text-[oklch(0.22_0.06_250)]" />
          </div>
          <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">{subtitle}</span>
        </div>
        <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl lg:text-3xl mb-4">{title}</h2>
        <p className="text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-6">{description}</p>
        <ul className="space-y-2.5 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle size={15} className="text-[oklch(0.72_0.12_75)] mt-0.5 shrink-0" />
              <span className="text-sm font-body text-[oklch(0.38_0.005_250)]">{f}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <Link href={`/services/${id}`}>
            <Button className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.72_0.12_75/0.9)] font-body font-medium text-sm">
              Learn More <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-[oklch(0.22_0.06_250)] text-white hover:bg-[oklch(0.28_0.07_250)] font-body font-medium text-sm">
              Request This Service <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </div>
      </FadeUp>
      <FadeUp delay={0.15} className={reverse ? "lg:col-start-1 lg:row-start-1" : ""}>
        <div className="relative rounded-sm overflow-hidden aspect-[4/3] shadow-[0_20px_60px_oklch(0.22_0.06_250/0.15)]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.06_250/0.3)] to-transparent" />
        </div>
      </FadeUp>
    </div>
  );
}

// Workflow Diagram
function WorkflowDiagram() {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: language === "en" ? "Assessment" : "ประเมินความต้องการ",
      desc: language === "en" ? "We analyze your document inventory, condition, and requirements to design the optimal solution." : "วิเคราะห์คลังเอกสาร สภาพ และความต้องการเพื่อออกแบบโซลูชันที่เหมาะสม",
    },
    {
      num: "02",
      title: language === "en" ? "Planning" : "วางแผนโครงการ",
      desc: language === "en" ? "Detailed project plan with timeline, resource allocation, quality standards, and compliance requirements." : "แผนโครงการโดยละเอียดพร้อมกำหนดเวลา การจัดสรรทรัพยากร มาตรฐานคุณภาพ และข้อกำหนดการปฏิบัติตาม",
    },
    {
      num: "03",
      title: language === "en" ? "Processing" : "ดำเนินการ",
      desc: language === "en" ? "Expert execution using specialized equipment and trained professionals with real-time quality monitoring." : "ดำเนินการโดยผู้เชี่ยวชาญด้วยอุปกรณ์เฉพาะทางและการตรวจสอบคุณภาพแบบเรียลไทม์",
    },
    {
      num: "04",
      title: language === "en" ? "Quality Assurance" : "ประกันคุณภาพ",
      desc: language === "en" ? "Multi-stage QA process ensuring accuracy, completeness, and compliance with agreed standards." : "กระบวนการ QA หลายขั้นตอนเพื่อความถูกต้อง ครบถ้วน และสอดคล้องกับมาตรฐาน",
    },
    {
      num: "05",
      title: language === "en" ? "Delivery" : "ส่งมอบ",
      desc: language === "en" ? "Secure delivery with full documentation, training, and ongoing support to ensure successful adoption." : "ส่งมอบอย่างปลอดภัยพร้อมเอกสารครบถ้วน การฝึกอบรม และการสนับสนุนต่อเนื่อง",
    },
  ];

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-[oklch(0.72_0.12_75/0.3)] via-[oklch(0.72_0.12_75)] to-[oklch(0.72_0.12_75/0.3)] hidden md:block" />
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex gap-6 p-5 rounded-sm cursor-pointer transition-all duration-300 ${
              activeStep === i
                ? "bg-[oklch(0.22_0.06_250)] shadow-[0_8px_30px_oklch(0.22_0.06_250/0.2)]"
                : "bg-white border border-[oklch(0.88_0.015_75)] hover:border-[oklch(0.72_0.12_75/0.4)]"
            }`}
            onClick={() => setActiveStep(activeStep === i ? null : i)}
          >
            <div className={`w-12 h-12 rounded-sm flex items-center justify-center shrink-0 font-display font-bold text-sm transition-colors ${
              activeStep === i ? "bg-[oklch(0.72_0.12_75/0.2)] text-[oklch(0.72_0.12_75)]" : "bg-[oklch(0.22_0.06_250/0.06)] text-[oklch(0.22_0.06_250)]"
            }`}>
              {step.num}
            </div>
            <div className="flex-1">
              <h3 className={`font-display font-semibold text-base mb-1 transition-colors ${activeStep === i ? "text-white" : "text-[oklch(0.22_0.06_250)]"}`}>
                {step.title}
              </h3>
              {activeStep === i && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-[oklch(0.75_0.01_250)] font-body leading-relaxed">
                  {step.desc}
                </motion.p>
              )}
              {activeStep !== i && (
                <p className="text-xs text-[oklch(0.52_0.02_250)] font-body truncate">{step.desc.substring(0, 60)}...</p>
              )}
            </div>
            <ChevronDown size={16} className={`shrink-0 mt-1 transition-transform ${activeStep === i ? "rotate-180 text-[oklch(0.72_0.12_75)]" : "text-[oklch(0.52_0.02_250)]"}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const { t, language } = useLanguage();

  const serviceDetails: ServiceDetailProps[] = [
    {
      id: "scanning",
      icon: Scan,
      title: t("services.scanning.title"),
      subtitle: language === "en" ? "Digitization" : "การแปลงดิจิทัล",
      description: language === "en"
        ? "Our document scanning service transforms physical documents into high-quality digital files with precision and care. Using state-of-the-art scanners and rigorous quality control, we handle everything from standard office documents to oversized maps and fragile historical records."
        : "บริการสแกนเอกสารของเราแปลงเอกสารกายภาพเป็นไฟล์ดิจิทัลคุณภาพสูงด้วยความแม่นยำและความใส่ใจ ด้วยเครื่องสแกนล้ำสมัยและการควบคุมคุณภาพที่เข้มงวด เราจัดการทุกอย่างตั้งแต่เอกสารสำนักงานทั่วไปจนถึงแผนที่ขนาดใหญ่และบันทึกประวัติศาสตร์ที่เปราะบาง",
      features: [
        language === "en" ? "High-resolution scanning up to 1200 DPI" : "สแกนความละเอียดสูงถึง 1200 DPI",
        language === "en" ? "Advanced OCR with 99.9% accuracy" : "OCR ขั้นสูงความแม่นยำ 99.9%",
        language === "en" ? "Multiple output formats: PDF/A, TIFF, JPEG2000" : "รูปแบบผลลัพธ์หลากหลาย: PDF/A, TIFF, JPEG2000",
        language === "en" ? "Automated indexing and metadata tagging" : "การจัดทำดัชนีและแท็กข้อมูลเมตาอัตโนมัติ",

      ],
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/services-scanning_a9d57265.jpg",
    },
    {
      id: "electronic",
      icon: FileText,
      title: t("services.electronic.title"),
      subtitle: language === "en" ? "Digital Management" : "การจัดการดิจิทัล",
      description: language === "en"
        ? "We design and implement comprehensive electronic document management systems (EDMS) that streamline document workflows, ensure compliance, and enable instant retrieval. Our solutions integrate seamlessly with existing enterprise systems."
        : "เราออกแบบและใช้งานระบบจัดการเอกสารอิเล็กทรอนิกส์ (EDMS) ที่ครบวงจร ซึ่งช่วยปรับปรุง workflow เอกสาร รับประกันการปฏิบัติตามกฎระเบียบ และเปิดใช้งานการค้นหาทันที โซลูชันของเราผสานรวมกับระบบองค์กรที่มีอยู่ได้อย่างราบรื่น",
      features: [
        language === "en" ? "Enterprise EDMS implementation and configuration" : "การใช้งานและกำหนดค่า EDMS ระดับองค์กร",
        language === "en" ? "Automated approval workflows and routing" : "ระบบอนุมัติและกำหนดเส้นทางอัตโนมัติ",
        language === "en" ? "Role-based access control and audit trails" : "การควบคุมการเข้าถึงตามบทบาทและเส้นทางการตรวจสอบ",
        language === "en" ? "Integration with SAP, Oracle, and other ERP systems" : "การผสานรวมกับ SAP, Oracle และระบบ ERP อื่นๆ",
        language === "en" ? "PDPA and regulatory compliance built-in" : "การปฏิบัติตาม PDPA และกฎระเบียบในตัว",
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      reverse: true,
    },
    {
      id: "microfilm",
      icon: Film,
      title: t("services.microfilm.title"),
      subtitle: language === "en" ? "Long-term Archival" : "การจัดเก็บระยะยาว",
      description: language === "en"
        ? "Microfilm remains the gold standard for long-term document preservation, with a proven lifespan of 100+ years under proper storage conditions. We provide complete microfilm services including creation, duplication, scanning, and reader maintenance."
        : "ไมโครฟิล์มยังคงเป็นมาตรฐานทองคำสำหรับการอนุรักษ์เอกสารระยะยาว โดยมีอายุการใช้งานที่พิสูจน์แล้วกว่า 100 ปีภายใต้สภาพการจัดเก็บที่เหมาะสม เราให้บริการไมโครฟิล์มครบวงจร รวมถึงการสร้าง ทำสำเนา สแกน และการบำรุงรักษาเครื่องอ่าน",
      features: [
        language === "en" ? "16mm and 35mm microfilm production" : "การผลิตไมโครฟิล์ม 16mm และ 35mm",
        language === "en" ? "COM (Computer Output Microfilm) services" : "บริการ COM (Computer Output Microfilm)",
        language === "en" ? "Microfilm duplication and preservation" : "การทำสำเนาและอนุรักษ์ไมโครฟิล์ม",
        language === "en" ? "High-resolution microfilm scanning (600-1200 DPI)" : "การสแกนไมโครฟิล์มความละเอียดสูง (600-1200 DPI)",

      ],
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/services-microfilm_a37fc826.jpg",
    },
    {
      id: "ancient",
      icon: BookOpen,
      title: t("services.ancient.title"),
      subtitle: language === "en" ? "Heritage Preservation" : "การอนุรักษ์มรดก",
      description: language === "en"
        ? "Our heritage document specialists combine traditional conservation techniques with modern digitization technology to preserve Thailand's invaluable historical records. From palm leaf manuscripts to royal decrees, we handle each piece with the utmost care and expertise."
        : "ผู้เชี่ยวชาญด้านเอกสารมรดกของเราผสมผสานเทคนิคการอนุรักษ์แบบดั้งเดิมกับเทคโนโลยีการแปลงดิจิทัลสมัยใหม่เพื่ออนุรักษ์บันทึกประวัติศาสตร์อันล้ำค่าของไทย ตั้งแต่สมุดข่อยจนถึงพระราชโองการ เราดูแลแต่ละชิ้นด้วยความระมัดระวังและความเชี่ยวชาญสูงสุด",
      features: [
        language === "en" ? "Condition assessment and conservation treatment" : "การประเมินสภาพและการบำบัดอนุรักษ์",
        language === "en" ? "Multi-spectral imaging for damaged documents" : "การถ่ายภาพหลายสเปกตรัมสำหรับเอกสารที่เสียหาย",
        language === "en" ? "Palm leaf manuscript digitization" : "การแปลงดิจิทัลสมุดข่อย",
        language === "en" ? "Archival-grade storage and housing" : "การจัดเก็บและบรรจุภัณฑ์ระดับหอจดหมายเหตุ",
        language === "en" ? "Digital access portals for researchers" : "พอร์ทัลการเข้าถึงดิจิทัลสำหรับนักวิจัย",
      ],
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/ancient-documents_9032e276.jpg",
      reverse: true,
    },
    {
      id: "workflow",
      icon: Workflow,
      title: t("services.workflow.title"),
      subtitle: language === "en" ? "Process Automation" : "ระบบอัตโนมัติ",
      description: language === "en"
        ? "Transform manual document processes into intelligent automated workflows. Our workflow solutions reduce processing time, eliminate bottlenecks, and provide complete visibility into document status at every stage."
        : "เปลี่ยนกระบวนการเอกสารด้วยตนเองเป็น workflow อัตโนมัติที่ชาญฉลาด โซลูชัน workflow ของเราลดเวลาการประมวลผล ขจัดคอขวด และให้ความโปร่งใสสมบูรณ์ในสถานะเอกสารทุกขั้นตอน",
      features: [
        language === "en" ? "Custom workflow design and implementation" : "การออกแบบและใช้งาน workflow ที่กำหนดเอง",
        language === "en" ? "Multi-level approval routing" : "การกำหนดเส้นทางการอนุมัติหลายระดับ",
        language === "en" ? "Real-time status tracking and notifications" : "การติดตามสถานะแบบเรียลไทม์และการแจ้งเตือน",
        language === "en" ? "SLA monitoring and escalation management" : "การตรวจสอบ SLA และการจัดการการยกระดับ",
        language === "en" ? "Analytics and performance reporting" : "การวิเคราะห์และการรายงานประสิทธิภาพ",
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
    {
      id: "conversion",
      icon: RefreshCw,
      title: t("services.conversion.title"),
      subtitle: language === "en" ? "Format Conversion" : "การแปลงรูปแบบ",
      description: language === "en"
        ? "Our media conversion services enable seamless transformation between paper, electronic, and microfilm formats. Every conversion is fully reversible, ensuring your documents remain accessible in any format you need, now and in the future."
        : "บริการแปลงสื่อของเราช่วยให้การแปลงระหว่างกระดาษ อิเล็กทรอนิกส์ และไมโครฟิล์มเป็นไปอย่างราบรื่น การแปลงทุกครั้งสามารถย้อนกลับได้อย่างสมบูรณ์ เพื่อให้มั่นใจว่าเอกสารของคุณยังคงเข้าถึงได้ในรูปแบบที่คุณต้องการ ทั้งในปัจจุบันและอนาคต",
      features: [
        language === "en" ? "Paper to electronic (scanning + OCR)" : "กระดาษเป็นอิเล็กทรอนิกส์ (สแกน + OCR)",
        language === "en" ? "Electronic to microfilm (COM)" : "อิเล็กทรอนิกส์เป็นไมโครฟิล์ม (COM)",
        language === "en" ? "Microfilm to electronic (scanning)" : "ไมโครฟิล์มเป็นอิเล็กทรอนิกส์ (สแกน)",
        language === "en" ? "Paper to microfilm (direct filming)" : "กระดาษเป็นไมโครฟิล์ม (ถ่ายฟิล์มโดยตรง)",
        language === "en" ? "All conversions are fully reversible" : "การแปลงทั้งหมดสามารถย้อนกลับได้อย่างสมบูรณ์",
      ],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      reverse: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[oklch(0.22_0.06_250)] pt-28 pb-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
              <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                {language === "en" ? "Our Services" : "บริการของเรา"}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-4xl lg:text-5xl mb-4">
              {t("services.title")}
            </h1>
            <p className="text-[oklch(0.70_0.01_250)] font-body text-lg max-w-2xl">
              {t("services.subtitle")}
            </p>
          </FadeUp>
          {/* Quick Nav */}
          <FadeUp delay={0.2} className="mt-8">
            <div className="flex flex-wrap gap-2">
              {["scanning", "electronic", "microfilm", "ancient", "workflow", "conversion"].map((id) => (
                <a key={id} href={`#${id}`}
                  className="px-3 py-1.5 text-xs font-body font-medium border border-[oklch(0.72_0.12_75/0.4)] text-[oklch(0.72_0.12_75)] hover:bg-[oklch(0.72_0.12_75/0.1)] rounded-sm transition-colors capitalize">
                  {id.replace("-", " ")}
                </a>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Service Details */}
      <section className="bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {serviceDetails.map((svc) => (
            <ServiceDetail key={svc.id} {...svc} />
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <FadeUp>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
                <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {language === "en" ? "Our Process" : "กระบวนการของเรา"}
                </span>
              </div>
              <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-3xl lg:text-4xl mb-4">
                {language === "en" ? "How We Work" : "วิธีการทำงานของเรา"}
              </h2>
              <p className="text-[oklch(0.52_0.02_250)] font-body leading-relaxed mb-8">
                {language === "en"
                  ? "Our proven 5-step methodology ensures every project is delivered on time, within budget, and to the highest quality standards. Click each step to learn more."
                  : "วิธีการ 5 ขั้นตอนที่ผ่านการพิสูจน์แล้วของเราช่วยให้ทุกโครงการส่งมอบตรงเวลา ภายในงบประมาณ และตามมาตรฐานคุณภาพสูงสุด คลิกแต่ละขั้นตอนเพื่อดูข้อมูลเพิ่มเติม"}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "25+", label: language === "en" ? "Years Experience" : "ปีประสบการณ์" },
                  { value: "500+", label: language === "en" ? "Projects Completed" : "โครงการที่เสร็จสิ้น" },
                  { value: "99.8%", label: language === "en" ? "On-time Delivery" : "ส่งมอบตรงเวลา" },

                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-4 rounded-sm border border-[oklch(0.88_0.015_75)]">
                    <div className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl mb-1">{stat.value}</div>
                    <p className="text-xs text-[oklch(0.52_0.02_250)] font-body">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <WorkflowDiagram />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl lg:text-3xl mb-8 text-center">
              {language === "en" ? "Additional Services" : "บริการเพิ่มเติม"}
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Users,
                title: t("services.consulting.title"),
                desc: t("services.consulting.desc"),
              },
              {
                icon: Briefcase,
                title: t("services.outsourcing.title"),
                desc: t("services.outsourcing.desc"),
              },
            ].map((svc, i) => (
              <FadeUp key={svc.title} delay={i * 0.1}>
                <div className="flex gap-5 p-6 border border-[oklch(0.88_0.015_75)] rounded-sm hover:border-[oklch(0.72_0.12_75/0.4)] transition-colors">
                  <div className="w-12 h-12 rounded-sm bg-[oklch(0.22_0.06_250/0.06)] flex items-center justify-center shrink-0">
                    <svc.icon size={22} className="text-[oklch(0.22_0.06_250)]" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-2">{svc.title}</h3>
                    <p className="text-sm text-[oklch(0.52_0.02_250)] font-body leading-relaxed">{svc.desc}</p>
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
              {language === "en" ? "Need a Custom Solution?" : "ต้องการโซลูชันที่กำหนดเอง?"}
            </h2>
            <p className="text-[oklch(0.70_0.01_250)] font-body mb-6 max-w-lg mx-auto">
              {language === "en"
                ? "Every organization has unique document challenges. Let our specialists design a solution tailored to your needs."
                : "ทุกองค์กรมีความท้าทายด้านเอกสารที่เป็นเอกลักษณ์ ให้ผู้เชี่ยวชาญของเราออกแบบโซลูชันที่เหมาะกับความต้องการของคุณ"}
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
