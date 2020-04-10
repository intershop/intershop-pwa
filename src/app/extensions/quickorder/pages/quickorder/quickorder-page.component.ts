import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { QuickOrderLine } from '../../models/quickorder-line.model';

declare type CsvStatusType = 'Default' | 'ValidFormat' | 'InvalidFormat' | 'IncorrectInput';

@Component({
  selector: 'ish-quickorder-page',
  templateUrl: './quickorder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderPageComponent implements OnInit {
  numberOfRows = 5;
  productsFromCsv: QuickOrderLine[] = [];
  searchSuggestions: { imgPath: string; sku: string; name: string }[] = [];
  status: CsvStatusType;

  quickOrderForm: FormGroup;
  csvForm: FormGroup;

  failedToLoadProducts$: Observable<string[]>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private qf: FormBuilder,
    private updateStatus: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    // Dummy data to test search suggestion styling, typing 1234 will show the dropwdown with this product
    this.searchSuggestions.push({
      imgPath:
        'http://jxdemoserver.intershop.de/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/S/4808544-118.jpg',
      sku: '1234',
      name: 'test',
    });
  }

  initForms() {
    this.quickOrderForm = this.qf.group({
      quickOrderlines: this.qf.array([]),
    });

    this.csvForm = this.qf.group({
      csvFile: ['', Validators.required],
    });

    this.status = 'Default';

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
      quantity: ['', [Validators.required, Validators.min(1), SpecialValidators.integer]],
      unit: [''],
    });
  }

  onAddProducts() {
    const filledLines = this.quickOrderlines.value.filter(
      (p: { sku: string; quantity: number }) => p.sku !== '' && p.quantity !== undefined
    );
    this.addProductsToBasket(filledLines);
  }

  addProductsToBasket(products: QuickOrderLine[]) {
    if (products.length > 0) {
      products.forEach((product: { sku: string; quantity: number }) => {
        this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
      });

      this.failedToLoadProducts$ = this.shoppingFacade.failedToLoadProducts$;
    }
  }

  uploadListener($event): void {
    const files = $event.srcElement.files;
    this.status = 'Default';

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
            ? 'ValidFormat'
            : 'IncorrectInput';

        this.updateStatus.markForCheck();
      };
    } else {
      this.status = 'InvalidFormat';
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: string[]): QuickOrderLine[] {
    const csvArr: QuickOrderLine[] = [];
    // TODO: Use try catch?
    try {
      for (let i = 0; i < csvRecordsArray.filter(r => r !== '').length; i++) {
        const currentRecord = (csvRecordsArray[i] as string).split(',');
        if (+currentRecord[1].trim() !== NaN) {
          const csvRecord: QuickOrderLine = {
            sku: currentRecord[0].trim(),
            quantity: +currentRecord[1].trim(),
            unit: '',
          };
          csvArr.push(csvRecord);
        }
      }
    } catch (error) {
      this.status = 'IncorrectInput';
      return [];
    }
    return csvArr;
  }

  isValidCSVFile(file) {
    return file.name.endsWith('.csv');
  }

  addCsvToCart() {
    if (this.status === 'ValidFormat') {
      this.addProductsToBasket(this.productsFromCsv);
      this.resetCsvProductArray();
    }
  }

  resetCsvProductArray() {
    this.productsFromCsv = [];
    this.status = 'Default';
  }
}
