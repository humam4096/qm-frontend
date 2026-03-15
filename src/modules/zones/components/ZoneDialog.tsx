import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { ZoneDisplay } from "./ZoneDisplay";
import type { Zone } from "../types";

interface ZoneDialogProps {
  open: boolean;
  zone: Zone | null;
  onOpenChange: (open: boolean) => void;
}

export const ZoneDialog: React.FC<ZoneDialogProps> = ({
  open,
  zone,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("zones.zoneDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
        <div className="py-4">
          <ZoneDisplay data={zone} />
        </div>
    </ActionDialog>
  );
};