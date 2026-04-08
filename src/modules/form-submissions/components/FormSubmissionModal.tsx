import { useFormRunner } from '../context/FormRunnerContext';
import { ContextSelectionStep } from './ContextSelectionStep';
import { FormsStep } from './FormsStep';
import { ReviewStep } from './ReviewStep';
import { useTranslation } from 'react-i18next';
import { ActionDialog } from '@/components/ui/action-dialog';
import { FormSubmissionStepper } from './FormSubmissionStepper';

export function FormSubmissionModal() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { isOpen, setIsOpen, currentStep } = useFormRunner();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContextSelectionStep />;
      case 2:
        return <FormsStep />;
      case 3:
        return <ReviewStep />;
      default:
        return null;
    }
  }

  return (
    
    <ActionDialog
      isOpen={isOpen}
      onOpenChange={() => setIsOpen(!isOpen)}
      cancelText={t("common.close")}
      title={t("forms.builder.title")}
      footer={false}
      contentClassName="max-w-5xl max-h-[90vh] overflow-y-auto"
    >
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="px-6 space-y-6">
          <FormSubmissionStepper/>
          {renderStep()}
        </div>
      </div>
    </ActionDialog>
  );
}
