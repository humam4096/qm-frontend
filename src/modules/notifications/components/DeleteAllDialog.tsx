import React from "react";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";

interface DeleteAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  error: Error | null;
}

export const DeleteAllDialog: React.FC<DeleteAllDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  error,
}) => {

  const { t } = useTranslation();
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      onSubmit={handleConfirm}
      title={t('users.deleteConfirmTitle')}
      submitText={t('users.yesDelete')}
      cancelText={t('users.cancel')}
      isDestructive
      isLoading={isDeleting}
      footer
      contentClassName="max-w-lg"
    >
      <div className="w-full space-y-4">
        <div className="w-full py-4 text-muted-foreground">
          {t('notifications.deleteAllConfirm')}
          <br />
          <div className="w-full text-center font-bold text-foreground">
            {t('notifications.allNotifications')}
          </div>
        </div>

        {error && (
          <div className="w-full text-destructive text-center">
            {error instanceof Error ? error.message : t("common.unexpectedError")}
          </div>
        )}
      </div>
    </ActionDialog>
  );
};
