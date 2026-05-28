import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

/**
 * The Line Item Edit Dialog Component displays an edit-dialog of a line items to edit quantity and variation.
 */
@Component({
  selector: 'ish-line-item-edit-dialog',
  templateUrl: './line-item-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    LoadingComponent,
    PricePipe,
    ProductIdComponent,
    ProductImageComponent,
    ProductInventoryComponent,
    ProductQuantityComponent,
    ProductQuantityLabelComponent,
    ProductVariationSelectComponent,
  ],
})
export class LineItemEditDialogComponent implements OnInit {
  variation$: Observable<ProductView>;
  variationSalePrice$: Observable<Price>;
  loading$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.variation$ = this.context.select('product');
    this.variationSalePrice$ = this.context.select('prices').pipe(map(prices => prices?.salePrice));

    this.loading$ = this.context.select('loading');
  }
}
