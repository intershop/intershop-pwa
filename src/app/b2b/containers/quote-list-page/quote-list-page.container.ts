import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { B2bState } from '../../store/b2b.state';
import { DeleteQuote, getQuoteLoading } from '../../store/quote';
import { DeleteQuoteRequest, getCurrentQuoteRequests, getQuoteRequestLoading } from '../../store/quote-request';

@Component({
  selector: 'ish-quote-list-page-container',
  templateUrl: './quote-list-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageContainerComponent implements OnInit {
  quotes$: Observable<(Quote | QuoteRequest)[]>;
  quoteLoading$: Observable<boolean>;
  quoteRequestLoading$: Observable<boolean>;

  constructor(private store: Store<B2bState>) {}

  ngOnInit() {
    this.quotes$ = this.store.pipe(select(getCurrentQuoteRequests));
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
