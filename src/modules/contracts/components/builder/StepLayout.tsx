import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useContractBuilder } from "./context/ContractBuilderContext";

interface StepLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
}

export function StepLayout({
  title,
  description,
  children,
  onNext,
  isNextDisabled,
  isNextLoading,
}: StepLayoutProps) {

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { currentStep, prevStep, isSaving } = useContractBuilder();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5; // Updated to use hardcoded value since STEPS is no longer exported

  return (
    <div className="flex h-full flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4 px-1">
        {children}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 -mx-4 md:-mx-6 -mb-6 mt-4 flex items-center justify-between border-t bg-background/95 px-4 md:px-6 py-3 md:py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button type="button" variant="outline" onClick={prevStep} disabled={isSaving} size="sm">
              {t('contracts.stepLayout.back')}
            </Button>
          )}
          <div className="text-xs text-muted-foreground ml-2 md:ml-4">
            {isSaving ? t('contracts.stepLayout.savingDraft') : ""}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isSaving || isNextLoading}
            className="min-w-[100px]"
            size="sm"
          >
            {isNextLoading ? t('contracts.stepLayout.saving') : isLastStep ? t('contracts.stepLayout.publishContract') : t('contracts.stepLayout.saveNext')}
          </Button>
        </div>
      </div>
    </div>
  );
}
