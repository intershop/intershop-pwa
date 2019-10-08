import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

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

  private product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  variationOptions$: Observable<VariationOptionGroup[]>;
  variation$: Observable<VariationProduct | VariationProductView>;
  loading$: Observable<boolean>;

  /** holds the current SKU */
  private sku$ = new ReplaySubject<string>(1);

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.product$ = this.shoppingFacade.product$(this.sku$, ProductCompletenessLevel.List);

    this.variationOptions$ = this.shoppingFacade.productVariationOptions$(this.sku$);

    this.variation$ = this.product$.pipe(filter(p => ProductHelper.isVariationProduct(p)));

    this.loading$ = this.shoppingFacade.productNotReady$(this.sku$, ProductCompletenessLevel.List);

    this.variation$.pipe(takeUntil(this.destroy$)).subscribe(product => {
      if (this.modalDialogRef) {
        this.modalDialogRef.options.confirmDisabled = !product.availability || !product.inStock || false;
      }
    });

    // initial sku
    this.handleInitialSku();

    this.initModalDialogConfirmed();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  quantitySelected(event: LineItemUpdate) {
    this.quantityUpdate = event;
  }

  /**
   * handle form-change for variations
   */
  variationSelected(selection: VariationSelection) {
    this.variation$.pipe(take(1)).subscribe((product: VariationProductView) => {
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
  private initModalDialogConfirmed() {
    if (this.modalDialogRef) {
      this.modalDialogRef.confirmed.subscribe(() => {
        this.save();
      });
    }
  }

  /**
   * save changes to store
   */
  private save() {
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
