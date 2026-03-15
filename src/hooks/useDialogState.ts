import { useState } from "react";

export type DialogState<T = any> =
  | { type: "create" }   
  | { type: "edit"; item: T }          
  | { type: "view"; item: T }   
  | { type: "delete"; item: T } 
  | null; 

export function useDialogState<T>() {
  
  const [dialog, setDialog] = useState<DialogState<T>>(null);

  const openCreate = () => setDialog({ type: "create" });

  const openEdit = (item: T) =>
    setDialog({ type: "edit", item });

  const openView = (item: T) =>
    setDialog({ type: "view", item });

  const openDelete = (item: T) =>
    setDialog({ type: "delete", item });

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