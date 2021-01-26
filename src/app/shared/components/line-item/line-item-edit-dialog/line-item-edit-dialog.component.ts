import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Line Item Edit Dialog Container Component displays an edit-dialog of a line items to edit quantity and variation.
 * It provides optional edit functionality
 * It provides optional modalDialogRef-handling
 *
 * @example
 * <ish-line-item-edit-dialog
 *   [lineItem]="lineItem"
 *   [editable]="editable"
 *   [modalDialogRef]="modalDialogRef"
 *   (updateItem)="onUpdateItem($event)"
 * ></ish-line-item-edit-dialog>
 */
@Component({
  selector: 'ish-line-item-edit-dialog',
  templateUrl: './line-item-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditDialogComponent implements OnInit, OnDestroy, OnChanges {
  @Input() lineItem: Partial<LineItemView>;
  @Input() modalDialogRef?: ModalDialogComponent<unknown>;
  @Input() editable = true;
  @Output() updateItem = new EventEmitter<LineItemUpdate>();

  private product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  variationOptions$: Observable<VariationOptionGroup[]>;
  variation$: Observable<VariationProduct | VariationProductView>;
  loading$: Observable<boolean>;

  form: FormGroup;

  /** holds the current SKU */
  private sku$ = new ReplaySubject<string>(1);

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade) {
    this.form = new FormGroup({
      quantity: new FormControl(undefined),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lineItem && this.lineItem) {
      this.form.patchValue({ quantity: this.lineItem.quantity.value });
      this.form.get('quantity').setValidators([
        Validators.required,
        // Validators.max(this.lineItem.product.maxOrderQuantity),
        SpecialValidators.integer,
      ]);
      this.sku$.next(this.lineItem.productSKU);
    }
  }

  ngOnInit() {
    this.product$ = this.shoppingFacade.product$(this.sku$, ProductCompletenessLevel.List);

    this.variationOptions$ = this.shoppingFacade.productVariationOptions$(this.sku$);

    this.variation$ = this.product$.pipe(filter(p => ProductHelper.isVariationProduct(p)));

    this.loading$ = this.shoppingFacade.productNotReady$(this.sku$, ProductCompletenessLevel.List);

    this.variation$.pipe(takeUntil(this.destroy$)).subscribe(product => {
      if (this.modalDialogRef) {
        this.modalDialogRef.options.confirmDisabled = !product.available;
      }
    });

    this.initModalDialogConfirmed();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * handle form-change for variations
   */
  variationSelected(event: { selection: VariationSelection; changedAttribute?: string }) {
    this.variation$.pipe(take(1), takeUntil(this.destroy$)).subscribe((product: VariationProductView) => {
      const { sku } = ProductVariationHelper.findPossibleVariationForSelection(
        event.selection,
        product,
        event.changedAttribute
      );
      this.sku$.next(sku);
    });
  }

  /**
   * register subscription to modalDialogRef.confirmed (modalDialog-submit-button)
   */
  private initModalDialogConfirmed() {
    if (this.modalDialogRef) {
      this.modalDialogRef.confirmed.pipe(withLatestFrom(this.sku$), takeUntil(this.destroy$)).subscribe(([, sku]) => {
        const data: LineItemUpdate = {
          itemId: this.lineItem.id,
          quantity: +this.form.get('quantity').value,
          sku,
        };
        this.updateItem.emit(data);
      });
    }
  }
}
