import { FileTextIcon, ClockIcon, FileIcon, CookingPot, Edit, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Contract } from '../types';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';

interface ContractCardProps {
  contract: Contract;
  onView: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  onStatusChange: () => void;
}

export function ContractCard({ contract, onView, onEdit, onDelete, onStatusChange }: ContractCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="bg-card border rounded-2xl overflow-hidden transition-all hover:shadow-md shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-5 flex flex-col md:flex-row gap-6">
        
        {/* Main content block */}
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <FileTextIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground truncate">{contract?.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge
                onClick={onStatusChange}
                status={contract?.is_active}
                allowedRoles={['system_manager']}
              />
              {!contract.is_active && (
                <Badge 
                  variant="secondary"
                  className="text-xs font-semibold px-2 bg-muted hover:bg-muted/80 text-muted-foreground"
                >
                  {t('contracts.draft')}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {t('contracts.schedule')}: {t('contracts.daily')}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cn("flex md:items-start", isRTL ? "md:mr-auto" : "md:ml-auto")}>
          <RowActions
            row={contract}
            actions={[
              {
                icon: Eye,
                variant: "view",
                onClick: (row) => onView(row)
              },
              {
                icon: Edit,
                variant: 'edit',
                onClick: (row) => onEdit(row),
                allowedRoles: ['system_manager'],

              },
              {
                icon: Trash2,
                variant: 'destructive',
                onClick: (row) => onDelete(row),
                allowedRoles: ['system_manager'],
              },
            ]}
          />
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="border-t bg-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex items-center gap-3 col-span-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CookingPot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.kitchen')}</p>
              {contract?.kitchen ? (
                <Badge variant="outline" className="bg-muted/50 truncate max-w-fullx">
                  {contract.kitchen.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                  {t('contracts.noKitchen')}
                </Badge>
              )}
            </div>
          </div>
          
          {/* <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.dailyMeals')}</p>
               <p className="font-bold text-lg leading-none text-foreground">{contract?.total_meals}</p>
            </div>
          </div> */}

          <div className="flex items-center gap-3 ">
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <FileIcon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.mealType')}</p>
               <p className="font-bold text-sm bg-muted px-2 py-0.5 rounded-full capitalize text-foreground">
                 {contract.meal_type === 'buffet' ? t('contracts.buffet') : t('contracts.individual')}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10 text-warning">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.createdAt')}</p>
              <p className="font-bold text-sm leading-none text-foreground">
                {new Date(contract?.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}