import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { CsvImportData, CsvImportHandler, CsvImportStatus } from 'ish-core/utils/csv/csv.import-handler';

@Component({
  selector: 'ish-quickorder-csv-form',
  templateUrl: './quickorder-csv-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgSwitch, NgSwitchCase, NgSwitchDefault, TranslateModule],
})
export class QuickorderCsvFormComponent implements OnInit {
  csvForm: FormGroup;
  status: CsvImportStatus = 'Default';
  // not-dead-code
  productsFromCsv: SkuQuantityType[] = [];
  private quickOrderHeaders: string[] = ['Product ID', 'Quantity'];

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productsFromCsv = [];
    this.csvForm = this.fb.group({
      csvFile: [undefined],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    CsvImportHandler.processCsvFile(file, this.quickOrderHeaders)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: fileContent => {
          this.parseCsvData(fileContent);
          this.cdRef.markForCheck();
        },
        error: error => {
          this.status = error as CsvImportStatus;
          this.cdRef.markForCheck();
        },
      });
  }

  // not-dead-code
  parseCsvData(csvData: CsvImportData) {
    try {
      this.productsFromCsv = csvData.data
        .map(line => line.split(','))
        .map(columns => ({
          sku: columns[0].trim(),
          quantity: +columns[1].trim(),
        }))
        .filter(record => record.sku && !isNaN(record.quantity));
      this.status = 'Valid';
    } catch {
      this.status = 'InvalidData';
      this.productsFromCsv = [];
    }
  }

  addCsvToCart() {
    if (this.productsFromCsv.length > 0) {
      this.productsFromCsv.forEach(product => {
        this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
      });
    }
    this.resetInput();
  }

  resetInput() {
    this.productsFromCsv = [];
    this.status = 'Default';
    this.csvForm.reset();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  get isCsvDisabled() {
    return this.status !== 'Valid';
  }
}
