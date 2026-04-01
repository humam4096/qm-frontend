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
  title?: string;
  /** Optional description for the dialog */
  description?: string;
  /** The content/form to render inside the dialog */
  children?: React.ReactNode;
  /** Text for the confirm button */
  submitText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Action to perform on submit */
  onSubmit?: () => void | Promise<void>;
  /** Action to perform on cancel/close, defaults to just closing the dialog */
  onCancel?: () => void;
  /** Shows a loading spinner on the submit button */
  isLoading?: boolean;
  footer?: boolean;
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
  footer = false,
  description,
  children,
  submitText,
  onSubmit,
  onCancel,
  isLoading = false,
  isDestructive = false,
  contentClassName,
}: ActionDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const finalSubmitText = isDestructive ? (submitText || t('common.delete')) : t('common.save');
  const finalCancelText = t('common.cancel');
  
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
    if (!onSubmit) return;
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
      <DialogContent className={`${contentClassName}`} dir={isRTL ? "rtl" : "ltr"}>
        {(title || description) && (
          <DialogHeader className="text-white">
            <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-secondary rounded-lg p-6 text-white shadow-2xl">
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}       
            </div>
          </DialogHeader>
          )}
        
        {children && <div className="p-4">{children}</div>}
        
        {footer && <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
            className="px-10"
          >
            {finalCancelText}
          </Button>
          {onSubmit && <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="px-10"
            variant={isDestructive ? "destructive" : "default"}
          >
            {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {finalSubmitText}
          </Button>}
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
