import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteLocation } from "../hooks/useLocations";

interface DeleteLocationDialogProps {
  open: boolean;
  locationId: string | number | null;
  onClose: () => void;
}

export const DeleteLocationDialog: React.FC<DeleteLocationDialogProps> = ({
  open,
  locationId,
  onClose,
}) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending, error } = useDeleteLocation();

  const handleDelete = async () => {
    if (!locationId) return;

    try {
      await mutateAsync(locationId);

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
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground max-w-sm">
          {t("locations.deleteConfirmDesc")}
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
