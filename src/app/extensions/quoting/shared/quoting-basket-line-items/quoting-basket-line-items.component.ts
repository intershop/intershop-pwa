import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { groupBy } from 'lodash-es';
import { Observable, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { QuotingFacade } from '../../facades/quoting.facade';

@Component({
  selector: 'ish-quoting-basket-line-items',
  templateUrl: './quoting-basket-line-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, LineItemListComponent, NgFor, NgIf, TranslatePipe],
})
export class QuotingBasketLineItemsComponent implements OnInit {
  lineItems$: Observable<[string, LineItem[]][]>;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private quotingFacade: QuotingFacade
  ) {}

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
