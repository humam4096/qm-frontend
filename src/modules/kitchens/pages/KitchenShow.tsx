import React from 'react'
import { KitchenDisplay } from '../components/KitchenDisplay'
import { useParams } from 'react-router-dom'
import { useGetKitchenById, useGetKitchenContracts } from '../hooks/useKitchens'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { useTranslation } from 'react-i18next'
import { KitchenShowSkeleton } from '../components/KithcenShowSkeleton'
import { KitchenContractDialog } from '../components/KitchenContractDialog'
import { useDialogState } from '@/hooks/useDialogState'
import type { Contract } from '@/modules/contracts/types'
import { RoleGuard } from '@/app/router/RoleGuard'

export const KitchenShow: React.FC = () => {
  const { t } = useTranslation();
  
  const { kitchen_id } = useParams()

  const { data: kitchen, isLoading, isError } = useGetKitchenById(kitchen_id || "")
  const { data: contracts } = useGetKitchenContracts(kitchen_id || "")
  
  // Dialog State
  const { 
    dialog,
    openView,
    close
  } = useDialogState<Contract>();
  
  // Missing ID
  if (!kitchen_id) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>{t("common.missingId")}</p>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title={t("kitchens.kitchenDetails")}
          description={t("kitchens.subtitle")}
        />
        <KitchenShowSkeleton/>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>{t("common.somethingWentWrong")}</p>
      </div>
    );
  }

  // No Data
  if (!kitchen?.data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p>{t("common.noData")}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("kitchens.kitchenDetails")}
        description={t("kitchens.subtitle")}
      />

      <KitchenDisplay 
        data={kitchen.data} 
        openView={openView}
        contracts={contracts?.data}
      />

      {/* Kitchen Dialog */}
      <RoleGuard allowedRoles={['system_manager', 'quality_manager']}>
        <KitchenContractDialog
          open={dialog?.type === 'view'}
          onOpenChange={(open: boolean) => !open && close()}
          contract={dialog?.type === 'view' ? dialog.item : null}
        />
      </RoleGuard>

    </div>  
  )
}
