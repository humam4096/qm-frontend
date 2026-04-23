import React from "react";
import type { Complaint } from "../types";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink } from "lucide-react";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";

interface ComplaintDisplayProps {
  complaint: Complaint | null;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    open: "bg-yellow-500/10 text-yellow-600",
    in_progress: "bg-green-500/10 text-green-600",
    resolved: "bg-blue-500/10 text-blue-600",
    closed: "bg-red-500/10 text-red-600",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${map[status] || "bg-muted"}`}>
      {status}
    </span>
  );
};


export const ComplaintDisplay: React.FC<ComplaintDisplayProps> = ({
  complaint,
}) => {
  const { t } = useTranslation();

  if (!complaint) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {t("complaints.empty")}
      </div>
    );
  }

  const isImage = (mime?: string) => mime?.startsWith("image/");
  const getFileName = (file: any) =>
    file?.file_name ?? file?.name ?? file?.original_name ?? file?.filename ?? "attachment";

  return (
    <Card className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {complaint.kitchen?.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {complaint.complaint_type?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {t(`complaints.status`)}
            <StatusBadge status={complaint.status} />
          </div>
          <div className="flex items-center gap-2">
            {t(`complaints.priority`)}
            <PriorityBadge status={complaint.priority} />
          </div>
        </div>
      </div>

      {/* ================= META ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border rounded-xl p-4 bg-muted/30">
        <MetaItem label={t("complaints.raisedBy")} value={complaint.raised_by?.name} />

        <MetaItem
          label={t("common.createdAt")}
          value={new Date(complaint.created_at).toLocaleString()}
        />

        {complaint.solved_by && (
          <div className="space-y-1 col-span-2">
            <p className="text-xs text-muted-foreground">
              {t("complaints.solvedBy")}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium">{complaint.solved_by.name}</span>
              <Badge variant="secondary" className="text-xs capitalize">
                {complaint.solved_by.role}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* ================= DESCRIPTION ================= */}
      <Section title={t("complaints.description")}>
        <p className="text-sm leading-relaxed">
          {complaint.description}
        </p>
      </Section>

      {/* ================= RESOLUTION ================= */}
      {complaint.resolution_notes && (
        <Section title={t("complaints.resolutionNotes")}>
          <p className="text-sm leading-relaxed">
            {complaint.resolution_notes}
          </p>
        </Section>
      )}

      {/* ================= ATTACHMENTS ================= */}
      {complaint.attachments?.length > 0 && (
        <Section title={t("complaints.attachments")}>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {complaint.attachments.map((file: any) => (
              <div
                key={file.id}
                className="group border rounded-lg overflow-hidden bg-background hover:shadow-sm transition"
              >
                {/* Preview */}
                {isImage(file.mime_type) ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title={t("common.open")}
                  >
                    <img
                      src={file.url}
                      alt={getFileName(file)}
                      className="h-28 w-full object-cover"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 flex items-start justify-end gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[11px] text-foreground shadow-sm">
                        <ExternalLink className="size-3.5" />
                        {t("common.open")}
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="h-28 flex items-center justify-center text-xs text-muted-foreground">
                    {getFileName(file)}
                  </div>
                )}

                {/* Info */}
                <div className="p-2 space-y-0.5">
                  <p className="text-xs font-medium truncate">
                    {getFileName(file)}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-muted-foreground truncate">
                      {file.file_size}
                    </p>

                    <a
                      href={file.url}
                      download={getFileName(file)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={(event) => event.stopPropagation()}
                      title={t("common.download")}
                      aria-label={t("common.download")}
                    >
                      <Download className="size-3.5" />
                      <span className="hidden sm:inline">{t("common.download")}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </Section>
      )}
    </Card>
  );
};

/* ================= REUSABLE SUB COMPONENTS ================= */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const MetaItem: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);