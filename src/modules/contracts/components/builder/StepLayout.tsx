import React from "react";
import { Button } from "@/components/ui/button";
import { useContractBuilder } from "./context/ContractBuilderContext";
import { STEPS } from "./Stepper";

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

  const { currentStep, prevStep, isSaving } = useContractBuilder();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4 px-1">
        {children}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-between border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button type="button" variant="outline" onClick={prevStep} disabled={isSaving}>
              Back
            </Button>
          )}
          <div className="text-xs text-muted-foreground ml-4">
            {isSaving ? "Saving draft..." : ""}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isSaving || isNextLoading}
            className="min-w-[100px]"
          >
            {isNextLoading ? "Saving..." : isLastStep ? "Publish Contract" : "Save & Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
