import { useCallback, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface UsePrintReportOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
  quality?: number;
}

interface UsePrintReportReturn {
  reportRef: React.RefObject<HTMLDivElement | null>;
  isGenerating: boolean;
  downloadPDF: () => Promise<void>;
  print: () => Promise<void>;
  share: () => Promise<void>;
}

export const usePrintReport = (options: UsePrintReportOptions = {}): UsePrintReportReturn => {
  const {
    filename = `report-${Date.now()}`,
    orientation = 'portrait',
    format = 'a4',
    quality = 2,
  } = options;

  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Download report as PDF with proper A4 pagination
  const downloadPDF = useCallback(async () => {
    if (!reportRef.current) {
      throw new Error('Report reference is not available');
    }

    setIsGenerating(true);

    try {
      // Create PDF with proper orientation
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Get all page sections
      const pages = reportRef.current.querySelectorAll<HTMLElement>('.print-page');

      if (pages.length === 0) {
        // Fallback: treat entire content as single scrollable content
        const canvas = await html2canvas(reportRef.current, {
          scale: quality,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 794, // A4 width in pixels at 96 DPI
          windowHeight: 1123, // A4 height in pixels at 96 DPI
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add subsequent pages
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      } else {
        // Process each page section separately for better quality
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];

          const canvas = await html2canvas(page, {
            scale: quality,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794,
            windowHeight: 1123,
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }
      }

      pdf.save(`${filename}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }, [filename, orientation, format, quality]);

  // Open browser print dialog with the report content
  // Creates a temporary print window with only the report
  const print = useCallback(async () => {
    if (!reportRef.current) {
      throw new Error('Report reference is not available');
    }

    try {
      // Clone the report content
      const reportContent = reportRef.current.cloneNode(true) as HTMLElement;
      
      // Create a temporary iframe for printing
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = 'none';
      document.body.appendChild(printFrame);

      const printDocument = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (!printDocument) {
        throw new Error('Could not access print frame document');
      }

      // Get all stylesheets from the parent document
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            // For inline styles and same-origin stylesheets
            if (styleSheet.cssRules) {
              return Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join('\n');
            }
          } catch (e) {
            // For cross-origin stylesheets, try to get the href
            if (styleSheet.href) {
              return `@import url('${styleSheet.href}');`;
            }
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');

      // Build the print document
      printDocument.open();
      printDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Print Report</title>
            <style>
              ${styles}
              
              /* Additional print-specific styles */
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${reportContent.outerHTML}
          </body>
        </html>
      `);
      printDocument.close();

      // Wait for content and styles to load
      await new Promise((resolve) => {
        if (printFrame.contentWindow) {
          printFrame.contentWindow.onload = resolve;
          // Fallback timeout
          setTimeout(resolve, 500);
        } else {
          setTimeout(resolve, 500);
        }
      });

      // Trigger print dialog
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Clean up after printing or user cancels
      // Give some time for the print dialog to open
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    } finally {
    }
  }, []);

  // Share report via Web Share API or fallback to clipboard
  const share = useCallback(async () => {
    if (!reportRef.current) {
      throw new Error('Report reference is not available');
    }


    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: quality,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      );

      const file = new File([blob], `${filename}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Report Export',
          text: 'Operational Report',
          files: [file],
        });
      } else {
        // Fallback: copy current URL to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          throw new Error('Share not supported. Link copied to clipboard.');
        } else {
          throw new Error('Share and clipboard APIs not supported');
        }
      }
    } finally {
      console.log('done')
    }
  }, [filename, quality]);

  return {
    reportRef,
    isGenerating,
    downloadPDF,
    print,
    share,
  };
};
