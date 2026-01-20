import { AsyncPipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { OrderTemplatesExportsModule } from 'src/app/extensions/order-templates/exports/order-templates-exports.module';
import { WishlistsExportsModule } from 'src/app/extensions/wishlists/exports/wishlists-exports.module';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteItem, QuoteRequestItem } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-line-item-list-element',
  templateUrl: './quote-line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    FontAwesomeModule,
    OrderTemplatesExportsModule,
    WishlistsExportsModule,
    NgClass,
    NgIf,
    PricePipe,
    ProductBundleDisplayComponent,
    ProductIdComponent,
    ProductImageComponent,
    ProductInventoryComponent,
    ProductNameComponent,
    ProductQuantityComponent,
    ProductQuantityLabelComponent,
    ProductVariationDisplayComponent,
    TranslateModule,
    DecimalPipe,
  ],
})
export class QuoteLineItemListElementComponent implements OnInit {
  @Input({ required: true }) lineItem: Partial<
    Pick<QuoteRequestItem, 'id' | 'productSKU' | 'quantity' | 'singleBasePrice' | 'total'> &
      Pick<
        QuoteItem,
        'id' | 'productSKU' | 'quantity' | 'originSingleBasePrice' | 'singleBasePrice' | 'total' | 'originTotal'
      >
  >;

  editable$: Observable<boolean>;

  constructor(private quoteContext: QuoteContextFacade, private productContext: ProductContextFacade) {}

  ngOnInit() {
    this.editable$ = this.quoteContext.select('editable');

    this.productContext.hold(this.productContext.validDebouncedQuantityUpdate$(), quantity => {
      this.quoteContext.updateItem({
        itemId: this.lineItem?.id,
        quantity,
      });
    });
  }

  onDeleteItem() {
    this.quoteContext.deleteItem(this.lineItem.id);
  }
}
