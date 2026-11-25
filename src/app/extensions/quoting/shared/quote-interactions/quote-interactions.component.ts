import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { QuoteContextFacade, isQuoteValid } from '../../facades/quote-context.facade';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-interactions',
  standalone: false,
  templateUrl: './quote-interactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteInteractionsComponent implements OnInit {
  @Input() showClose = false;
  @Output() readonly closeDialog = new EventEmitter<void>();

  quote$: Observable<Quote | QuoteRequest>;
  state$: Observable<QuoteStatus>;
  isQuoteValid$: Observable<boolean>;
  hasItemQuantityError$: Observable<boolean>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.quote$ = this.context.select('entity');
    this.state$ = this.context.select('state');
    this.isQuoteValid$ = this.context.select(isQuoteValid);
    this.hasItemQuantityError$ = this.context.select('hasItemQuantityError');
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

  submit() {
    this.context.submit();
  }
}
