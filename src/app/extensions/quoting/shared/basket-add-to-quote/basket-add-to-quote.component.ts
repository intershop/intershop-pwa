import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { QuotingFacade } from '../../facades/quoting.facade';

/**
 * The Product Add To Quote Container Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-basket-add-to-quote',
  templateUrl: './basket-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class BasketAddToQuoteComponent {
  constructor(private quotingFacade: QuotingFacade) {}

  addToQuote() {
    this.quotingFacade.addBasketToQuoteRequest();
  }
}
