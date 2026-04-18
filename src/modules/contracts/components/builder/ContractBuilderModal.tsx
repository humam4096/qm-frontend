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

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
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
    <>
      {isOpen && 
        <ActionDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={t('contracts.contractBuilder')}
        submitText={t('common.save')}
        cancelText={t('common.cancel')}
        contentClassName="max-w-5xl"
      >
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 pb-2" dir={isRTL ? 'rtl' : 'ltr'}>
          <Stepper />
          <div className="max-h-[550px] overflow-y-auto">
            {renderStep()}
          </div>
        </div>
      </ActionDialog>}
    </>
  );
}
