import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading 
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  // Logic to determine which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Adjust icons based on RTL
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft;
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
        {/* Optional context like "Showing 1-10 of 50" could go here if total items passed */}
        {t('common.page')} {currentPage} {t('common.of')} {totalPages}
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse justify-center flex-1 sm:justify-end">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleFirst}
          disabled={currentPage === 1 || isLoading}
        >
          <span className="sr-only">First page</span>
          <FirstIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
        >
          <span className="sr-only">Previous page</span>
          <PrevIcon className="h-4 w-4" />
        </Button>
        
        <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse mx-2">
          {getPageNumbers().map((page, i) => (
            <React.Fragment key={i}>
              {page === '...' ? (
                <span className="px-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  className={`w-8 h-8 ${currentPage === page ? 'pointer-events-none' : ''}`}
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
        >
          <span className="sr-only">Next page</span>
          <NextIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleLast}
          disabled={currentPage === totalPages || isLoading}
        >
          <span className="sr-only">Last page</span>
          <LastIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
