import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteItem, QuoteRequestItem } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-line-item-list-element',
  templateUrl: './quote-line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteLineItemListElementComponent implements OnInit {
  @Input() lineItem: Partial<
    Pick<QuoteRequestItem, 'id' | 'productSKU' | 'quantity' | 'singleBasePrice' | 'total'> &
      Pick<
        QuoteItem,
        'id' | 'productSKU' | 'quantity' | 'originSingleBasePrice' | 'singleBasePrice' | 'total' | 'originTotal'
      >
  >;

  isBundleProduct = ProductHelper.isProductBundle;

  editable$: Observable<boolean>;

  product$: Observable<ProductView>;

  constructor(private quoteContext: QuoteContextFacade, private productContext: ProductContextFacade) {}

  ngOnInit() {
    this.editable$ = this.quoteContext.select('editable');
    this.product$ = this.productContext.select('product');

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
