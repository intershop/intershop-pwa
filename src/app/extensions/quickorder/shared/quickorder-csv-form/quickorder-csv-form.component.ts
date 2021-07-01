import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare type CsvStatusType = 'Default' | 'ValidFormat' | 'InvalidFormat' | 'IncorrectInput';

@Component({
  selector: 'ish-quickorder-csv-form',
  templateUrl: './quickorder-csv-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderCsvFormComponent implements OnInit {
  csvForm: FormGroup;
  productsFromCsv: { sku: string; quantity: number }[] = [];
  status: CsvStatusType;

  @Output() productsToAdd = new EventEmitter<{ sku: string; quantity: number }[]>();

  constructor(private qf: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.csvForm = this.qf.group({
      csvFile: ['', Validators.required],
    });

    this.status = 'Default';
  }

  uploadListener(target: EventTarget): void {
    const files = (target as HTMLInputElement).files;
    this.status = 'Default';

    if (this.isValidCSVFile(files[0])) {
      const reader = new FileReader();
      reader.readAsText(files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        this.productsFromCsv = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      };

      reader.onloadend = () => {
        this.status =
          this.productsFromCsv.filter(p => p.sku !== '' && p.quantity !== undefined).length !== 0
            ? 'ValidFormat'
            : 'IncorrectInput';

        this.cdRef.markForCheck();
      };
    } else {
      this.status = 'InvalidFormat';
    }
  }

  isValidCSVFile(file: File) {
    return file.name.endsWith('.csv');
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: string[]): { sku: string; quantity: number }[] {
    try {
      return csvRecordsArray
        .filter(r => !!r)
        .map(record => record.split(/[,;]/))
        .map(record => ({
          sku: record[0].trim(),
          quantity: +record[1].trim(),
        }))
        .filter(record => !isNaN(record.quantity));
    } catch (error) {
      this.status = 'IncorrectInput';
      return [];
    }
  }

  addCsvToCart() {
    if (this.status === 'ValidFormat') {
      this.productsToAdd.emit(this.productsFromCsv);
      this.resetCsvProductArray();
    }
  }

  resetCsvProductArray() {
    this.productsFromCsv = [];
    this.status = 'Default';
  }

  get isCsvDisabled() {
    return this.status !== 'ValidFormat';
  }
}
