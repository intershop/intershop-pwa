import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddQuoteToBasket } from '../../../checkout/store/basket';
import { Basket } from '../../../models/basket/basket.model';
import { Quote } from '../../../models/quote/quote.model';
import { CreateQuoteRequestFromQuote, getQuoteLoading, getSelectedQuote, RejectQuote } from '../../store/quote';
import { QuotingState } from '../../store/quoting.state';

@Component({
  selector: 'ish-quote-edit-page-container',
  templateUrl: './quote-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageContainerComponent implements OnInit {
  quote$: Observable<Quote | Basket>;
  quoteLoading$: Observable<boolean>;

  constructor(private store: Store<QuotingState>, private router: Router) {}

  ngOnInit() {
    this.quote$ = this.store.pipe(select(getSelectedQuote));
    this.quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  }

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
