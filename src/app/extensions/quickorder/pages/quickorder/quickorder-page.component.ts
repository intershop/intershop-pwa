import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { debounceTime, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

declare type CsvStatusType = 'Default' | 'ValidFormat' | 'InvalidFormat' | 'IncorrectInput';

function validateProduct(shoppingFacade: ShoppingFacade, cdRef: ChangeDetectorRef): AsyncValidatorFn {
  return (control: FormGroup) =>
    (control.valueChanges &&
      control.valueChanges.pipe(
        debounceTime(500),
        map(({ sku }) => sku),
        switchMap(sku => shoppingFacade.product$(sku, ProductCompletenessLevel.List)),
        tap(product => {
          const failed = ProductHelper.isFailedLoading(product);
          control.get('sku').setErrors(failed ? { not_exists: true } : undefined);
          const quantityControl = control.get('quantity') as FormControl;
          quantityControl.setValidators(
            failed
              ? []
              : [
                  Validators.required,
                  SpecialValidators.integer,
                  Validators.min(product.minOrderQuantity),
                  Validators.max(product.maxOrderQuantity),
                ]
          );

          control.get('product').setValue(product, { emitEvent: false });

          if (!quantityControl.value) {
            quantityControl.setValue(product.minOrderQuantity, { emitEvent: false });
          }

          control.updateValueAndValidity({ emitEvent: false });
          cdRef.markForCheck();
        }),
        mapTo(undefined)
      )) ||
    EMPTY;
}

@Component({
  selector: 'ish-quickorder-page',
  templateUrl: './quickorder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderPageComponent implements OnInit {
  numberOfRows = 5;
  productsFromCsv: { sku: string; quantity: number }[] = [];
  searchSuggestions: { imgPath: string; sku: string; name: string }[] = [];
  status: CsvStatusType;

  quickOrderForm: FormGroup;
  csvForm: FormGroup;

  loading$: Observable<boolean>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade,
    private qf: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading$ = this.checkoutFacade.basketLoading$;

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

  get quickOrderFormDisabled() {
    return (
      this.quickOrderForm.invalid ||
      !this.quickOrderlines.value[0].sku ||
      !parseInt(this.quickOrderlines.value[0].quantity, 10)
    );
  }

  createLine(): FormGroup {
    return this.qf.group(
      { sku: [''], quantity: [''], product: [{}] },
      { asyncValidators: validateProduct(this.shoppingFacade, this.cdRef) }
    );
  }

  onAddProducts() {
    const filledLines = this.quickOrderlines.value.filter(
      (p: { sku: string; quantity: number }) => !!p.sku && !!p.quantity
    );
    this.addProductsToBasket(filledLines);
  }

  addProductsToBasket(products: { sku: string; quantity: number }[]) {
    if (products.length > 0) {
      products.forEach(product => {
        this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
      });
    }
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

  isValidCSVFile(file: File) {
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
