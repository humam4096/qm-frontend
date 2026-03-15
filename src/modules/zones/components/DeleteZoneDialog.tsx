import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteZone } from "../hooks/useZones";

interface DeleteZoneDialogProps {
  open: boolean;
  zoneId: string | number | null;
  onClose: () => void;
}

export const DeleteZoneDialog: React.FC<DeleteZoneDialogProps> = ({
  open,
  zoneId,
  onClose,
}) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending, error } = useDeleteZone();

  const handleDelete = async () => {
    if (!zoneId) return;

    try {
      await mutateAsync(zoneId);

      toast.success(t("zones.deleteSuccess"));
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          t("common.unexpectedError")
      );
      console.log(err)
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && !isPending && onClose()}
      onSubmit={handleDelete}
      title={t("zones.deleteConfirmTitle")}
      isDestructive
      contentClassName="max-w-lg"
      isLoading={isPending}
      footer
      
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground max-w-sm">
          {t("zones.deleteConfirmDesc")}
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