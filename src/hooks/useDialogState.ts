import { useState } from "react";

export type DialogState<T = any> =
  | { type: "create" }   
  | { type: "edit"; item: T }          
  | { type: "view"; id: string | number }   
  | { type: "delete"; id: string | number } 
  | null; 

export function useDialogState<T>() {
  
  const [dialog, setDialog] = useState<DialogState<T>>(null);

  const openCreate = () => setDialog({ type: "create" });

  const openEdit = (item: T) =>
    setDialog({ type: "edit", item });

  const openView = (id: string | number) =>
    setDialog({ type: "view", id });

  const openDelete = (id: string | number) =>
    setDialog({ type: "delete", id });

  const close = () => setDialog(null);

  return {
    dialog,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close,
  };
}