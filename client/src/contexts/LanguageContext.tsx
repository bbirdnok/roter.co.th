import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.products": "Products",
    "nav.caseStudies": "Case Studies",
    "nav.insights": "Insights",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.getConsultation": "Get Consultation",

    // Hero
    "hero.tagline": "Document Intelligence. Preserved for Generations.",
    "hero.subtitle": "Thailand's premier specialists in document management, digitization, microfilm, and ancient document preservation. Trusted by leading organizations across Southeast Asia.",
    "hero.cta.primary": "Explore Our Services",
    "hero.cta.secondary": "View Case Studies",
    "hero.stat.clients": "Enterprise Clients",
    "hero.stat.documents": "Documents Processed",
    "hero.stat.years": "Years of Expertise",
    "hero.stat.satisfaction": "Client Satisfaction",

    // Services
    "services.title": "Our Expertise",
    "services.subtitle": "Comprehensive document lifecycle management — from physical preservation to digital transformation and everything in between.",
    "services.scanning.title": "Document Scanning",
    "services.scanning.desc": "High-resolution digitization of all document types with advanced OCR and quality assurance protocols.",
    "services.electronic.title": "Electronic Documents",
    "services.electronic.desc": "Complete electronic document management systems with workflow automation and compliance frameworks.",
    "services.microfilm.title": "Microfilm Services",
    "services.microfilm.desc": "Professional microfilm creation, duplication, and scanning with archival-grade quality standards.",
    "services.ancient.title": "Ancient Document Preservation",
    "services.ancient.desc": "Expert conservation and digitization of historical manuscripts, palm leaf manuscripts, and heritage documents.",
    "services.workflow.title": "Workflow Automation",
    "services.workflow.desc": "Intelligent document routing, approval workflows, and process automation tailored to your organization.",
    "services.conversion.title": "Media Conversion",
    "services.conversion.desc": "Seamless conversion between paper, electronic, and microfilm formats — bidirectional and reversible.",
    "services.consulting.title": "Consulting & Advisory",
    "services.consulting.desc": "Strategic guidance on document management policies, compliance, and technology selection.",
    "services.outsourcing.title": "Managed Services",
    "services.outsourcing.desc": "Full-service document operations — we handle everything on your behalf with SLA guarantees.",

    // Conversion Diagram
    "conversion.title": "Bidirectional Media Conversion",
    "conversion.subtitle": "Seamlessly convert documents between any format — paper, electronic, or microfilm — with full reversibility.",
    "conversion.paper": "Paper Documents",
    "conversion.electronic": "Electronic Files",
    "conversion.microfilm": "Microfilm",
    "conversion.click": "Click any arrow to learn more",

    // Products
    "products.title": "Specialized Equipment & Products",
    "products.subtitle": "Professional-grade document management hardware and software solutions for enterprise needs.",
    "products.scanners": "High-Speed Scanners",
    "products.microfilmReaders": "Microfilm Readers & Scanners",
    "products.archivalSupplies": "Archival Supplies",
    "products.software": "Document Management Software",
    "products.viewAll": "View All Products",

    // Case Studies
    "caseStudies.title": "Client Success Stories",
    "caseStudies.subtitle": "Proven results across government, finance, healthcare, and enterprise sectors.",
    "caseStudies.filter.all": "All Industries",
    "caseStudies.filter.government": "Government",
    "caseStudies.filter.finance": "Finance & Banking",
    "caseStudies.filter.healthcare": "Healthcare",
    "caseStudies.filter.education": "Education",
    "caseStudies.filter.enterprise": "Enterprise",
    "caseStudies.readMore": "Read Full Case Study",

    // Results Dashboard
    "results.title": "Measurable Impact",
    "results.subtitle": "Our clients achieve transformative results through systematic document management.",
    "results.efficiency": "Efficiency Increase",
    "results.costReduction": "Cost Reduction",
    "results.retrievalTime": "Retrieval Time Reduction",
    "results.compliance": "Compliance Rate",

    // Insights
    "insights.title": "Knowledge & Insights",
    "insights.subtitle": "Expert analysis, industry reports, and best practices from Thailand's document management specialists.",
    "insights.readMore": "Read Article",
    "insights.downloadReport": "Download Report",
    "insights.viewAll": "View All Insights",

    // Lead Form
    "form.title": "Start Your Document Transformation",
    "form.subtitle": "Tell us about your organization's needs and we'll design a tailored solution.",
    "form.step1": "Organization Profile",
    "form.step2": "Document Challenges",
    "form.step3": "Project Scope",
    "form.step4": "Contact Details",
    "form.next": "Continue",
    "form.back": "Back",
    "form.submit": "Request Consultation",
    "form.success": "Thank you! Our specialist will contact you within 24 hours.",

    // About
    "about.title": "About Roter Thailand",
    "about.subtitle": "Over two decades of document management excellence in Thailand and Southeast Asia.",
    "about.mission": "Our Mission",
    "about.missionText": "To preserve knowledge, enable efficiency, and empower organizations through expert document management solutions.",
    "about.vision": "Our Vision",
    "about.visionText": "To be Southeast Asia's most trusted partner for document lifecycle management and preservation.",
    "about.values": "Our Values",

    // Contact
    "contact.title": "Get in Touch",
    "contact.subtitle": "Our specialists are ready to discuss your document management needs.",
    "contact.address": "Address",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.hours": "Business Hours",
    "contact.sendMessage": "Send Message",

    // Footer
    "footer.tagline": "Thailand's Premier Document Management Specialists",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.description": "Thailand's leading specialist in document management, digitization, microfilm services, and heritage conservation since 1998.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "nav.companyName": "Roter (Thailand) Company Limited",
    "nav.companyShort": "Roter Thailand",
    "home.hero.tagline": "Document Management Specialists",
    "home.hero.title": "Transforming Documents,\nPreserving Knowledge",
    "home.hero.subtitle": "Thailand's leading specialist in document digitization, microfilm services, heritage conservation, and intelligent workflow solutions for enterprise organizations.",
    "home.hero.cta1": "Explore Services",
    "home.hero.cta2": "View Case Studies",
    "home.stats.clients": "Enterprise Clients",
    "home.stats.documents": "Documents Processed",
    "home.stats.years": "Years of Excellence",

    "home.services.title": "Comprehensive Document Services",
    "home.services.subtitle": "From physical documents to digital archives, microfilm to electronic workflows — we handle every aspect of your document lifecycle.",
    "home.conversion.title": "Seamless Format Conversion",
    "home.conversion.subtitle": "Every conversion is fully reversible. Move between paper, digital, and microfilm formats with confidence.",
    "home.results.title": "Client Results Dashboard",
    "home.results.subtitle": "Real outcomes from real projects across Thailand's most demanding organizations.",
    "home.cta.title": "Ready to Transform Your Document Operations?",
    "home.cta.subtitle": "Speak with our specialists to design a solution tailored to your organization's needs.",
    "home.cta.button": "Schedule Consultation",
  },
  th: {
    // Navigation
    "nav.home": "หน้าหลัก",
    "nav.services": "บริการ",
    "nav.products": "สินค้า",
    "nav.caseStudies": "กรณีศึกษา",
    "nav.insights": "ข้อมูลเชิงลึก",
    "nav.about": "เกี่ยวกับเรา",
    "nav.contact": "ติดต่อ",
    "nav.getConsultation": "ขอคำปรึกษา",

    // Hero
    "hero.tagline": "ความเชี่ยวชาญด้านเอกสาร สืบทอดสู่อนาคต",
    "hero.subtitle": "ผู้เชี่ยวชาญชั้นนำของไทยด้านการจัดการเอกสาร การแปลงดิจิทัล ไมโครฟิล์ม และการอนุรักษ์เอกสารโบราณ ไว้วางใจโดยองค์กรชั้นนำทั่วเอเชียตะวันออกเฉียงใต้",
    "hero.cta.primary": "สำรวจบริการของเรา",
    "hero.cta.secondary": "ดูกรณีศึกษา",
    "hero.stat.clients": "ลูกค้าองค์กร",
    "hero.stat.documents": "เอกสารที่ดำเนินการ",
    "hero.stat.years": "ปีแห่งความเชี่ยวชาญ",
    "hero.stat.satisfaction": "ความพึงพอใจลูกค้า",

    // Services
    "services.title": "ความเชี่ยวชาญของเรา",
    "services.subtitle": "การจัดการวงจรชีวิตเอกสารครบวงจร ตั้งแต่การอนุรักษ์ทางกายภาพสู่การแปลงดิจิทัล",
    "services.scanning.title": "การสแกนเอกสาร",
    "services.scanning.desc": "การแปลงเป็นดิจิทัลความละเอียดสูงสำหรับเอกสารทุกประเภท พร้อม OCR ขั้นสูงและระบบประกันคุณภาพ",
    "services.electronic.title": "เอกสารอิเล็กทรอนิกส์",
    "services.electronic.desc": "ระบบจัดการเอกสารอิเล็กทรอนิกส์ครบวงจร พร้อมระบบอัตโนมัติและกรอบการปฏิบัติตามกฎระเบียบ",
    "services.microfilm.title": "บริการไมโครฟิล์ม",
    "services.microfilm.desc": "การสร้าง ทำสำเนา และสแกนไมโครฟิล์มระดับมืออาชีพ ตามมาตรฐานคุณภาพระดับหอจดหมายเหตุ",
    "services.ancient.title": "การอนุรักษ์เอกสารโบราณ",
    "services.ancient.desc": "การอนุรักษ์และแปลงดิจิทัลต้นฉบับทางประวัติศาสตร์ สมุดข่อย และเอกสารมรดกทางวัฒนธรรม",
    "services.workflow.title": "ระบบ Workflow อัตโนมัติ",
    "services.workflow.desc": "การกำหนดเส้นทางเอกสารอัจฉริยะ ระบบอนุมัติ และระบบอัตโนมัติที่ปรับแต่งตามองค์กร",
    "services.conversion.title": "การแปลงสื่อ",
    "services.conversion.desc": "การแปลงระหว่างกระดาษ อิเล็กทรอนิกส์ และไมโครฟิล์มได้อย่างราบรื่น ทั้งสองทิศทาง",
    "services.consulting.title": "ที่ปรึกษาและให้คำแนะนำ",
    "services.consulting.desc": "คำแนะนำเชิงกลยุทธ์ด้านนโยบายการจัดการเอกสาร การปฏิบัติตามกฎระเบียบ และการเลือกเทคโนโลยี",
    "services.outsourcing.title": "บริการแบบครบวงจร",
    "services.outsourcing.desc": "การดำเนินงานเอกสารแบบเต็มรูปแบบ เราจัดการทุกอย่างแทนคุณพร้อมการรับประกัน SLA",

    // Conversion Diagram
    "conversion.title": "การแปลงสื่อสองทิศทาง",
    "conversion.subtitle": "แปลงเอกสารระหว่างรูปแบบใดก็ได้ ทั้งกระดาษ อิเล็กทรอนิกส์ และไมโครฟิล์ม พร้อมความสามารถในการย้อนกลับ",
    "conversion.paper": "เอกสารกระดาษ",
    "conversion.electronic": "ไฟล์อิเล็กทรอนิกส์",
    "conversion.microfilm": "ไมโครฟิล์ม",
    "conversion.click": "คลิกที่ลูกศรเพื่อดูข้อมูลเพิ่มเติม",

    // Products
    "products.title": "อุปกรณ์และสินค้าเฉพาะทาง",
    "products.subtitle": "ฮาร์ดแวร์และซอฟต์แวร์จัดการเอกสารระดับมืออาชีพสำหรับองค์กร",
    "products.scanners": "เครื่องสแกนความเร็วสูง",
    "products.microfilmReaders": "เครื่องอ่านและสแกนไมโครฟิล์ม",
    "products.archivalSupplies": "อุปกรณ์จัดเก็บเอกสาร",
    "products.software": "ซอฟต์แวร์จัดการเอกสาร",
    "products.viewAll": "ดูสินค้าทั้งหมด",

    // Case Studies
    "caseStudies.title": "ความสำเร็จของลูกค้า",
    "caseStudies.subtitle": "ผลลัพธ์ที่พิสูจน์แล้วในภาครัฐ การเงิน สาธารณสุข และองค์กรธุรกิจ",
    "caseStudies.filter.all": "ทุกอุตสาหกรรม",
    "caseStudies.filter.government": "ภาครัฐ",
    "caseStudies.filter.finance": "การเงินและธนาคาร",
    "caseStudies.filter.healthcare": "สาธารณสุข",
    "caseStudies.filter.education": "การศึกษา",
    "caseStudies.filter.enterprise": "องค์กรธุรกิจ",
    "caseStudies.readMore": "อ่านกรณีศึกษาเต็ม",

    // Results Dashboard
    "results.title": "ผลลัพธ์ที่วัดได้",
    "results.subtitle": "ลูกค้าของเราบรรลุผลลัพธ์ที่เปลี่ยนแปลงองค์กรผ่านการจัดการเอกสารอย่างเป็นระบบ",
    "results.efficiency": "ประสิทธิภาพที่เพิ่มขึ้น",
    "results.costReduction": "การลดต้นทุน",
    "results.retrievalTime": "ลดเวลาค้นหาเอกสาร",
    "results.compliance": "อัตราการปฏิบัติตามกฎระเบียบ",

    // Insights
    "insights.title": "ความรู้และข้อมูลเชิงลึก",
    "insights.subtitle": "การวิเคราะห์เชิงผู้เชี่ยวชาญ รายงานอุตสาหกรรม และแนวปฏิบัติที่ดีที่สุดจากผู้เชี่ยวชาญด้านเอกสารของไทย",
    "insights.readMore": "อ่านบทความ",
    "insights.downloadReport": "ดาวน์โหลดรายงาน",
    "insights.viewAll": "ดูข้อมูลเชิงลึกทั้งหมด",

    // Lead Form
    "form.title": "เริ่มต้นการเปลี่ยนแปลงเอกสารของคุณ",
    "form.subtitle": "บอกเราเกี่ยวกับความต้องการขององค์กร และเราจะออกแบบโซลูชันที่เหมาะสม",
    "form.step1": "ข้อมูลองค์กร",
    "form.step2": "ความท้าทายด้านเอกสาร",
    "form.step3": "ขอบเขตโครงการ",
    "form.step4": "ข้อมูลติดต่อ",
    "form.next": "ถัดไป",
    "form.back": "ย้อนกลับ",
    "form.submit": "ขอรับคำปรึกษา",
    "form.success": "ขอบคุณ! ผู้เชี่ยวชาญของเราจะติดต่อคุณภายใน 24 ชั่วโมง",

    // About
    "about.title.long": "เกี่ยวกับโรเตอร์ (ประเทศไทย)",
    "about.subtitle.long": "กว่าสองทศวรรษแห่งความเป็นเลิศด้านการจัดการเอกสารในไทยและเอเชียตะวันออกเฉียงใต้",
    "about.mission": "พันธกิจของเรา",
    "about.missionText": "อนุรักษ์ความรู้ เพิ่มประสิทธิภาพ และเสริมพลังองค์กรผ่านโซลูชันการจัดการเอกสารระดับผู้เชี่ยวชาญ",
    "about.vision": "วิสัยทัศน์ของเรา",
    "about.visionText": "เป็นพันธมิตรที่น่าเชื่อถือที่สุดในเอเชียตะวันออกเฉียงใต้สำหรับการจัดการวงจรชีวิตเอกสารและการอนุรักษ์",
    "about.values": "ค่านิยมของเรา",

    // Contact
    "contact.title.short": "ติดต่อเรา",
    "contact.subtitle.short": "ผู้เชี่ยวชาญของเราพร้อมพูดคุยเกี่ยวกับความต้องการด้านการจัดการเอกสารของคุณ",
    "contact.address": "ที่อยู่",
    "contact.phone": "โทรศัพท์",
    "contact.email": "อีเมล",
    "contact.hours": "เวลาทำการ",
    "contact.sendMessage": "ส่งข้อความ",

    // Footer
    "footer.tagline": "ผู้เชี่ยวชาญด้านการจัดการเอกสารชั้นนำของไทย",
    "footer.rights": "สงวนลิขสิทธิ์",
    "footer.privacy": "นโยบายความเป็นส่วนตัว",
    "footer.terms": "ข้อกำหนดการใช้บริการ",
    "footer.description": "ผู้เชี่ยวชาญชั้นนำของไทยด้านการจัดการเอกสาร การแปลงดิจิทัล บริการไมโครฟิล์ม และการอนุรักษ์มรดกวัฒนธรรมตั้งแต่ปี 2541",
    "footer.services": "บริการ",
    "footer.company": "บริษัท",
    "footer.contact": "ติดต่อ",
    "nav.companyName": "บริษัท โรเตอร์ (ประเทศไทย) จำกัด",
    "nav.companyShort": "โรเตอร์ (ประเทศไทย)",
    "home.hero.tagline": "ผู้เชี่ยวชาญด้านการจัดการเอกสาร",
    "home.hero.title": "เปลี่ยนแปลงเอกสาร\nอนุรักษ์ความรู้",
    "home.hero.subtitle": "ผู้เชี่ยวชาญชั้นนำของไทยด้านการแปลงดิจิทัลเอกสาร บริการไมโครฟิล์ม การอนุรักษ์มรดกวัฒนธรรม และโซลูชัน workflow อัจฉริยะสำหรับองค์กร",
    "home.hero.cta1": "สำรวจบริการ",
    "home.hero.cta2": "ดูกรณีศึกษา",
    "home.stats.clients": "ลูกค้าองค์กร",
    "home.stats.documents": "เอกสารที่ดำเนินการ",
    "home.stats.years": "ปีแห่งความเป็นเลิศ",

    "home.services.title": "บริการจัดการเอกสารครบวงจร",
    "home.services.subtitle": "ตั้งแต่เอกสารกายภาพถึงคลังดิจิทัล จากไมโครฟิล์มถึง workflow อิเล็กทรอนิกส์ เราดูแลทุกด้านของวงจรชีวิตเอกสารของคุณ",
    "home.conversion.title": "การแปลงรูปแบบที่ราบรื่น",
    "home.conversion.subtitle": "การแปลงทุกครั้งสามารถย้อนกลับได้อย่างสมบูรณ์ เคลื่อนย้ายระหว่างกระดาษ ดิจิทัล และไมโครฟิล์มได้อย่างมั่นใจ",
    "home.results.title": "แดชบอร์ดผลลัพธ์ลูกค้า",
    "home.results.subtitle": "ผลลัพธ์จริงจากโครงการจริงในองค์กรที่ต้องการความเชี่ยวชาญสูงสุดของไทย",
    "home.cta.title": "พร้อมที่จะเปลี่ยนแปลงการดำเนินงานเอกสารของคุณ?",
    "home.cta.subtitle": "พูดคุยกับผู้เชี่ยวชาญของเราเพื่อออกแบบโซลูชันที่เหมาะกับความต้องการขององค์กรคุณ",
    "home.cta.button": "นัดหมายปรึกษา",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
