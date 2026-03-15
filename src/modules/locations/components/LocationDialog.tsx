import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { LocationCardSkeleton } from "./LocationCardSkeleton";
import { LocationDisplay } from "./LocationDisplay";
import { useGetLocationById } from "../hooks/useLocations";

interface LocationDialogProps {
  open: boolean;
  elId: string | number | null;
  onOpenChange: (open: boolean) => void;
}

export const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  elId,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useGetLocationById(elId ?? "");

  const location = data?.data;

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("locations.locationDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
      {isLoading && (
        <div className="">
          {Array.from({ length: 1 }).map((_, i) => (
            <LocationCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && location && (
        <div className="py-4">
          <LocationDisplay data={location} />
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
