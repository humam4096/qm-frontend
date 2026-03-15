import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { ZoneCardSkeleton } from "./ZoneCardSkeleton";
import { ZoneDisplay } from "./ZoneDisplay";
import { useGetZoneById } from "../hooks/useZones";

interface ZoneDialogProps {
  open: boolean;
  elId: string | number | null;
  onOpenChange: (open: boolean) => void;
}

export const ZoneDialog: React.FC<ZoneDialogProps> = ({
  open,
  elId,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useGetZoneById(elId ?? "");

  const zone = data?.data;

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("zones.zoneDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
      {isLoading && (
        <div className="">
          {Array.from({ length: 2 }).map((_, i) => (
            <ZoneCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && zone && (
        <div className="py-4">
          <ZoneDisplay data={zone} />
        </div>
      )}

      {isError && (
        <div className="py-6 text-center text-destructive">
          {error instanceof Error
            ? error.message
            : t("common.unexpectedError")}
        </div>
      )}
    </ActionDialog>
  );
};