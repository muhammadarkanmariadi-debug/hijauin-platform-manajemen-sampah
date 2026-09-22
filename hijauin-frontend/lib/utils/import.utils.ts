import * as XLSX from 'xlsx';

export interface ParsedSpreadsheetResult {
  headers: string[];
  rows: Record<string, string | number | boolean>[];
  rawRows: (string | number)[][];
}

/**
 * Parse an uploaded CSV or Excel file (.xlsx, .xls, .csv) into structured row records.
 */
export async function parseSpreadsheetFile(file: File): Promise<ParsedSpreadsheetResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('File kosong atau tidak dapat dibaca.');
        }

        const workbook = XLSX.read(data, { type: 'binary', raw: false });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error('Tidak ada lembar kerja (worksheet) yang ditemukan dalam file.');
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false,
        });

        if (rawJson.length < 2) {
          throw new Error('File harus memiliki setidaknya baris header dan 1 baris data.');
        }

        const headers = (rawJson[0] as string[]).map((h) => String(h || '').trim());
        const dataRows = rawJson.slice(1);

        const rows: Record<string, string | number | boolean>[] = [];
        for (const row of dataRows) {
          // Check if row is completely blank
          const hasContent = row.some((cell) => cell !== '' && cell !== null && cell !== undefined);
          if (!hasContent) continue;

          const record: Record<string, string | number | boolean> = {};
          headers.forEach((header, idx) => {
            if (header) {
              record[header] = row[idx] ?? '';
            }
          });
          rows.push(record);
        }

        resolve({
          headers,
          rows,
          rawRows: dataRows,
        });
      } catch (err: unknown) {
        reject(err instanceof Error ? err : new Error('Gagal memproses file spreadsheet.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Terjadi kesalahan saat membaca file.'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Trigger download of a sample CSV / Excel template.
 */
export function downloadSampleTemplate(
  filename: string,
  headers: string[],
  sampleRows: (string | number)[][],
  format: 'csv' | 'xlsx' = 'csv'
) {
  if (format === 'xlsx') {
    const worksheetData = [headers, ...sampleRows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  } else {
    const escapeCsv = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent =
      '\uFEFF' +
      [
        headers.map(escapeCsv).join(','),
        ...sampleRows.map((row) => row.map(escapeCsv).join(',')),
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
