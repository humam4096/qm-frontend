import React from "react";
import type { Complaint } from "../types";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

interface ComplaintDisplayProps {
  complaint: Complaint | null;
}

export const ComplaintDisplay: React.FC<ComplaintDisplayProps> = ({
  complaint,
}) => {
  const { t } = useTranslation();

  if (!complaint) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        {t("complaints.empty")}
      </div>
    );
  }

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{complaint.kitchen?.name}</h3>
            <p className="text-sm text-muted-foreground">{complaint.complaint_type?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t("complaints.priority")}</p>
            <p className="font-medium capitalize">{complaint.priority}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("complaints.status")}</p>
            <p className="font-medium capitalize">{complaint.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("complaints.raisedBy")}</p>
            <p className="font-medium">{complaint.raised_by?.name}</p>
          </div>
          {complaint.solved_by && (
            <div>
              <p className="text-muted-foreground">{t("complaints.solvedBy")}</p>
              <p className="font-medium">{complaint.solved_by.name}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-muted-foreground text-sm">{t("complaints.description")}</p>
          <p className="mt-2">{complaint.description}</p>
        </div>

        {complaint.resolution_notes && (
          <div>
            <p className="text-muted-foreground text-sm">{t("complaints.resolutionNotes")}</p>
            <p className="mt-2">{complaint.resolution_notes}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {t("common.createdAt")}: {new Date(complaint.created_at).toLocaleDateString()}
        </div>
      </Card>

      {/* State change confirmation dialog */}
      {/* <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("complaints.changeStatus")}
        description={t("complaints.changeStatusConfirm")}
        submitText={t("common.confirm")}
        cancelText={t("common.cancel")}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t("complaints.statusChangeWarning")}
        </p>
      </ActionDialog> */}
    </>
  );
};
