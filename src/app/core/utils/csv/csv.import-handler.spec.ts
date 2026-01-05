import { CsvImportHandler } from './csv.import-handler';

describe('Csv Import Handler', () => {
  describe('processCsvFile', () => {
    it('should process a valid CSV file', done => {
      const csvContent = 'header1,header2\nvalue1,value2\nvalue3,value4';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

      CsvImportHandler.processCsvFile(file, ['header1', 'header2']).subscribe({
        next: result => {
          expect(result.headers).toEqual(['header1', 'header2']);
          expect(result.data).toEqual(['value1,value2', 'value3,value4']);
          done();
        },
        error: done.fail,
      });
    });

    it('should reject non-CSV files', done => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      CsvImportHandler.processCsvFile(file).subscribe({
        next: () => done.fail('Should have errored'),
        error: error => {
          expect(error).toBe('InvalidFormat');
          done();
        },
      });
    });

    it('should reject files with invalid headers', done => {
      const csvContent = 'wrongHeader1,wrongHeader2\nvalue1,value2';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

      CsvImportHandler.processCsvFile(file, ['header1', 'header2']).subscribe({
        next: () => done.fail('Should have errored'),
        error: error => {
          expect(error).toBe('InvalidHeader');
          done();
        },
      });
    });

    it('should process CSV without header validation', done => {
      const csvContent = 'value1,value2\nvalue3,value4';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

      CsvImportHandler.processCsvFile(file).subscribe({
        next: result => {
          expect(result.headers).toBeEmpty();
          expect(result.data).toEqual(['value1,value2', 'value3,value4']);
          done();
        },
        error: done.fail,
      });
    });
  });
});
