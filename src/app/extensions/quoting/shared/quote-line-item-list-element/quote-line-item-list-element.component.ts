import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteItem, QuoteRequestItem } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-line-item-list-element',
  standalone: false,
  templateUrl: './quote-line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteLineItemListElementComponent implements OnInit {
  @Input({ required: true }) lineItem: Partial<
    Pick<
      QuoteItem,
      'id' | 'originSingleBasePrice' | 'originTotal' | 'productSKU' | 'quantity' | 'singleBasePrice' | 'total'
    > &
      Pick<QuoteRequestItem, 'id' | 'productSKU' | 'quantity' | 'singleBasePrice' | 'total'>
  >;

  editable$: Observable<boolean>;

  constructor(
    private quoteContext: QuoteContextFacade,
    private productContext: ProductContextFacade,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.editable$ = this.quoteContext.select('editable');

    this.productContext.hold(this.productContext.select('hasQuantityError'), hasError =>
      this.quoteContext.setItemQuantityError(this.lineItem?.id, hasError)
    );
    this.destroyRef.onDestroy(() => this.quoteContext.setItemQuantityError(this.lineItem?.id, false));

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
