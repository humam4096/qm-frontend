import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteLocation } from "../hooks/useLocations";
import type { Location } from "../types";

interface DeleteLocationDialogProps {
  open: boolean;
  location: Location | null;
  onClose: () => void;
}

export const DeleteLocationDialog: React.FC<DeleteLocationDialogProps> = ({
  open,
  location,
  onClose,
}) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending, error } = useDeleteLocation();

  const handleDelete = async () => {
    if (!location?.id) return;

    try {
      await mutateAsync(location?.id);

      toast.success(t("locations.deleteSuccess"));
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          t("common.unexpectedError")
      );
      console.log(err);
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && !isPending && onClose()}
      onSubmit={handleDelete}
      title={t("locations.deleteConfirmTitle")}
      isDestructive
      contentClassName="max-w-lg"
      isLoading={isPending}
      footer
    >
      <div className="w-full space-y-4">
        <div className="py-4 text-muted-foreground">
          {t("locations.deleteConfirmDesc")}
        </div>

        <div className="w-full flex items-center justify-center gap-2">
          <span className="font-medium">{t("locations.name")}:</span>
          <span className="text-muted-foreground">{location?.name}</span>
        </div>

        {error && (
          <div className="w-full text-destructive text-center">
            {error instanceof Error
              ? error.message
              : t("common.unexpectedError")}
          </div>
        )}
      </div>
    </ActionDialog>
  );
};
