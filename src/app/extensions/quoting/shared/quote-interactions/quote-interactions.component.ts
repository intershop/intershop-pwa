import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { QuoteContextFacade, formHasChanges, isQuoteValid } from '../../facades/quote-context.facade';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-interactions',
  templateUrl: './quote-interactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteInteractionsComponent implements OnInit {
  quote$: Observable<Quote | QuoteRequest>;
  state$: Observable<QuoteStatus>;
  isQuoteValid$: Observable<boolean>;
  formHasChanges$: Observable<boolean>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.quote$ = this.context.select('entity');
    this.state$ = this.context.select('state');
    this.isQuoteValid$ = this.context.select(isQuoteValid);
    this.formHasChanges$ = this.context.select(formHasChanges);
  }

  reject() {
    this.context.reject();
  }

  copy() {
    this.context.copy();
  }

  addToBasket() {
    this.context.addToBasket();
  }

  update() {
    this.context.update();
  }

  submit() {
    this.context.submit();
  }
}
