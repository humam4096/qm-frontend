import { FileTextIcon, TrashIcon, EditIcon, EyeIcon, ClockIcon, FileIcon, CookingPotIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Contract } from '../types';


interface ContractCardProps {
  contract: Contract;
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contractId: string) => void;
}

export function ContractCard({ contract, onView, onEdit, onDelete }: ContractCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-[#FAF9F6] border rounded-2xl overflow-hidden transition-all hover:shadow-md">
      <div className="p-5 flex flex-col md:flex-row gap-6">
        
        {/* Right side block (Icon & Title in RTL) */}
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <FileTextIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-boldx">{contract.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge 
                variant={contract.is_active ? "default" : "secondary"} 
                className={cn(
                  "text-xs font-semibold px-2 hover:bg-transparent", 
                  contract.is_active && "bg-green-600 hover:bg-green-600"
                )}
              >
                {contract.is_active ? t('contracts.active') : t('contracts.draft')}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t('contracts.schedule')}: {t('contracts.daily')}
              </span>
            </div>
          </div>
        </div>

        {/* Left side actions */}
        <div className="flex items-start md:items-center gap-2 justify-end self-start">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg gap-1.5 px-3"
            onClick={() => onView?.(contract)}
          >
            {t('contracts.view')} <EyeIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg gap-1.5 px-3"
            onClick={() => onEdit?.(contract)}
          >
            {t('contracts.edit')} <EditIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete?.(contract.id)} 
            className="rounded-lg gap-1.5 px-3 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
          >
            {t('contracts.delete')} <TrashIcon className="w-4 h-4" />
          </Button>
        </div>

      </div>

      {/* Bottom Info Bar */}
      <div className="border-t bg-white p-5 flex flex-wrap gap-8 items-center justify-between lg:justify-start">
         <div className="flex flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <CookingPotIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.kitchen')}</p>
            <Badge variant="outline" className="bg-muted/50">{contract?.kitchen.name}</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
            <FileTextIcon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.dailyMeals')}</p>
             <p className="font-boldx text-lg leading-none">{contract.total_meals}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <FileIcon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.mealType')}</p>
             <p className="font-boldx text-sm bg-gray-100 px-2 py-0.5 rounded-full capitalize">{contract.meal_type}</p>
          </div>
        </div>

        <div className="flex-1 flex justify-end gap-3">
          <div className="p-2 rounded-xl bg-green-100 text-green-600">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
             <p className="text-xs text-muted-foreground mb-0.5">{t('contracts.createdAt')}</p>
             <p className="font-boldx text-sm leading-none">{new Date(contract.created_at).toLocaleDateString()}</p>
          </div>
        </div>

       
       
      </div>
    </div>
  );
}