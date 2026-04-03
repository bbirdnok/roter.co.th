/* Contact Page — Archival Prestige Design
 * Multi-step lead qualification form + contact info
 */
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Phone, Mail, Clock, ArrowRight, ArrowLeft, Building, Users, FileText, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

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

interface FormData {
  // Step 1
  orgType: string;
  orgName: string;
  orgSize: string;
  // Step 2
  primaryNeed: string;
  documentVolume: string;
  timeline: string;
  // Step 3
  name: string;
  title: string;
  email: string;
  phone: string;
  message: string;
}

const initialForm: FormData = {
  orgType: "", orgName: "", orgSize: "",
  primaryNeed: "", documentVolume: "", timeline: "",
  name: "", title: "", email: "", phone: "", message: "",
};

export default function Contact() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;

  const [isLoading, setIsLoading] = useState(false);
  const submitLeadMutation = trpc.leads.submit.useMutation();

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.orgName) {
      toast.error(language === "en" ? "Please fill in required fields" : "กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }

    setIsLoading(true);
    try {
      await submitLeadMutation.mutateAsync({
        organizationType: form.orgType,
        organizationName: form.orgName,
        organizationSize: form.orgSize,
        fullName: form.name,
        email: form.email,
        phone: form.phone || undefined,
        serviceInterest: form.primaryNeed || undefined,
        message: form.message || undefined,
      });
      
      setSubmitted(true);
      toast.success(language === "en" ? "Thank you! We'll contact you within 24 hours." : "ขอบคุณ! เราจะติดต่อคุณภายใน 24 ชั่วโมง");
      setForm(initialForm);
      setStep(1);
    } catch (error) {
      console.error("[Contact] Form submission error:", error);
      toast.error(language === "en" ? "Failed to submit form. Please try again." : "ส่งแบบฟอร์มล้มเหลว กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  const orgTypes = [
    { value: "government", labelEn: "Government Agency", labelTh: "หน่วยงานรัฐบาล", icon: Building },
    { value: "finance", labelEn: "Financial Institution", labelTh: "สถาบันการเงิน", icon: Briefcase },
    { value: "healthcare", labelEn: "Healthcare", labelTh: "สาธารณสุข", icon: Users },
    { value: "enterprise", labelEn: "Enterprise / Corporate", labelTh: "องค์กรธุรกิจ", icon: Building },
    { value: "education", labelEn: "Education / Research", labelTh: "การศึกษา / วิจัย", icon: FileText },
    { value: "other", labelEn: "Other", labelTh: "อื่นๆ", icon: Briefcase },
  ];

  const primaryNeeds = [
    { value: "scanning", labelEn: "Document Scanning & Digitization", labelTh: "สแกนและแปลงดิจิทัลเอกสาร" },
    { value: "edms", labelEn: "Electronic Document Management", labelTh: "การจัดการเอกสารอิเล็กทรอนิกส์" },
    { value: "microfilm", labelEn: "Microfilm Services", labelTh: "บริการไมโครฟิล์ม" },
    { value: "ancient", labelEn: "Heritage Document Conservation", labelTh: "การอนุรักษ์เอกสารมรดก" },
    { value: "workflow", labelEn: "Workflow Automation", labelTh: "ระบบอัตโนมัติ Workflow" },
    { value: "consulting", labelEn: "Consulting & Advisory", labelTh: "การให้คำปรึกษา" },
    { value: "products", labelEn: "Equipment & Software Purchase", labelTh: "การซื้ออุปกรณ์และซอฟต์แวร์" },
  ];

  const SelectOption = ({ value, selected, onClick, children }: { value: string; selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-sm border text-sm font-body transition-all ${
        selected
          ? "border-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75/0.06)] text-[oklch(0.22_0.06_250)]"
          : "border-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] hover:border-[oklch(0.72_0.12_75/0.4)]"
      }`}
    >
      {children}
    </button>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-[oklch(0.88_0.015_75)] rounded-sm text-sm font-body text-[oklch(0.22_0.06_250)] placeholder-[oklch(0.65_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.12_75)] transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[oklch(0.22_0.06_250)] pt-28 pb-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[oklch(0.72_0.12_75)]" />
              <span className="text-[oklch(0.72_0.12_75)] text-xs font-body font-semibold tracking-[0.2em] uppercase">
                {language === "en" ? "Get In Touch" : "ติดต่อเรา"}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-4xl lg:text-5xl mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-[oklch(0.70_0.01_250)] font-body text-lg max-w-2xl">
              {t("contact.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-[oklch(0.97_0.008_75)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <FadeUp className="lg:col-span-1">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-xl mb-4">
                    {language === "en" ? "Contact Information" : "ข้อมูลติดต่อ"}
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        icon: MapPin,
                        labelEn: "Head Office",
                        labelTh: "สำนักงานใหญ่",
                        valueEn: "848-849 Sinthorn Village, Nawamin Road, Khlong Chan, Bangkapi, Bangkok 10240",
                        valueTh: "848-849 หมู่บ้านสินธร ถนนวมินทร์ แขวงคลองจั่น เขตบางกะปิ กทม. 10240",
                      },
                      {
                        icon: Phone,
                        labelEn: "Phone",
                        labelTh: "โทรศัพท์",
                        valueEn: "+66 2 375 3455-6",
                        valueTh: "+66 2 375 3455-6",
                      },
                      {
                        icon: Mail,
                        labelEn: "Email",
                        labelTh: "อีเมล",
                        valueEn: "roter@roter.co.th",
                        valueTh: "roter@roter.co.th",
                      },
                      {
                        icon: Clock,
                        labelEn: "Business Hours",
                        labelTh: "เวลาทำการ",
                        valueEn: "Mon–Fri: 8:30 AM – 5:30 PM",
                        valueTh: "จันทร์–ศุกร์: 8:30 – 17:30 น.",
                      },
                    ].map((item) => (
                      <div key={item.labelEn} className="flex gap-3">
                        <div className="w-9 h-9 rounded-sm bg-[oklch(0.22_0.06_250/0.06)] flex items-center justify-center shrink-0 mt-0.5">
                          <item.icon size={16} className="text-[oklch(0.22_0.06_250)]" />
                        </div>
                        <div>
                          <p className="text-xs font-body font-semibold text-[oklch(0.72_0.12_75)] mb-0.5">
                            {language === "en" ? item.labelEn : item.labelTh}
                          </p>
                          <p className="text-sm font-body text-[oklch(0.38_0.005_250)]">
                            {language === "en" ? item.valueEn : item.valueTh}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[oklch(0.22_0.06_250)] rounded-sm p-5">
                  <h3 className="font-display font-semibold text-white text-sm mb-2">
                    {language === "en" ? "Emergency Document Services" : "บริการเอกสารฉุกเฉิน"}
                  </h3>
                  <p className="text-xs text-[oklch(0.70_0.01_250)] font-body mb-3">
                    {language === "en"
                      ? "For urgent document recovery or disaster response, our emergency team is available 24/7."
                      : "สำหรับการกู้คืนเอกสารเร่งด่วนหรือการตอบสนองภัยพิบัติ ทีมฉุกเฉินของเราพร้อมให้บริการตลอด 24/7"}
                  </p>
                  <a href="tel:+66237534556" className="text-[oklch(0.72_0.12_75)] font-body font-semibold text-sm flex items-center gap-1">
                    <Phone size={13} /> +66 2 375 3455-6
                  </a>
                </div>
              </div>
            </FadeUp>

            {/* Multi-step Form */}
            <FadeUp delay={0.15} className="lg:col-span-2">
              <div className="bg-white border border-[oklch(0.88_0.015_75)] rounded-sm p-6 lg:p-8">
                {!submitted ? (
                  <>
                    {/* Progress */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-lg">
                          {language === "en" ? `Step ${step} of ${totalSteps}` : `ขั้นตอนที่ ${step} จาก ${totalSteps}`}
                        </h2>
                        <span className="text-xs font-body text-[oklch(0.52_0.02_250)]">
                          {step === 1 ? (language === "en" ? "Organization" : "องค์กร") :
                           step === 2 ? (language === "en" ? "Requirements" : "ความต้องการ") :
                           (language === "en" ? "Contact Details" : "ข้อมูลติดต่อ")}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((s) => (
                          <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[oklch(0.72_0.12_75)]" : "bg-[oklch(0.88_0.015_75)]"}`} />
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                          <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-1">
                            {language === "en" ? "Tell us about your organization" : "บอกเราเกี่ยวกับองค์กรของคุณ"}
                          </h3>
                          <p className="text-sm text-[oklch(0.52_0.02_250)] font-body mb-5">
                            {language === "en" ? "This helps us tailor our recommendations." : "สิ่งนี้ช่วยให้เราปรับคำแนะนำให้เหมาะสม"}
                          </p>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-2">
                                {language === "en" ? "Organization Type" : "ประเภทองค์กร"}
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {orgTypes.map((type) => (
                                  <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => update("orgType", type.value)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-sm border text-xs font-body font-medium transition-all ${
                                      form.orgType === type.value
                                        ? "border-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75/0.06)] text-[oklch(0.22_0.06_250)]"
                                        : "border-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] hover:border-[oklch(0.72_0.12_75/0.4)]"
                                    }`}
                                  >
                                    <type.icon size={18} />
                                    {language === "en" ? type.labelEn : type.labelTh}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <InputField
                              label={language === "en" ? "Organization Name" : "ชื่อองค์กร"}
                              value={form.orgName}
                              onChange={(v) => update("orgName", v)}
                              placeholder={language === "en" ? "e.g. Ministry of Finance" : "เช่น กระทรวงการคลัง"}
                            />
                            <div>
                              <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-2">
                                {language === "en" ? "Organization Size" : "ขนาดองค์กร"}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { value: "small", labelEn: "< 100 employees", labelTh: "< 100 คน" },
                                  { value: "medium", labelEn: "100–500 employees", labelTh: "100–500 คน" },
                                  { value: "large", labelEn: "500–5,000 employees", labelTh: "500–5,000 คน" },
                                  { value: "enterprise", labelEn: "> 5,000 employees", labelTh: "> 5,000 คน" },
                                ].map((size) => (
                                  <SelectOption key={size.value} value={size.value} selected={form.orgSize === size.value} onClick={() => update("orgSize", size.value)}>
                                    {language === "en" ? size.labelEn : size.labelTh}
                                  </SelectOption>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                          <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-1">
                            {language === "en" ? "What are your requirements?" : "ความต้องการของคุณคืออะไร?"}
                          </h3>
                          <p className="text-sm text-[oklch(0.52_0.02_250)] font-body mb-5">
                            {language === "en" ? "Select your primary need and project scope." : "เลือกความต้องการหลักและขอบเขตโครงการ"}
                          </p>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-2">
                                {language === "en" ? "Primary Service Needed" : "บริการหลักที่ต้องการ"}
                              </label>
                              <div className="space-y-2">
                                {primaryNeeds.map((need) => (
                                  <SelectOption key={need.value} value={need.value} selected={form.primaryNeed === need.value} onClick={() => update("primaryNeed", need.value)}>
                                    {language === "en" ? need.labelEn : need.labelTh}
                                  </SelectOption>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-2">
                                {language === "en" ? "Estimated Document Volume" : "ปริมาณเอกสารโดยประมาณ"}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { value: "small", labelEn: "< 10,000 docs", labelTh: "< 10,000 ฉบับ" },
                                  { value: "medium", labelEn: "10K–100K docs", labelTh: "10K–100K ฉบับ" },
                                  { value: "large", labelEn: "100K–1M docs", labelTh: "100K–1M ฉบับ" },
                                  { value: "massive", labelEn: "> 1M docs", labelTh: "> 1M ฉบับ" },
                                ].map((vol) => (
                                  <SelectOption key={vol.value} value={vol.value} selected={form.documentVolume === vol.value} onClick={() => update("documentVolume", vol.value)}>
                                    {language === "en" ? vol.labelEn : vol.labelTh}
                                  </SelectOption>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-2">
                                {language === "en" ? "Project Timeline" : "กรอบเวลาโครงการ"}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { value: "urgent", labelEn: "Urgent (< 1 month)", labelTh: "เร่งด่วน (< 1 เดือน)" },
                                  { value: "soon", labelEn: "1–3 months", labelTh: "1–3 เดือน" },
                                  { value: "planned", labelEn: "3–6 months", labelTh: "3–6 เดือน" },
                                  { value: "future", labelEn: "6+ months", labelTh: "6+ เดือน" },
                                ].map((tl) => (
                                  <SelectOption key={tl.value} value={tl.value} selected={form.timeline === tl.value} onClick={() => update("timeline", tl.value)}>
                                    {language === "en" ? tl.labelEn : tl.labelTh}
                                  </SelectOption>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                          <h3 className="font-display font-semibold text-[oklch(0.22_0.06_250)] text-base mb-1">
                            {language === "en" ? "Your contact details" : "ข้อมูลติดต่อของคุณ"}
                          </h3>
                          <p className="text-sm text-[oklch(0.52_0.02_250)] font-body mb-5">
                            {language === "en" ? "We'll get back to you within 24 hours." : "เราจะตอบกลับภายใน 24 ชั่วโมง"}
                          </p>
                          <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <InputField label={language === "en" ? "Full Name" : "ชื่อ-นามสกุล"} value={form.name} onChange={(v) => update("name", v)} required placeholder={language === "en" ? "Your full name" : "ชื่อ-นามสกุลของคุณ"} />
                              <InputField label={language === "en" ? "Job Title" : "ตำแหน่งงาน"} value={form.title} onChange={(v) => update("title", v)} placeholder={language === "en" ? "e.g. IT Director" : "เช่น ผู้อำนวยการ IT"} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <InputField label={language === "en" ? "Email Address" : "อีเมล"} value={form.email} onChange={(v) => update("email", v)} type="email" required placeholder="email@company.com" />
                              <InputField label={language === "en" ? "Phone Number" : "เบอร์โทรศัพท์"} value={form.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="+66 XX XXX XXXX" />
                            </div>
                            <div>
                              <label className="block text-xs font-body font-semibold text-[oklch(0.38_0.005_250)] mb-1.5">
                                {language === "en" ? "Additional Message" : "ข้อความเพิ่มเติม"}
                              </label>
                              <textarea
                                value={form.message}
                                onChange={(e) => update("message", e.target.value)}
                                rows={3}
                                placeholder={language === "en" ? "Any specific requirements or questions..." : "ความต้องการเฉพาะหรือคำถาม..."}
                                className="w-full px-4 py-2.5 border border-[oklch(0.88_0.015_75)] rounded-sm text-sm font-body text-[oklch(0.22_0.06_250)] placeholder-[oklch(0.65_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.12_75)] transition-colors resize-none"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-[oklch(0.88_0.015_75)]">
                      {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep((s) => s - 1)}
                          className="border-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] font-body font-medium text-sm">
                          <ArrowLeft size={14} className="mr-2" /> {language === "en" ? "Back" : "ย้อนกลับ"}
                        </Button>
                      ) : <div />}
                      {step < totalSteps ? (
                        <Button onClick={() => setStep((s) => s + 1)}
                          className="bg-[oklch(0.22_0.06_250)] text-white hover:bg-[oklch(0.28_0.07_250)] font-body font-medium text-sm">
                          {language === "en" ? "Continue" : "ดำเนินการต่อ"} <ArrowRight size={14} className="ml-2" />
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} disabled={isLoading}
                          className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)] hover:bg-[oklch(0.82_0.09_75)] disabled:opacity-50 disabled:cursor-not-allowed font-body font-semibold text-sm">
                          {isLoading ? <><Loader2 size={14} className="animate-spin mr-2" />Submitting...</> : <>{language === "en" ? "Submit Request" : "ส่งคำขอ"} <ArrowRight size={14} className="ml-2" /></>}
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[oklch(0.72_0.12_75/0.1)] flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-[oklch(0.72_0.12_75)]" />
                    </div>
                    <h3 className="font-display font-bold text-[oklch(0.22_0.06_250)] text-xl mb-2">
                      {language === "en" ? "Request Submitted!" : "ส่งคำขอแล้ว!"}
                    </h3>
                    <p className="text-[oklch(0.52_0.02_250)] font-body mb-6">
                      {language === "en"
                        ? `Thank you, ${form.name}. Our specialist will contact you at ${form.email} within 24 hours.`
                        : `ขอบคุณ ${form.name} ผู้เชี่ยวชาญของเราจะติดต่อคุณที่ ${form.email} ภายใน 24 ชั่วโมง`}
                    </p>
                    <Button onClick={() => { setSubmitted(false); setStep(1); setForm(initialForm); }}
                      variant="outline" className="border-[oklch(0.22_0.06_250)] text-[oklch(0.22_0.06_250)] font-body font-medium text-sm">
                      {language === "en" ? "Submit Another Request" : "ส่งคำขออีกครั้ง"}
                    </Button>
                  </motion.div>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
}
