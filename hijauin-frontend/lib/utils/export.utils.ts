import * as XLSX from 'xlsx';

/**
 * Clean CSV / Excel Export Utilities.
 * Adheres strictly to RFC 4180 CSV standard and XLSX workbook formats.
 */

/**
 * Export tabular data as a downloadable CSV file.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  const escapeCsvCell = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((r) => r.map(escapeCsvCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n'); // UTF-8 BOM

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export tabular data as an Excel (.xlsx) file.
 */
export function exportToExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto-calculate column widths
  const colWidths = headers.map((header, colIdx) => {
    let maxLength = String(header).length;
    for (const row of rows) {
      const cellValue = row[colIdx];
      if (cellValue !== null && cellValue !== undefined) {
        maxLength = Math.max(maxLength, String(cellValue).length);
      }
    }
    return { wch: Math.min(Math.max(maxLength + 4, 12), 40) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));

  XLSX.writeFile(workbook, cleanFilename);
}
