import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Form } from '@/modules/forms/types';
import type { Answer } from '../types';

interface FormRunnerState {
  kitchen_id: string | null;
  day: string | null;
  meal_id: string | null;
  stage_id: string | null;
  forms: Form[];
  answers: Record<string, { answers: Answer[] }>;
}

interface FormRunnerContextValue extends FormRunnerState {
  setKitchen: (id: string) => void;
  setDay: (day: string) => void;
  setMeal: (id: string) => void;
  setStage: (id: string) => void;
  setForms: (forms: Form[]) => void;
  updateAnswer: (formId: string, answer: Answer) => void;
  resetRunner: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  highestStep: number;
  goToStep: (step: number) => void;
}

const FormRunnerContext = createContext<FormRunnerContextValue | null>(null);

const STORAGE_KEY = 'form-runner-state';

const initialState: FormRunnerState = {
  kitchen_id: null,
  day: null,
  meal_id: null,
  stage_id: null,
  forms: [],
  answers: {},
};

const loadState = (): FormRunnerState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
};

export function FormRunnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FormRunnerState>(loadState);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);


  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const setKitchen = (id: string) => setState(s => ({ ...s, kitchen_id: id }));
  const setDay = (day: string) => setState(s => ({ ...s, day }));
  const setMeal = (id: string) => setState(s => ({ ...s, meal_id: id }));
  const setStage = (id: string) => setState(s => ({ ...s, stage_id: id }));
  const setForms = (forms: Form[]) => setState(s => ({ ...s, forms }));

  const updateAnswer = (formId: string, answer: Answer) => {
    setState(s => {
      const formAnswers = s.answers[formId]?.answers || [];
      const existingIndex = formAnswers.findIndex(a => a.question_id === answer.question_id);
      
      const updatedAnswers = existingIndex >= 0
        ? formAnswers.map((a, i) => i === existingIndex ? answer : a)
        : [...formAnswers, answer];

      return {
        ...s,
        answers: {
          ...s.answers,
          [formId]: { answers: updatedAnswers },
        },
      };
    });
  };

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open)
    
    if(!open){
    resetRunner()
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if(next > highestStep) setHighestStep(next);
      return next;
    });
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }

  const resetRunner = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FormRunnerContext.Provider
      value={{
        ...state,
        setKitchen,
        setDay,
        setMeal,
        setStage,
        setForms,
        updateAnswer,
        resetRunner,
        isOpen,
        setIsOpen: handleSetIsOpen,
        currentStep,
        nextStep,
        prevStep,
        highestStep,
        goToStep: setCurrentStep,
        setCurrentStep
      }}
    >
      {children}
    </FormRunnerContext.Provider>
  );
}

export function useFormRunner() {
  const context = useContext(FormRunnerContext);
  if (!context) throw new Error('useFormRunner must be used within FormRunnerProvider');
  return context;
}
