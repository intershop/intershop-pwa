import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { getProduct, getProductVariationOptions } from 'ish-core/store/shopping/products/products.selectors';
import { ModalDialogComponent } from 'ish-shared/common/components/modal-dialog/modal-dialog.component';

/**
 * The Line Item Edit Dialog Container Component displays an edit-dialog of a line items to edit quantity and variation.
 * It prodives optional edit functionality
 * It prodives optional modalDialogRef-handlig
 *
 * @example
 * <ish-line-item-edit-dialog-container
 *   [lineItem]="lineItem"
 *   [editable]="editable"
 *   [modalDialogRef]="modalDialogRef"
 *   (updateItem)="onUpdateItem($event)"
 * ></ish-line-item-edit-dialog-container>
 */
@Component({
  selector: 'ish-line-item-edit-dialog-container',
  templateUrl: './line-item-edit-dialog.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditDialogContainerComponent implements OnInit, OnDestroy {
  @Input() lineItem: LineItemView;
  @Input() modalDialogRef?: ModalDialogComponent;
  @Input() editable = true;
  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  quantityUpdate: LineItemUpdate;
  skuUpdate: LineItemUpdate;

  /** holds the current SKU */
  private sku$ = new ReplaySubject<string>(1);
  private product$ = this.sku$.pipe(switchMap(sku => this.store.pipe(select(getProduct, { sku }))));
  variationOptions$ = this.sku$.pipe(switchMap(sku => this.store.pipe(select(getProductVariationOptions, { sku }))));
  variation$ = this.product$.pipe(
    filter(
      p => ProductHelper.isVariationProduct(p) && ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.List)
    )
  );
  loading$ = this.product$.pipe(map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.List)));
  private destroy$ = new Subject();

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    // Checks if the product is already in the store and only dispatches a LoadProduct action if it is not
    this.sku$.pipe(takeUntil(this.destroy$)).subscribe(sku => {
      this.store.dispatch(new LoadProductIfNotLoaded({ sku, level: ProductCompletenessLevel.List }));
    });

    this.variation$.pipe(takeUntil(this.destroy$)).subscribe(product => {
      if (this.modalDialogRef) {
        this.modalDialogRef.options.confirmDisabled = !product.availability || !product.inStock || false;
      }
    });

    // initial sku
    this.handleInitialSku();

    this.initModalDialogConfirmed();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  quantitySelected(event: LineItemUpdate) {
    this.quantityUpdate = event;
  }

  /**
   * handle form-change for variations
   */
  variationSelected(selection: VariationSelection): void {
    this.product$
      .pipe(
        take(1),
        filter<VariationProductView>(product => ProductHelper.isVariationProduct(product))
      )
      .subscribe(product => {
        const { sku } = ProductVariationHelper.findPossibleVariationForSelection(selection, product);
        this.skuUpdate = {
          itemId: this.lineItem.id,
          sku,
        };
        this.sku$.next(sku);
      });
  }

  /**
   * reset to initial sku
   */
  reset() {
    this.handleInitialSku();
  }

  /**
   * handle lineItem-product-sku
   */
  private handleInitialSku() {
    if (this.lineItem && this.lineItem.product) {
      this.sku$.next(this.lineItem.product.sku);
    }
  }

  /**
   * register subscription to modalDialogRef.confirmed (modalDialog-submit-button)
   */
  private initModalDialogConfirmed(): void {
    if (this.modalDialogRef) {
      this.modalDialogRef.confirmed.subscribe(() => {
        this.save();
      });
    }
  }

  /**
   * save changes to store
   */
  private save(): void {
    const data: LineItemUpdate = {
      itemId: this.lineItem.id,
    };

    if (this.quantityUpdate) {
      data.quantity = this.quantityUpdate.quantity;
    }

    if (this.skuUpdate) {
      data.sku = this.skuUpdate.sku;
    }

    this.updateItem.emit(data);
  }
}
