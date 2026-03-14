import React from 'react';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';
import { useDeleteUser } from '../hooks/useUsers';
import { toast } from 'sonner';

interface DeleteUserDialogProps {
  open: boolean;
  userId: string | null | number;
  onClose: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  userId,
  onClose,
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending, error } = useDeleteUser()

  const handleDelete = async () => {
    if (!userId) return

    await mutateAsync(userId)
    toast.success(t('users.deleteSuccess'));
    onClose()
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={(open) => !open && onClose()}
      onSubmit={handleDelete}
      title={t('users.deleteConfirmTitle')}
      submitText={t('users.yesDelete')}
      cancelText={t('users.cancel')}
      isDestructive
      isLoading={isPending}
      footer
      contentClassName="max-w-lg"
    >
      <div className="space-y-4">
        <div className="py-4 text-muted-foreground max-w-sm">
          {t('users.deleteConfirmDesc')}
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