import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useFormRunner } from "../context/FormRunnerContext";

interface StepLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export function FormSubmissionStepLayout({
  title,
  description,
  children,
  onNext,
  isNextDisabled,
  isLoading,
}: StepLayoutProps) {

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { currentStep, prevStep } = useFormRunner();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 3; 

  return (
    <div className="flex min-h-[70vh] flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-4 md:mb-6">
        {title && <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>}
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
          <Button type="button" variant="outline" onClick={prevStep} size="sm" disabled={isFirstStep}>
            {t('contracts.stepLayout.back')}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            className="min-w-[100px]"
            size="sm"
          >
            {isLoading ? t('common.loading') : isLastStep ? t('forms.save') : t('forms.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
