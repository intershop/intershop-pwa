import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AddQuoteToBasket } from 'ish-core/store/checkout/basket';
import { getLoggedInUser } from 'ish-core/store/user';
import { CreateQuoteRequestFromQuote, RejectQuote, getQuoteLoading, getSelectedQuote } from '../../store/quote';

@Component({
  selector: 'ish-quote-edit-page-container',
  templateUrl: './quote-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageContainerComponent {
  quote$ = this.store.pipe(select(getSelectedQuote));
  quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  user$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>, private router: Router) {}

  copyQuote() {
    this.store.dispatch(new CreateQuoteRequestFromQuote());
  }

  rejectQuote() {
    this.store.dispatch(new RejectQuote());
  }

  addQuoteToBasket(quoteId: string) {
    this.store.dispatch(new AddQuoteToBasket(quoteId));
    this.router.navigate(['/basket']);
  }
}
