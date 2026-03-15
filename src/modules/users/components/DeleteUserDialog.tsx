import React from 'react';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';
import { useDeleteUser } from '../hooks/useUsers';
import { toast } from 'sonner';
import type { User } from '../types';

interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending, error } = useDeleteUser()

  const handleDelete = async () => {
    if (!user?.id) return

    await mutateAsync(user.id)
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
      <div className="w-full space-y-4">
        <div className="w-full py-4 text-muted-foreground">
          {t('users.deleteConfirmDesc')}
          <br />
          <div className="w-full text-center font-bold text-foreground">
           { user?.name }
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