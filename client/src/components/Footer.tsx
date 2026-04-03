/* Footer — Archival Prestige Design
 * Dark navy background with gold accents, organized columns
 */
import { Link } from "wouter";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const services = [
    { label: language === "en" ? "Document Scanning" : "การสแกนเอกสาร", href: "/services#scanning" },
    { label: language === "en" ? "Electronic Documents" : "เอกสารอิเล็กทรอนิกส์", href: "/services#electronic" },
    { label: language === "en" ? "Microfilm Services" : "บริการไมโครฟิล์ม", href: "/services#microfilm" },
    { label: language === "en" ? "Ancient Document Preservation" : "การอนุรักษ์เอกสารโบราณ", href: "/services#ancient" },
    { label: language === "en" ? "Workflow Automation" : "ระบบ Workflow", href: "/services#workflow" },
    { label: language === "en" ? "Media Conversion" : "การแปลงสื่อ", href: "/services#conversion" },
  ];

  const company = [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.caseStudies"), href: "/case-studies" },
    { label: t("nav.insights"), href: "/insights" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="bg-[oklch(0.14_0.05_250)] text-[oklch(0.85_0.01_250)]">
      {/* Top Gold Rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.12_75)] to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/roter-logo_b254d187.png"
                alt="Roter Thailand Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-[oklch(0.65_0.01_250)] mb-6">
              {t("footer.tagline")}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[oklch(0.72_0.12_75)] mt-0.5 shrink-0" />
                <span className="text-[oklch(0.65_0.01_250)]">
                  {language === "en"
                    ? "848-849 Sinthorn Village, Nawamin Road, Khlong Chan, Bangkapi, Bangkok 10240"
                    : "848-849 หมู่บ้านสินธร ถนนวมินทร์ แขวงคลองจั่น เขตบางกะปิ กทม. 10240"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[oklch(0.72_0.12_75)] shrink-0" />
                <span className="text-[oklch(0.65_0.01_250)]">+66 2 375 3455-6</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[oklch(0.72_0.12_75)] shrink-0" />
                <span className="text-[oklch(0.65_0.01_250)]">info@roter.co.th</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-5">
              {t("nav.services")}
            </h4>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm text-[oklch(0.65_0.01_250)] hover:text-[oklch(0.72_0.12_75)] transition-colors flex items-center gap-1.5 group">
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-5">
              {language === "en" ? "Company" : "บริษัท"}
            </h4>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm text-[oklch(0.65_0.01_250)] hover:text-[oklch(0.72_0.12_75)] transition-colors flex items-center gap-1.5 group">
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA Column */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-5">
              {language === "en" ? "Stay Informed" : "รับข่าวสาร"}
            </h4>
            <p className="text-sm text-[oklch(0.65_0.01_250)] mb-4 leading-relaxed">
              {language === "en"
                ? "Receive industry insights and document management best practices."
                : "รับข้อมูลเชิงลึกและแนวปฏิบัติที่ดีที่สุดด้านการจัดการเอกสาร"}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={language === "en" ? "Your email" : "อีเมลของคุณ"}
                className="flex-1 bg-[oklch(0.22_0.06_250)] border border-[oklch(0.72_0.12_75/0.3)] rounded px-3 py-2 text-sm text-white placeholder-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.12_75)] transition-colors"
              />
              <button className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] px-3 py-2 rounded hover:bg-[oklch(0.82_0.09_75)] transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[oklch(0.72_0.12_75/0.15)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[oklch(0.45_0.01_250)]">
            © {currentYear} {language === "en" ? "Roter (Thailand) Company Limited" : "บริษัท โรเตอร์ (ประเทศไทย) จำกัด"}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-[oklch(0.45_0.01_250)]">
            <Link href="/privacy">
              <span className="hover:text-[oklch(0.72_0.12_75)] transition-colors">{t("footer.privacy")}</span>
            </Link>
            <span>·</span>
            <Link href="/terms">
              <span className="hover:text-[oklch(0.72_0.12_75)] transition-colors">{t("footer.terms")}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
