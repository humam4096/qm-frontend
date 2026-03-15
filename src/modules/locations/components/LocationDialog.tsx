import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { LocationDisplay } from "./LocationDisplay";
import type { Location } from "../types";

interface LocationDialogProps {
  open: boolean;
  location: Location | null;
  onOpenChange: (open: boolean) => void;
}

export const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  location,
  onOpenChange,
}) => {
  const { t } = useTranslation();


  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("locations.locationDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
      <div className="py-4">
        <LocationDisplay data={location} />
      </div>
    </ActionDialog>
  );
};
