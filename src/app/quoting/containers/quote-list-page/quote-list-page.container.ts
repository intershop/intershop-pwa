import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';

import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';
import { DeleteQuote, LoadQuotes, getCurrentQuotes, getQuoteLoading } from '../../store/quote';
import {
  DeleteQuoteRequest,
  LoadQuoteRequests,
  getCurrentQuoteRequests,
  getQuoteRequestLoading,
} from '../../store/quote-request';

const getQuotesAndQuoteRequests = createSelector(getCurrentQuotes, getCurrentQuoteRequests, (quotes, quoteRequests) => [
  ...quotes,
  ...quoteRequests,
]);

@Component({
  selector: 'ish-quote-list-page-container',
  templateUrl: './quote-list-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageContainerComponent implements OnInit {
  quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  quotes$ = this.store.pipe(select(getQuotesAndQuoteRequests));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadQuoteRequests());
    this.store.dispatch(new LoadQuotes());
  }

  deleteItem(item: Quote | QuoteRequest) {
    if (item.type === 'QuoteRequest') {
      this.store.dispatch(new DeleteQuoteRequest(item.id));
    } else if (item.type === 'Quote') {
      this.store.dispatch(new DeleteQuote(item.id));
    }
  }
}
