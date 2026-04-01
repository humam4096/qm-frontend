import { FileTextIcon, ClockIcon, FileIcon, CookingPot, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Contract } from '../../contracts/types';
import { RowActions } from '@/components/ui/row-actions';
import { StatusBadge } from '@/components/ui/status-badge';

interface ContractCardProps {
  contract: Contract;
  onView: (contract: Contract) => void;
  index: number;
}

export function KitchenContractCard({ contract, onView, index }: ContractCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="bg-card border rounded-2xl overflow-hidden transition-all hover:shadow-md shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="px-4 py-2 flex flex-colx items-center justify-center md:flex-row gap-6">
        
        <div className="flex items-center justify-center px-2 border-r-2 border-gray-300">
          <h5 className="text-xlx font-boldx text-foreground truncate">{index + 1}</h5>
        </div>

        <div className="flex flex-1 items-center justify-center gap-4 ">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <FileTextIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xlx font-boldx text-foreground truncate">{contract?.name}</h5>
          </div>
        </div>
    
        <div className="flex flex-1 items-center justify-center gap-2 flex-wrap">
          <StatusBadge
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

        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <CookingPot className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.kitchen')}</p>
            {contract?.kitchen ? (
              <Badge variant="outline" className="bg-muted/50 truncate max-w-full">
                {contract.kitchen.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                {t('contracts.noKitchen')}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-1 items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <FileTextIcon className="w-5 h-5" />
          </div>
          <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.dailyMeals')}</p>
              <p className="font-bold text-md leading-none text-foreground">{contract?.total_meals}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <div className="p-2 rounded-xl bg-success/10 text-success">
            <FileIcon className="w-5 h-5" />
          </div>
          <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.mealType')}</p>
              <p className="font-boldx text-sm bg-muted px-2 py-0.5 rounded-full capitalize text-foreground">
                {contract.meal_type === 'buffet' ? t('contracts.buffet') : t('contracts.individual')}
              </p>
          </div>
        </div>

          <div className="flex flex-1 items-center gap-3">
          <div className="p-2 rounded-xl bg-warning/10 text-warning">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.createdAt')}</p>
            <p className="font-boldx text-sm leading-none text-foreground">
              {new Date(contract?.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={cn("flex flex-1x md:items-start", isRTL ? "md:mr-auto" : "md:ml-auto")}>
          <RowActions
            row={contract}
            actions={[
              {
                icon: Eye,
                variant: "view",
                onClick: (row) => onView(row)
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}