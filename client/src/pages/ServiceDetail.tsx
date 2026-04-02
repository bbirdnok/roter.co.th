import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { serviceDetails } from "@shared/serviceDetails";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const service = slug ? serviceDetails[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Link href="/services">
            <a className="text-champagne-gold hover:text-champagne-gold/80 underline">
              Back to Services
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const title = language === "en" ? service.titleEn : service.titleTh;
  const description = language === "en" ? service.descriptionEn : service.descriptionTh;
  const overview = language === "en" ? service.overviewEn : service.overviewTh;
  const ctaText = language === "en" ? service.ctaText.en : service.ctaText.th;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-navy-deep to-navy-deep/90">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-ivory-white mb-4 font-playfair">
              {title}
            </h1>
            <p className="text-xl text-ivory-white/90 mb-8">{description}</p>
            <Link href="/contact">
              <a>
                <Button className="bg-champagne-gold hover:bg-champagne-gold/90 text-navy-deep font-semibold">
                  {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-navy-deep mb-6 font-playfair">
              {language === "en" ? "Overview" : "ภาพรวม"}
            </h2>
            <p className="text-lg text-graphite leading-relaxed">{overview}</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-ivory-white mb-12 font-playfair text-center">
            {language === "en" ? "Key Benefits" : "ประโยชน์หลัก"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.benefits.map((benefit: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <CheckCircle2 className="w-6 h-6 text-champagne-gold flex-shrink-0 mt-1" />
                <p className="text-ivory-white/90">
                  {language === "en" ? benefit.en : benefit.th}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-deep mb-12 font-playfair text-center">
            {language === "en" ? "Our Process" : "กระบวนการของเรา"}
          </h2>
          <div className="space-y-6">
            {service.process.map((step: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold text-navy-deep flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-lg text-graphite font-semibold">
                    {language === "en" ? step.en : step.th}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-ivory-white mb-12 font-playfair text-center">
            {language === "en" ? "Pricing" : "ราคา"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.pricing.map((tier: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-navy-deep/50 border border-champagne-gold/30 rounded-lg p-8 hover:border-champagne-gold/60 transition-colors"
              >
                <h3 className="text-2xl font-bold text-champagne-gold mb-2 font-playfair">
                  {tier.tier}
                </h3>
                <div className="mb-4">
                  {tier.price > 0 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-ivory-white">
                        {tier.price}
                      </span>
                      <span className="text-ivory-white/70">{tier.currency}</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-champagne-gold">
                      {language === "en" ? "Custom" : "กำหนดเอง"}
                    </div>
                  )}
                  <p className="text-sm text-ivory-white/70 mt-2">{tier.description}</p>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature: string, fidx: number) => (
                    <li key={fidx} className="flex items-start gap-2 text-ivory-white/80 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-champagne-gold flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-deep mb-12 font-playfair text-center">
            {language === "en" ? "Frequently Asked Questions" : "คำถามที่พบบ่อย"}
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="border border-graphite/20 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 bg-background hover:bg-background/80 transition-colors flex items-center justify-between text-left"
                >
                  <h3 className="font-semibold text-graphite">
                    {language === "en" ? faq.question : faq.questionTh}
                  </h3>
                  {expandedFAQ === idx ? (
                    <ChevronUp className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-ivory-white border-t border-graphite/20"
                  >
                    <p className="text-graphite leading-relaxed">
                      {language === "en" ? faq.answer : faq.answerTh}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-deep">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-ivory-white mb-6 font-playfair">
              {language === "en" ? "Ready to Get Started?" : "พร้อมที่จะเริ่มต้นหรือยัง?"}
            </h2>
            <p className="text-ivory-white/80 mb-8 text-lg">
              {language === "en"
                ? "Contact our team today to discuss your needs and get a custom quote."
                : "ติดต่อทีมของเราวันนี้เพื่อพูดคุยเกี่ยวกับความต้องการของคุณและรับใบเสนอราคาที่กำหนดเอง"}
            </p>
            <Link href="/contact">
              <a>
                <Button className="bg-champagne-gold hover:bg-champagne-gold/90 text-navy-deep font-semibold text-lg px-8 py-3">
                  {ctaText} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
