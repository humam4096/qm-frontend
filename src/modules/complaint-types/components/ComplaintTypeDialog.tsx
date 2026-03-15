import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Badge } from '@/components/ui/badge';
import type { ComplaintType } from '../types';

interface ComplaintTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintType: ComplaintType | null;
}

export const ComplaintTypeDialog: React.FC<ComplaintTypeDialogProps> = ({
  open,
  onOpenChange,
  complaintType,
}) => {
  const { t } = useTranslation();

  if (!complaintType) return null;

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('complaintTypes.complaintTypeDetails')}
      submitText={t('common.close')}
      cancelText=""
      onSubmit={() => onOpenChange(false)}
      contentClassName="max-w-2xl"
      footer
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('complaintTypes.name')}</p>
            <p className="font-semibold">{complaintType.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('complaintTypes.status')}</p>
            <Badge variant={complaintType.is_active ? 'default' : 'secondary'}>
              {complaintType.is_active ? t('common.active') : t('common.inactive')}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t('complaintTypes.description')}</p>
          <p className="font-semibold whitespace-pre-wrap">{complaintType.description}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t('complaintTypes.createdAt')}</p>
          <p className="font-semibold">
            {new Date(complaintType.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </ActionDialog>
  );
};
