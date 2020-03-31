import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { QuickOrderLine } from '../../models/quickorder-line.model';
import { CsvStatusMessages } from '../../models/quickorder-status-messages.helper';

@Component({
  selector: 'ish-quickorder-page',
  templateUrl: './quickorder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderPageComponent implements OnInit, OnDestroy {
  numberOfRows = 5;
  productsFromCsv: QuickOrderLine[] = [];
  searchSuggestions = new Array<{ imgPath: string; sku: string; name: string }>();
  csvFileStatus = CsvStatusMessages;
  status: number;

  quickOrderForm: FormGroup;
  csvForm: FormGroup;

  private destroy$ = new Subject();

  constructor(
    private shoppingFacade: ShoppingFacade,
    private qf: FormBuilder,
    private csvf: FormBuilder,
    private updateStatus: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.searchSuggestions.push({
      imgPath:
        'http://jxdemoserver.intershop.de/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/S/4808544-118.jpg',
      sku: '1234',
      name: 'test',
    });
  }

  private initForms() {
    this.quickOrderForm = this.qf.group({
      quickOrderlines: this.qf.array([]),
    });

    this.csvForm = this.csvf.group({
      csvFile: ['', Validators.required],
    });

    this.status = this.csvFileStatus.Default;

    this.addRows(this.numberOfRows);
  }

  addRows(rowsToAdd: number) {
    for (let i = 0; i < rowsToAdd; i++) {
      this.quickOrderlines.push(this.createLine());
    }
  }

  deleteItem(index: number) {
    this.quickOrderlines.removeAt(index);
  }

  resetFields() {
    this.quickOrderlines.reset([this.createLine()]);
  }

  get quickOrderlines() {
    return this.quickOrderForm.get('quickOrderlines') as FormArray;
  }

  createLine(): FormGroup {
    return this.qf.group({
      sku: [''],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(2), SpecialValidators.integer]],
      unit: [''],
    });
  }

  onAddProducts() {
    const filledLines = this.quickOrderlines.value.filter(p => p.sku !== '' && p.quantity !== undefined);
    if (filledLines.length > 0) {
      this.shoppingFacade.addProductsToBasket(filledLines);
    }
  }

  uploadListener($event): void {
    const files = $event.srcElement.files;
    this.status = this.csvFileStatus.Default;

    if (this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        this.productsFromCsv = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      };

      reader.onloadend = () => {
        this.status =
          this.productsFromCsv.filter(p => p.sku !== '' && p.quantity !== undefined).length !== 0
            ? this.csvFileStatus.ValidFormat
            : this.csvFileStatus.IncorrectInput;

        this.updateStatus.detectChanges();
      };
    } else {
      this.status = this.csvFileStatus.InvalidFormat;
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: string[]): QuickOrderLine[] {
    const csvArr = new Array<QuickOrderLine>();
    // TODO: Use try catch?
    try {
      for (let i = 1; i < csvRecordsArray.filter(r => r !== '').length; i++) {
        const currentRecord = (csvRecordsArray[i] as string).split(',');
        const csvRecord = new QuickOrderLine();
        csvRecord.sku = currentRecord[0].trim();
        csvRecord.quantity = +currentRecord[1].trim();
        csvRecord.unit = '';
        csvArr.push(csvRecord);
      }
    } catch (error) {
      this.status = this.csvFileStatus.IncorrectInput;
      return [];
    }
    return csvArr;
  }

  isValidCSVFile(file) {
    return file.name.endsWith('.csv');
  }

  addCsvToCart() {
    if (this.csvFileStatus.ValidFormat) {
      this.shoppingFacade.addProductsToBasket(this.productsFromCsv);
      this.resetCsvProductArray();
    }
  }

  resetCsvProductArray() {
    this.productsFromCsv = [];
    this.status = this.csvFileStatus.Default;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
