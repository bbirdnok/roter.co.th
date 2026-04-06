/* Navigation — Archival Prestige Design
 * Slim sticky nav with navy background, gold accents, bilingual toggle
 * Playfair Display for brand name, Source Sans 3 for nav items
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/products", label: t("nav.products") },
    { href: "/insights", label: t("nav.insights") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[oklch(0.22_0.06_250)] shadow-[0_4px_30px_oklch(0_0_0/0.3)]"
          : "bg-[oklch(0.22_0.06_250/0.95)] backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 group">
              {/* Company Logo */}
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663482157235/jumThpZwKgu5mhQPgTgwan/roter-logo_b254d187.png"
                alt="Roter Thailand Logo"
                className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 text-sm font-body font-medium transition-colors relative group ${
                    location === link.href
                      ? "text-[oklch(0.72_0.12_75)]"
                      : "text-[oklch(0.85_0.01_250)] hover:text-white"
                  }`}
                >
                  {link.label}
                  {location === link.href && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-[oklch(0.72_0.12_75)]" />
                  )}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "th" : "en")}
              className="flex items-center gap-1.5 text-[oklch(0.75_0.01_250)] hover:text-[oklch(0.72_0.12_75)] transition-colors text-sm font-body"
            >
              <Globe size={14} />
              <span className="hidden sm:inline font-medium">{language === "en" ? "ภาษาไทย" : "English"}</span>
              <span className="sm:hidden font-medium">{language === "en" ? "TH" : "EN"}</span>
            </button>

            {/* CTA Button */}
            <Link href="/contact">
              <Button
                size="sm"
                className="hidden md:flex bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold text-sm tracking-wide border-0 px-4"
              >
                {t("nav.getConsultation")}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden text-white p-1"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-[oklch(0.18_0.06_250)] border-t border-[oklch(0.72_0.12_75/0.2)]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2.5 text-sm font-body font-medium rounded transition-colors ${
                    location === link.href
                      ? "text-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75/0.1)]"
                      : "text-[oklch(0.85_0.01_250)] hover:text-white hover:bg-[oklch(0.72_0.12_75/0.05)]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-3 border-t border-[oklch(0.72_0.12_75/0.2)]">
              <Link href="/contact">
                <Button className="w-full bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] font-body font-semibold">
                  {t("nav.getConsultation")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
