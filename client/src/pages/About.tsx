/* About Page — Archival Prestige Design
 * Company story, team, values, and certifications
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Award, Users, Globe, Shield, CheckCircle } from "lucide-react";
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

export default function About() {
  const { t, language } = useLanguage();

  const milestones = [
    { year: "1987", titleEn: "Company Founded", titleTh: "ก่อตั้งบริษัท", descEn: "Roter Thailand established in Bangkok as a specialist in document management, scanning, and microfilm services.", descTh: "ก่อตั้งบริษัท โรเตอร์ (ประเทศไทย) ในกรุงเทพฯ ด้วยความเชี่ยวชาญด้านการจัดการเอกสาร สแกนเอกสาร และบริการไมโครฟิล์ม" },
    { year: "1990s-2000s", titleEn: "Expansion & Certifications", titleTh: "ขยายธุรกิจและการรับรอง", descEn: "Expanded service offerings and achieved multiple ISO certifications (9001, 15489, 18901, 18906, 11799) for quality and records management.", descTh: "ขยายบริการและได้รับการรับรอง ISO หลายรายการ (9001, 15489, 18901, 18906, 11799) สำหรับการจัดการคุณภาพและบันทึก" },
    { year: "2000s", titleEn: "Technology & Services Expansion", titleTh: "ขยายเทคโนโลยีและบริการ", descEn: "Introduced advanced scanning technology, microfilm services, and electronic document management systems (EDMS) to serve growing enterprise demand.", descTh: "นำเสนอเทคโนโลยีสแกนขั้นสูง บริการไมโครฟิล์ม และระบบจัดการเอกสารอิเล็กทรอนิกส์ (EDMS) เพื่อตอบสนองความต้องการขององค์กรที่เพิ่มขึ้น" },
    { year: "2010s", titleEn: "Heritage & Preservation", titleTh: "มรดกและการอนุรักษ์", descEn: "Established specialized ancient document preservation and conservation services, including vacuum fumigation and restoration capabilities.", descTh: "จัดตั้งบริการอนุรักษ์และการอนุรักษ์เอกสารโบราณเฉพาะทาง รวมถึงความสามารถในการบำบัดด้วยสูญญากาศและการบูรณะ" },
    { year: "2020s", titleEn: "Digital Innovation", titleTh: "นวัตกรรมดิจิทัล", descEn: "Integrated advanced OCR, AI-powered document classification, and cloud-based document hosting solutions for modern enterprises.", descTh: "บูรณาการ OCR ขั้นสูง การจำแนกเอกสารด้วย AI และโซลูชันการจัดเก็บเอกสารบนคลาวด์สำหรับองค์กรสมัยใหม่" },
    { year: "Today", titleEn: "Market Leadership", titleTh: "ผู้นำตลาด", descEn: "Recognized as Thailand's leading document management specialist serving 100+ enterprise clients across all sectors with comprehensive, integrated solutions.", descTh: "ได้รับการยอมรับเป็นผู้เชี่ยวชาญการจัดการเอกสารชั้นนำของไทย บริการลูกค้าองค์กรกว่า 100 ราย ในทุกภาคส่วนด้วยโซลูชันที่ครอบคลุมและบูรณาการ" },
  ];

  const values = [
    { icon: Shield, titleEn: "Integrity", titleTh: "ความซื่อสัตย์", descEn: "We handle your most sensitive documents with absolute confidentiality and professional ethics.", descTh: "เราจัดการเอกสารที่ละเอียดอ่อนที่สุดของคุณด้วยความลับสมบูรณ์และจริยธรรมวิชาชีพ" },
    { icon: Award, titleEn: "Excellence", titleTh: "ความเป็นเลิศ", descEn: "We pursue the highest standards in every project, from quality control to client service.", descTh: "เราแสวงหามาตรฐานสูงสุดในทุกโครงการ ตั้งแต่การควบคุมคุณภาพจนถึงการบริการลูกค้า" },
    { icon: Users, titleEn: "Partnership", titleTh: "ความเป็นหุ้นส่วน", descEn: "We build long-term relationships with clients, becoming trusted advisors in document strategy.", descTh: "เราสร้างความสัมพันธ์ระยะยาวกับลูกค้า กลายเป็นที่ปรึกษาที่เชื่อถือได้ในกลยุทธ์เอกสาร" },
    { icon: Globe, titleEn: "Innovation", titleTh: "นวัตกรรม", descEn: "We continuously adopt emerging technologies to deliver better outcomes for our clients.", descTh: "เราต่อเนื่องนำเทคโนโลยีใหม่มาใช้เพื่อส่งมอบผลลัพธ์ที่ดีกว่าให้กับลูกค้า" },
  ];

  const certifications = [
    "ISO 9001:2015 Quality Management",
    "ISO 15489 Records Management",
    "ISO 18901 Microfilm Standards",
    "ISO 18906 Photographic Film",
    "ISO 11799 Document Storage",
    "PDPA Compliance Certified",
  ];

  const teamMembers = [
    { nameEn: "Somchai Wongkamchan", nameTh: "สมชาย วงศ์กำจัน", roleEn: "Chief Executive Officer", roleTh: "ประธานเจ้าหน้าที่บริหาร", expEn: "35+ years in document management", expTh: "ประสบการณ์ 35+ ปีด้านการจัดการเอกสาร", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
    { nameEn: "Nattaporn Sirikul", nameTh: "ณัฐพร ศิริกุล", roleEn: "Chief Technology Officer", roleTh: "ประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี", expEn: "Expert in EDMS and AI solutions", expTh: "ผู้เชี่ยวชาญด้าน EDMS และโซลูชัน AI", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" },
    { nameEn: "Prayoon Thanakit", nameTh: "ประยูร ธนกิจ", roleEn: "Head of Heritage Conservation", roleTh: "หัวหน้าฝ่ายอนุรักษ์มรดก", expEn: "Specialist in ancient manuscript preservation", expTh: "ผู้เชี่ยวชาญด้านการอนุรักษ์ต้นฉบับโบราณ", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
    { nameEn: "Siriporn Charoenwong", nameTh: "ศิริพร เจริญวงศ์", roleEn: "Director of Client Services", roleTh: "ผู้อำนวยการฝ่ายบริการลูกค้า", expEn: "20 years in enterprise client management", expTh: "ประสบการณ์ 20 ปีด้านการจัดการลูกค้าองค์กร", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[oklch(0.22_0.06_250)] pt-28 pb-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
                <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {language === "en" ? "Our Story" : "เรื่องราวของเรา"}
                </span>
              </div>
              <h1 className="font-display font-bold text-white text-4xl lg:text-5xl mb-5">
                {t("about.title")}
              </h1>
              <p className="text-[oklch(0.70_0.01_250)] font-body text-lg leading-relaxed mb-6">
                {t("about.subtitle")}
              </p>
              <p className="text-[oklch(0.60_0.01_250)] font-body leading-relaxed">
                {language === "en"
                  ? "Since our establishment in 1987, Roter (Thailand) Company Limited has been Thailand's premier specialist in document management, digitization, microfilming, and ancient document preservation. With over 30 years of proven expertise, we have earned the trust of more than 500 enterprise clients across government agencies, financial institutions, healthcare organizations, educational institutions, and multinational corporations. Our comprehensive solutions span the complete document lifecycle—from initial consultation and document scanning through electronic document management systems, microfilm services, workflow automation, and long-term archival preservation. We combine decades of experience with cutting-edge technology to help organizations efficiently manage, preserve, and access their critical documents while maintaining the highest standards of security, compliance, and quality."
                  : "ตั้งแต่ปี 2530 (1987) บริษัท โรเตอร์ (ประเทศไทย) จำกัด ได้เป็นผู้เชี่ยวชาญชั้นนำของไทยด้านการจัดการเอกสาร การแปลงดิจิทัล บริการไมโครฟิล์ม และการอนุรักษ์เอกสารโบราณ ด้วยประสบการณ์กว่า 30 ปี เราได้รับความไว้วางใจจากลูกค้าองค์กรกว่า 500 ราย ทั้งหน่วยงานรัฐบาล สถาบันการเงิน องค์กรสาธารณสุข สถาบันการศึกษา และบริษัทข้ามชาติ โซลูชันที่ครอบคลุมของเรากล่าวถึงวงจรชีวิตเอกสารทั้งหมด ตั้งแต่การให้คำปรึกษาเริ่มต้นและการสแกนเอกสาร ระบบจัดการเอกสารอิเล็กทรอนิกส์ บริการไมโครฟิล์ม ระบบอัตโนมัติ workflow และการอนุรักษ์ระยะยาว เรารวมประสบการณ์หลายสิบปีกับเทคโนโลยีล้ำสมัยเพื่อช่วยให้องค์กรจัดการ อนุรักษ์ และเข้าถึงเอกสารที่สำคัญของพวกเขาได้อย่างมีประสิทธิภาพ พร้อมรักษามาตรฐานความปลอดภัย การปฏิบัติตามกฎหมาย และคุณภาพสูงสุด"}
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative">
                <div className="rounded-sm overflow-hidden shadow-[0_20px_60px_oklch(0.22_0.06_250/0.3)]">
                  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/about-office_d3b057c0.jpg"
                    alt="Roter Thailand Office" className="w-full h-80 object-cover" />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-[oklch(0.72_0.12_75)] p-5 rounded-sm shadow-lg">
                  <div className="font-display font-bold text-[oklch(0.22_0.06_250)] text-3xl">35+</div>
                  <p className="text-xs text-[oklch(0.22_0.06_250/0.8)] font-body font-semibold">
                    {language === "en" ? "Years of Expertise" : "ปีแห่งความชำนาญ"}
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-[oklch(0.88_0.015_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "100+", labelEn: "Enterprise Clients", labelTh: "ลูกค้าองค์กร" },
              { value: "50M+", labelEn: "Documents Processed", labelTh: "เอกสารที่ดำเนินการ" },
              { value: "150+", labelEn: "Specialists", labelTh: "ผู้เชี่ยวชาญ" },
              { value: "6", labelEn: "ISO Certifications", labelTh: "การรับรอง ISO" },
            ].map((stat, i) => (
              <FadeUp key={stat.value} delay={i * 0.1} className="text-center">
                <div className="font-display font-bold text-[oklch(0.22_0.06_250)] text-3xl lg:text-4xl mb-1">{stat.value}</div>
                <p className="text-sm text-[oklch(0.52_0.02_250)] font-body">{language === "en" ? stat.labelEn : stat.labelTh}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
                <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {language === "en" ? "Our Values" : "ค่านิยมของเรา"}
                </span>
                <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
              </div>
              <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl lg:text-3xl">
                {language === "en" ? "What Drives Us" : "สิ่งที่ขับเคลื่อนเรา"}
              </h2>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <FadeUp key={val.titleEn} delay={i * 0.1}>
                <div className="bg-white p-6 border border-[oklch(0.88_0.015_75)] rounded-sm hover:border-[oklch(0.72_0.12_75/0.4)] transition-colors">
                  <div className="w-12 h-12 rounded-sm bg-[oklch(0.22_0.06_250/0.06)] flex items-center justify-center mb-4">
                    <val.icon size={22} className="text-[oklch(0.22_0.06_250)]" />
                  </div>
                  <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-2">
                    {language === "en" ? val.titleEn : val.titleTh}
                  </h3>
                  <p className="text-sm text-[oklch(0.52_0.02_250)] font-body leading-relaxed">
                    {language === "en" ? val.descEn : val.descTh}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-2xl lg:text-3xl">
                {language === "en" ? "Our Journey" : "เส้นทางของเรา"}
              </h2>
            </div>
          </FadeUp>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[oklch(0.88_0.015_75)] hidden lg:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.1}>
                  <div className={`flex gap-8 items-start ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : ""}`}>
                      <div className={`bg-[oklch(0.97_0.008_75)] border border-[oklch(0.88_0.015_75)] rounded-sm p-5 ${i % 2 === 0 ? "lg:ml-auto" : ""} max-w-sm`}>
                        <div className="font-display font-bold text-[oklch(0.72_0.12_75)] text-xl mb-1">{m.year}</div>
                        <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-1">
                          {language === "en" ? m.titleEn : m.titleTh}
                        </h3>
                        <p className="text-sm text-[oklch(0.52_0.02_250)] font-body leading-relaxed">
                          {language === "en" ? m.descEn : m.descTh}
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:flex w-4 h-4 rounded-full bg-[oklch(0.72_0.12_75)] border-4 border-white shadow-sm mt-5 shrink-0 z-10" />
                    <div className="flex-1 hidden lg:block" />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>





      {/* CTA */}
      <section className="py-16 bg-[oklch(0.22_0.06_250)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display font-bold text-white text-2xl lg:text-3xl mb-4">
              {language === "en" ? "Partner With Thailand's Document Specialists" : "เป็นพันธมิตรกับผู้เชี่ยวชาญเอกสารของไทย"}
            </h2>
            <p className="text-[oklch(0.70_0.01_250)] font-body mb-6 max-w-lg mx-auto">
              {language === "en"
                ? "Discover how our 35+ years of expertise can transform your document operations."
                : "ค้นหาว่าความเชี่ยวชาญกว่า 35 ปีของเราสามารถเปลี่ยนแปลงการดำเนินงานเอกสารของคุณได้อย่างไร"}
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
