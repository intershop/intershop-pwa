import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../../models/quote/quote.model';
import { B2bState } from '../../store/b2b.state';
import { DeleteQuote, DeleteQuoteRequest, getCurrentQuotes, getQuoteLoading } from '../../store/quote';

@Component({
  selector: 'ish-quote-list-page-container',
  templateUrl: './quote-list-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageContainerComponent implements OnInit {
  quotes$: Observable<Quote[]>;
  quoteLoading$: Observable<boolean>;

  constructor(private store: Store<B2bState>) {}

  ngOnInit() {
    this.quotes$ = this.store.pipe(select(getCurrentQuotes));
    this.quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  }

  deleteItem(item: Quote) {
    if (item.type === 'QuoteRequest') {
      this.store.dispatch(new DeleteQuoteRequest(item.id));
    } else if (item.type === 'Quote') {
      this.store.dispatch(new DeleteQuote(item.id));
    }
  }
}
