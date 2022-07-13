import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { groupBy } from 'lodash-es';
import { Observable, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { QuotingFacade } from '../../facades/quoting.facade';

@Component({
  selector: 'ish-quoting-basket-line-items',
  templateUrl: './quoting-basket-line-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class QuotingBasketLineItemsComponent implements OnInit {
  lineItems$: Observable<[string, LineItem[]][]>;

  constructor(private checkoutFacade: CheckoutFacade, private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.quotingFacade.loadQuoting();
    this.lineItems$ = this.checkoutFacade.basket$.pipe(
      map(basket =>
        Object.entries(groupBy(basket?.lineItems, 'quote')).sort((a, b) =>
          a[0] === 'undefined' ? -1 : b[0] === 'undefined' ? 1 : 0
        )
      )
    );
  }

  getName(quoteId: string) {
    return this.quotingFacade.name$(quoteId);
  }

  onDeleteQuote(quoteId: string) {
    this.quotingFacade.deleteQuoteFromBasket(quoteId);
  }
}
