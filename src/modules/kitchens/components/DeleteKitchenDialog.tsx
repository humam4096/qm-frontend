import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteKitchen } from "../hooks/useKitchens";
import type { Kitchen } from "../types";

interface DeleteKitchenDialogProps {
  open: boolean;
  kitchen: Kitchen | null;
  onClose: () => void;
}

export const DeleteKitchenDialog: React.FC<DeleteKitchenDialogProps> = ({
  open,
  kitchen,
  onClose,
}) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending, error } = useDeleteKitchen();

  const handleDelete = async () => {
    if (!kitchen?.id) return;

    try {
      await mutateAsync(kitchen?.id);

      toast.success(t("kitchens.deleteSuccess"));
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
      title={t("kitchens.deleteConfirmTitle")}
      isDestructive
      contentClassName="max-w-lg"
      isLoading={isPending}
      footer
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground">
          {t("kitchens.deleteConfirmDesc")}
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
