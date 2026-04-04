import { createContext, useContext } from "react";
import { useFormBuilder } from "../hooks/useFormBuilder";

const FormBuilderContext = createContext<ReturnType<typeof useFormBuilder> | null>(null);

export const FormBuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const builder = useFormBuilder();
  return (
    <FormBuilderContext.Provider value={builder}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilderContext = () => {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) throw new Error("Must be used inside FormBuilderProvider");
  return ctx;
};