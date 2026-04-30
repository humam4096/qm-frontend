import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination } from './pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Skeleton } from './skeleton';

export interface ColumnDef<T> {
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string; // e.g. w-[100px] or text-right
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  
  // Empty State
  emptyMessage?: string;
  
  // Row clicking
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage,
  onRowClick
}: DataTableProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30x bg-primary text-white">
            <TableRow className="hover:bg-transparent border-b-border/50">
              {columns.map((column, index) => {
                const isMobileHidden = index >= 2 && index !== columns.length - 1;
                return (
                  <TableHead
                    key={index}
                    className={`font-semibold text-muted-foregroundx ${isMobileHidden ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                  >
                    {column.header}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading State: Render 5 skeleton rows
              Array.from({ length: 15 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="border-b-border/20">
                  {columns.map((column, colIndex) => {
                    const isMobileHidden = colIndex >= 2 && colIndex !== columns.length - 1;
                    return (
                      <TableCell
                        key={`skeleton-cell-${colIndex}`}
                        className={`${isMobileHidden ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                      >
                        <Skeleton className="h-5 w-full max-w-[150px] rounded-md" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <p>{emptyMessage || t('common.noDataFound')}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data Rows
              data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b-border/60 transition-all duration-200 hover:bg-muted/40 ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((column, colIndex) => {
                    const isMobileHidden = colIndex >= 2 && colIndex !== columns.length - 1;
                    return (
                      <TableCell
                        key={colIndex}
                        className={`py-4 ${isMobileHidden ? 'hidden sm:table-cell' : ''} ${column.className || ''}`}
                      >
                        {column.cell
                          ? column.cell(row, rowIndex)
                          : column.accessorKey
                          ? String(row[column.accessorKey] ?? '')
                          : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      {totalPages !== undefined && totalPages > 1 && currentPage !== undefined && onPageChange && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
