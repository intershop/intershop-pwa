import { Observable } from 'rxjs';

export interface CsvImportData {
  headers: string[];
  data: string[];
}

export type CsvImportStatus = 'Default' | 'Valid' | 'InvalidFormat' | 'InvalidHeader' | 'InvalidData';
export class CsvImportHandler {
  /**
   * Processes a CSV file and extracts its content and headers.
   * Validates the file format and optionally validates headers against expected values.
   *
   * @param file            The CSV file to process.
   * @param expectedHeaders Optional array of expected header names for validation.
   * @returns               An observable emitting CsvImportData containing the parsed data lines and headers.
   *                        Emits an error with 'InvalidFormat' for non-CSV files or file read errors,
   *                        or 'InvalidHeader' if header validation fails.
   */
  static processCsvFile(file: File, expectedHeaders: string[] = []): Observable<CsvImportData> {
    return new Observable<CsvImportData>(subscriber => {
      // Reject files that do not match the expected CSV extension.
      if (!file.name.endsWith('.csv')) {
        subscriber.error('InvalidFormat');
        return;
      }

      const reader = new FileReader();

      // Emit parsed data once the file has been successfully read.
      const handleLoad = () => {
        const fileContent = reader.result as string;
        const lines = CsvImportHandler.parseCsvFileContent(fileContent);
        let headers: string[] = [];
        if (expectedHeaders.length > 0 && lines.length > 0) {
          headers = lines[0].split(',').map(h => h.trim());
          if (!CsvImportHandler.validateHeaders(headers, expectedHeaders)) {
            subscriber.error('InvalidHeader');
            return;
          }
        }
        subscriber.next({ data: lines.slice(expectedHeaders.length > 0 ? 1 : 0), headers });
        subscriber.complete();
      };

      // Surface FileReader failures as InvalidFormat errors to consumers.
      const handleError = () => {
        subscriber.error('InvalidFormat');
      };

      // Connect FileReader events and kick off the actual read.
      reader.addEventListener('load', handleLoad);
      reader.addEventListener('error', handleError);
      reader.readAsText(file);

      // Remove handlers and abort pending reads to prevent leaks on unsubscribe.
      return () => {
        reader.removeEventListener('load', handleLoad);
        reader.removeEventListener('error', handleError);
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      };
    });
  }

  /**
   * Parses CSV file content into an array of lines.
   * Splits the content by newlines and filters out empty lines.
   * Supports Windows (\r\n), Unix (\n), and Mac (\r) line endings.
   */
  private static parseCsvFileContent(fileContent: string): string[] {
    return fileContent.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
  }

  /**
   * Validates that the file headers match the expected headers.
   * Checks for header existence, count matching, and that all expected headers are present.
   */
  private static validateHeaders(fileHeaders: string[], expectedHeaders: string[]): boolean {
    if (!fileHeaders || fileHeaders.length === 0) {
      return false;
    }
    if (fileHeaders.length !== expectedHeaders.length) {
      return false;
    }
    return expectedHeaders.every(expected => fileHeaders.includes(expected));
  }
}
