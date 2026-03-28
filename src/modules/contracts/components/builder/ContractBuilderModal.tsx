import { useTranslation } from 'react-i18next';
import { useContractBuilder } from "./context/ContractBuilderContext";
import { Stepper } from "./Stepper";

// Import steps
import { BasicInfoForm } from "./steps/BasicInfoForm";
import { DateList } from "./steps/DateList";
import { TimeWindowList } from "./steps/TimeWindowList";
import { MealBuilder } from "./steps/MealBuilder";
import { ReviewSummary } from "./steps/ReviewSummary";
import { ActionDialog } from "@/components/ui/action-dialog";

export function ContractBuilderModal() {

  const { t } = useTranslation();
  const { isOpen, setIsOpen, currentStep } = useContractBuilder();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoForm />;
      case 2:
        return <DateList />;
      case 3:
        return <TimeWindowList />;
      case 4:
        return <MealBuilder />;
      case 5:
        return <ReviewSummary />;
      default:
        return null;
    }
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={t('contracts.contractBuilder')}
      submitText={t('common.save')}
      cancelText={t('common.cancel')}
      //  onSubmit={handleSubmit(setIsOpen)}
      // isLoading={false} 
      contentClassName="max-w-6xl"
    >
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-2">
        <Stepper />
        <div className="h-[calc(100%-80px)]">
          {renderStep()}
        </div>
      </div>
    </ActionDialog>
  );
}
