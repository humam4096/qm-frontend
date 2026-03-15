import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Badge } from '@/components/ui/badge';
import type { InspectionStage } from '../types';

interface InspectionStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage?: InspectionStage | null;
}

export const InspectionStageDialog: React.FC<InspectionStageDialogProps> = ({
  open,
  onOpenChange,
  stage,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t('inspectionStages.stageDetails')}
      contentClassName="max-w-2xl"
    >
      {stage ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('inspectionStages.name')}</p>
              <p className="font-medium">{stage.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('common.status')}</p>
              <Badge variant={stage.is_active ? 'default' : 'secondary'}>
                {stage.is_active ? t('common.active') : t('common.inactive')}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t('inspectionStages.description')}</p>
            <p className="font-medium">{stage.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('inspectionStages.sequenceOrder')}</p>
              <p className="font-medium">{stage.sequence_order}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('inspectionStages.allowedEarlyMinutes')}</p>
              <p className="font-medium">{stage.timing.allowed_early_minutes}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('inspectionStages.allowedDelayMinutes')}</p>
              <p className="font-medium">{stage.timing.allowed_delay_minutes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('inspectionStages.requiresNotification')}</p>
              <Badge variant={stage.timing.requires_notification ? 'default' : 'secondary'}>
                {stage.timing.requires_notification ? t('common.yes') : t('common.no')}
              </Badge>
            </div>
          </div>

          {stage.is_for_hajj && (
            <div>
              <p className="text-sm text-muted-foreground">{t('inspectionStages.hajj')}</p>
              <Badge variant={stage.is_active ? 'default' : 'secondary'}>
                {t('inspectionStages.hajj')}
              </Badge>
            </div>
          )}
        </div>
      ) : null}
    </ActionDialog>
  );
};
