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
  const { t } = useTranslation();

  return (
    <div className="bg-card border rounded-2xl overflow-hidden transition-all hover:shadow-md shadow-sm">
      <div className="p-5 flex flex-col md:flex-row gap-6">
        
        {/* Right side block (Icon & Title in RTL) */}
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <FileTextIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{contract?.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge
                onClick={onStatusChange}
                status={contract?.is_active}
              />
              { !contract.is_active && <Badge 
                variant={contract?.is_active ? "default" : "secondary"} 
                className={cn(
                  "text-xs font-semibold px-2 hover:bg-transparent", 
                  contract?.is_active && "bg-success hover:bg-success text-white"
                )}
              >
                {t('contracts.draft')}
              </Badge>}
           
              <span className="text-sm text-muted-foreground">
                {t('contracts.schedule')}: {t('contracts.daily')}
              </span>
            </div>
          </div>
        </div>

        {/* Left side actions */}
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
            },
            {
              icon: Trash2,
              variant: 'destructive',
              onClick: (row) => onDelete(row),
            },
          ]}
        />
      </div>

      {/* Bottom Info Bar */}
      <div className="border-t bg-card p-5 flex flex-wrap gap-8 items-center justify-between lg:justify-start">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <CookingPot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.kitchen')}</p>
            {contract?.kitchen ? (
              <Badge variant="outline" className="bg-muted/50">
                {contract.kitchen.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                {t('contracts.noKitchen')}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <FileTextIcon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.dailyMeals')}</p>
             <p className="font-bold text-lg leading-none text-foreground">{contract?.total_meals}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-success/10 text-success">
            <FileIcon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.mealType')}</p>
             <p className="font-bold text-sm bg-muted px-2 py-0.5 rounded-full capitalize text-foreground">{contract.meal_type}</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-endx gap-3">
          <div className="p-2 rounded-xl bg-warning/10 text-warning">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div className='flex gap-2'>
            <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.createdAt')}</p>
            <p className="font-bold text-sm leading-none text-foreground">{new Date(contract?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}