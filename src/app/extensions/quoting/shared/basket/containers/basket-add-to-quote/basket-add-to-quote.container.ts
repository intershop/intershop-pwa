import { ChangeDetectionStrategy, Component } from '@angular/core';

import { QuotingFacade } from '../../../../facades/quoting.facade';

/**
 * The Product Add To Quote Container Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-basket-add-to-quote-container',
  templateUrl: './basket-add-to-quote.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketAddToQuoteContainerComponent {
  constructor(private quotingFacade: QuotingFacade) {}

  addToQuote() {
    this.quotingFacade.addBasketToQuoteRequest();
  }
}
