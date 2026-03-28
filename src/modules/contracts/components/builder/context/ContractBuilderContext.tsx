import React, { createContext, useContext, useState } from 'react';

export type ContractBuilderContextType = {
  contractId: string | null;
  setContractId: (id: string | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  highestStep: number;
  setHighestStep: (step: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
};

const ContractBuilderContext = createContext<ContractBuilderContextType | undefined>(undefined);

export const ContractBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractId, setContractId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // When modal closes, we might want to reset state if we don't want to keep drafts globally active
  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optional: reset state on close, or keep it for "resume draft"
      // setContractId(null);
      // setCurrentStep(1);
      // setHighestStep(1);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (highestStep < next) setHighestStep(next);
      return next;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goToStep = (step: number) => {
    if (step <= highestStep) {
      setCurrentStep(step);
    }
  };

  return (
    <ContractBuilderContext.Provider value={{
      contractId, setContractId,
      currentStep, setCurrentStep,
      highestStep, setHighestStep,
      isOpen, setIsOpen: handleSetIsOpen,
      isSaving, setIsSaving,
      nextStep, prevStep, goToStep
    }}>
      {children}
    </ContractBuilderContext.Provider>
  );
};

export const useContractBuilder = () => {
  const context = useContext(ContractBuilderContext);
  if (!context) {
    throw new Error('useContractBuilder must be used within a ContractBuilderProvider');
  }
  return context;
};
