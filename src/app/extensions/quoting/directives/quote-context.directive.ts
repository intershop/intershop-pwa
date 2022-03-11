import { Directive, Input } from '@angular/core';

import { QuoteContextFacade } from '../facades/quote-context.facade';

@Directive({
  selector: '[ishQuoteContext]',
  providers: [QuoteContextFacade],
})
export class QuoteContextDirective {
  constructor(private context: QuoteContextFacade) {}

  @Input() set quoteId(quoteId: string) {
    this.context.set('id', () => quoteId);
  }
}
