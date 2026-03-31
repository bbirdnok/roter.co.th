import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, ChevronDown, Mail, Phone, Building, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AdminLeads() {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "qualified" | "rejected">("all");

  const leadsQuery = trpc.leads.list.useQuery({ limit: 100, offset: 0 });
  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(language === "en" ? "Status updated" : "อัปเดตสถานะแล้ว");
      leadsQuery.refetch();
    },
    onError: () => {
      toast.error(language === "en" ? "Failed to update status" : "ล้มเหลวในการอัปเดตสถานะ");
    },
  });

  const leads = leadsQuery.data || [];
  const filteredLeads = statusFilter === "all" ? leads : leads.filter(lead => lead.status === statusFilter);

  const statusConfig = {
    new: { label: language === "en" ? "New" : "ใหม่", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
    contacted: { label: language === "en" ? "Contacted" : "ติดต่อแล้ว", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    qualified: { label: language === "en" ? "Qualified" : "ผ่านคัดกรอง", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    rejected: { label: language === "en" ? "Rejected" : "ปฏิเสธ", color: "bg-red-100 text-red-800", icon: AlertCircle },
  };

  const orgTypeLabels: Record<string, { en: string; th: string }> = {
    government: { en: "Government", th: "รัฐบาล" },
    finance: { en: "Finance", th: "การเงิน" },
    healthcare: { en: "Healthcare", th: "สาธารณสุข" },
    enterprise: { en: "Enterprise", th: "องค์กรธุรกิจ" },
    education: { en: "Education", th: "การศึกษา" },
    other: { en: "Other", th: "อื่นๆ" },
  };

  const orgSizeLabels: Record<string, { en: string; th: string }> = {
    "<100": { en: "< 100", th: "< 100" },
    "100-500": { en: "100–500", th: "100–500" },
    "500-5000": { en: "500–5,000", th: "500–5,000" },
    ">5000": { en: "> 5,000", th: "> 5,000" },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[oklch(0.22_0.06_250)] mb-2">
            {language === "en" ? "Lead Management" : "จัดการลูกค้าศักยภาพ"}
          </h1>
          <p className="text-[oklch(0.52_0.02_250)]">
            {language === "en" ? "View and manage all lead submissions" : "ดูและจัดการการส่งข้อมูลลูกค้าศักยภาพทั้งหมด"}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(["all", "new", "contacted", "qualified", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-[oklch(0.72_0.12_75)] text-[oklch(0.22_0.06_250)]"
                  : "bg-[oklch(0.88_0.015_75)] text-[oklch(0.52_0.02_250)] hover:bg-[oklch(0.82_0.008_75)]"
              }`}
            >
              {status === "all"
                ? language === "en" ? "All" : "ทั้งหมด"
                : statusConfig[status].label}
            </button>
          ))}
        </div>

        {/* Leads List */}
        <div className="space-y-3">
          {leadsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[oklch(0.72_0.12_75)]" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 bg-[oklch(0.95_0.01_75)] rounded-sm p-8">
              <p className="text-[oklch(0.52_0.02_250)]">
                {language === "en" ? "No leads found" : "ไม่พบลูกค้าศักยภาพ"}
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const StatusIcon = statusConfig[lead.status as keyof typeof statusConfig].icon;
              const isExpanded = expandedId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="border border-[oklch(0.88_0.015_75)] rounded-sm overflow-hidden hover:border-[oklch(0.72_0.12_75/0.5)] transition-all"
                >
                  {/* Lead Summary */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[oklch(0.95_0.01_75)] transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[oklch(0.22_0.06_250)]">{lead.fullName}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusConfig[lead.status as keyof typeof statusConfig].color}`}>
                          <StatusIcon size={14} />
                          {statusConfig[lead.status as keyof typeof statusConfig].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[oklch(0.52_0.02_250)]">
                        <span className="flex items-center gap-1">
                          <Building size={14} />
                          {lead.organizationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(lead.createdAt).toLocaleDateString(language === "en" ? "en-US" : "th-TH")}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-[oklch(0.52_0.02_250)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-[oklch(0.95_0.01_75)] border-t border-[oklch(0.88_0.015_75)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Contact Info */}
                        <div>
                          <h4 className="font-semibold text-[oklch(0.22_0.06_250)] mb-3">
                            {language === "en" ? "Contact Information" : "ข้อมูลติดต่อ"}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-[oklch(0.72_0.12_75)]" />
                              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                                {lead.email}
                              </a>
                            </div>
                            {lead.phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-[oklch(0.72_0.12_75)]" />
                                <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                                  {lead.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Organization Info */}
                        <div>
                          <h4 className="font-semibold text-[oklch(0.22_0.06_250)] mb-3">
                            {language === "en" ? "Organization Details" : "รายละเอียดองค์กร"}
                          </h4>
                          <div className="space-y-2 text-sm text-[oklch(0.52_0.02_250)]">
                            <div>
                              <span className="font-medium">{language === "en" ? "Type:" : "ประเภท:"}</span>{" "}
                              {orgTypeLabels[lead.organizationType]?.[language] || lead.organizationType}
                            </div>
                            <div>
                              <span className="font-medium">{language === "en" ? "Size:" : "ขนาด:"}</span>{" "}
                              {orgSizeLabels[lead.organizationSize]?.[language] || lead.organizationSize}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {lead.message && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-[oklch(0.22_0.06_250)] mb-2">
                            {language === "en" ? "Message" : "ข้อความ"}
                          </h4>
                          <p className="text-sm text-[oklch(0.52_0.02_250)] bg-white p-3 rounded border border-[oklch(0.88_0.015_75)]">
                            {lead.message}
                          </p>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="flex gap-2 flex-wrap">
                        {(["new", "contacted", "qualified", "rejected"] as const).map((status) => (
                          <Button
                            key={status}
                            onClick={() => updateStatusMutation.mutate({ id: lead.id, status })}
                            disabled={updateStatusMutation.isPending || lead.status === status}
                            variant={lead.status === status ? "default" : "outline"}
                            className="text-sm"
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 size={14} className="animate-spin mr-1" />
                            ) : null}
                            {statusConfig[status].label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-[oklch(0.95_0.01_75)] rounded-sm">
          <p className="text-sm text-[oklch(0.52_0.02_250)]">
            {language === "en"
              ? `Showing ${filteredLeads.length} of ${leads.length} leads`
              : `แสดง ${filteredLeads.length} จาก ${leads.length} ลูกค้าศักยภาพ`}
          </p>
        </div>
      </div>
    </div>
  );
}
