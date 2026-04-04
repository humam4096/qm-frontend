import { FormMetaTab } from "./FormMetaTap";
import { FormSectionBuilderTap } from "./FormSectionBuilderTap";
import { FormPreview } from "./Preview/FormPreview";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { FormStepper } from "./FormStepper";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useTranslation } from "react-i18next";

export const FormBuilderModal = () => {
  const { currentStep, setIsOpen, isOpen } = useFormBuilderContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FormMetaTab />;
      case 2:
        return <FormSectionBuilderTap />;
      case 3:
        return <FormPreview />;
      default:
        return null;
    }
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onOpenChange={() => setIsOpen(!isOpen)}
      cancelText={t("common.close")}
      title={t("forms.builder.title")}
      footer={false}
      contentClassName="max-w-5xl max-h-[90vh] overflow-y-auto"
    >
      <div className="py-2 md:py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="p-6 space-y-6">
          <FormStepper/>
          {renderStep()}
        </div>
      </div>
    </ActionDialog>
  );
};