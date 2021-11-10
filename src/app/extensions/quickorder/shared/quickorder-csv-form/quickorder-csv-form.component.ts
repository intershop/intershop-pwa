import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';

declare type CsvStatusType = 'Default' | 'ValidFormat' | 'InvalidFormat' | 'IncorrectInput';

@Component({
  selector: 'ish-quickorder-csv-form',
  templateUrl: './quickorder-csv-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderCsvFormComponent implements OnInit {
  csvForm: FormGroup;
  productsFromCsv: SkuQuantityType[] = [];
  status: CsvStatusType;

  constructor(private qf: FormBuilder, private cdRef: ChangeDetectorRef, private shoppingFacade: ShoppingFacade) {}

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

  getDataRecordsArrayFromCSVFile(csvRecordsArray: string[]): SkuQuantityType[] {
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
      if (this.productsFromCsv.length > 0) {
        this.productsFromCsv.forEach(product => {
          this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
        });
      }
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
