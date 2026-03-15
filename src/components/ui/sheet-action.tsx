import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './sheet';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

interface SheetActionProps {
  /** Controls external open state */
  isOpen?: boolean;
  /** Callback for when sheet open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The title of the sheet */
  title: string;
  /** Optional description for the sheet */
  description?: string;
  /** The content/form to render inside the sheet */
  children?: React.ReactNode;
  /** Text for the confirm button */
  submitText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Action to perform on submit */
  onSubmit?: () => void | Promise<void>;
  /** Action to perform on cancel/close */
  onCancel?: () => void;
  /** Shows a loading spinner on the submit button */
  isLoading?: boolean;
  /** Shows footer with action buttons */
  footer?: boolean;
  /** Makes the submit button red for destructive actions like delete */
  isDestructive?: boolean;
  /** Side of the screen to slide from */
  side?: "top" | "right" | "bottom" | "left";
  /** Custom content classname */
  contentClassName?: string;
}

export function SheetAction({
  isOpen,
  onOpenChange,
  title,
  footer = false,
  description,
  children,
  submitText,
  onSubmit,
  cancelText,
  onCancel,
  isLoading = false,
  isDestructive = false,
  side = "right",
  contentClassName,
}: SheetActionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const finalSubmitText = isDestructive ? (submitText || t('common.delete')) : (submitText || t('common.save'));
  const finalCancelText = cancelText || t('common.cancel');
  
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    
    // Trigger onCancel if sheet is explicitly closed by user
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

  // For Arabic, slide from left; for English, slide from right
  const sheetSide = isRTL ? "left" : side;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent 
        side={sheetSide}
        className={`w-full sm:max-w-2xl overflow-y-auto flex flex-col ${contentClassName || ''}`}
        // dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header with ActionDialog styling */}
        <div className="bg-primary text-white p-4 rounded-md -m-4 mb-4">
          <SheetHeader>
            <SheetTitle className="text-white">{title}</SheetTitle>
            {description && (
              <SheetDescription className="text-white/80">{description}</SheetDescription>
            )}
          </SheetHeader>
        </div>

        {/* Content */}
        {children && <div className="flex-1 overflow-y-auto">{children}</div>}

        {/* Footer */}
        {footer && (
          <SheetFooter className="flex sm:justify-end gap-2 mt-4 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-10"
            >
              {finalCancelText}
            </Button>
            {onSubmit && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-10"
                variant={isDestructive ? "destructive" : "default"}
              >
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {finalSubmitText}
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
