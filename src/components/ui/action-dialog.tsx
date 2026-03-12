import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

interface ActionDialogProps {
  /** The dialog trigger element (e.g., a Button) */
  trigger?: React.ReactNode;
  /** Controls external open state if needed */
  isOpen?: boolean;
  /** Callback for when dialog open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The title of the dialog */
  title: string;
  /** Optional description for the dialog */
  description?: string;
  /** The content/form to render inside the dialog */
  children?: React.ReactNode;
  /** Text for the confirm button */
  submitText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Action to perform on submit */
  onSubmit: () => void | Promise<void>;
  /** Action to perform on cancel/close, defaults to just closing the dialog */
  onCancel?: () => void;
  /** Shows a loading spinner on the submit button */
  isLoading?: boolean;
  /** Makes the submit button red for destructive actions like delete */
  isDestructive?: boolean;
  /** Standard shadcn dialog content classname to control width/styling */
  contentClassName?: string;
}

export function ActionDialog({
  trigger,
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  submitText,
  cancelText,
  onSubmit,
  onCancel,
  isLoading = false,
  isDestructive = false,
  contentClassName,
}: ActionDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const finalSubmitText = submitText || t('companies.confirm');
  const finalCancelText = cancelText || t('companies.cancel');
  
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    
    // Trigger onCancel if dialog is explicitly closed by user (clicking outside or X)
    if (!newOpen && onCancel) {
       onCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleOpenChange(false);
  };

  const handleSubmit = async () => {
    await onSubmit();
    // Auto-close if not controlled externally and not currently loading after submit
    if (!isControlled && !isLoading) {
       setInternalOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        {trigger}
      </DialogTrigger>
      <DialogContent className={`${contentClassName} max-w-2xl p-10`} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className='bg-primary text-white p-4 rounded-md'>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        {children && <div className="p-4">{children}</div>}
        
        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {finalCancelText}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            variant={isDestructive ? "destructive" : "default"}
          >
            {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {finalSubmitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
