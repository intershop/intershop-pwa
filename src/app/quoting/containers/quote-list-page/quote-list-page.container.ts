import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { DeleteQuote, getCurrentQuotes, getQuoteLoading } from '../../store/quote';
import { DeleteQuoteRequest, getCurrentQuoteRequests, getQuoteRequestLoading } from '../../store/quote-request';
import { QuotingState } from '../../store/quoting.state';

@Component({
  selector: 'ish-quote-list-page-container',
  templateUrl: './quote-list-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageContainerComponent implements OnInit {
  quotes$: Observable<(Quote | QuoteRequest)[]>;
  quoteLoading$: Observable<boolean>;
  quoteRequestLoading$: Observable<boolean>;

  constructor(private store: Store<QuotingState>) {}

  ngOnInit() {
    // TODO: move to selector?
    this.quotes$ = combineLatest(
      this.store.pipe(select(getCurrentQuotes)),
      this.store.pipe(select(getCurrentQuoteRequests))
    ).pipe(
      map(([quotes, quoteRequests]) => {
        return [...quotes, ...quoteRequests];
      })
    );
    this.quoteLoading$ = this.store.pipe(select(getQuoteLoading));
    this.quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  }

  deleteItem(item: Quote | QuoteRequest) {
    if (item.type === 'QuoteRequest') {
      this.store.dispatch(new DeleteQuoteRequest(item.id));
    } else if (item.type === 'Quote') {
      this.store.dispatch(new DeleteQuote(item.id));
    }
  }
}
