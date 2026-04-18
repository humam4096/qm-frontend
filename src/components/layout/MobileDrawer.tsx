import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Which side the drawer slides in from (LTR perspective). Defaults to 'left'. */
  side?: 'left' | 'right';
  children: ReactNode;
  /** Optional aria-label for the drawer dialog */
  ariaLabel?: string;
}


export const MobileDrawer = ({
  isOpen,
  onClose,
  side = 'left',
  children,
  ariaLabel = 'Navigation menu',
}: MobileDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Move focus into the drawer when it opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);


  const effectiveSide = isRtl
    ? side === 'left' ? 'right' : 'left'
    : side;

  const translateClass = isOpen
    ? 'translate-x-0'
    : effectiveSide === 'left'
      ? '-translate-x-full'
      : 'translate-x-full';

  const positionClass = effectiveSide === 'left' ? 'left-0' : 'right-0';

  return (
    <>
      {/* Backdrop overlay — always in DOM for fade animation */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`
          fixed top-0 bottom-0 z-50 w-72 flex flex-col
          bg-sidebar shadow-2xl md:hidden
          transition-transform duration-300 ease-in-out
          ${positionClass}
          ${translateClass}
          focus:outline-none
        `}
      >
        {children}
      </div>
    </>
  );
};
