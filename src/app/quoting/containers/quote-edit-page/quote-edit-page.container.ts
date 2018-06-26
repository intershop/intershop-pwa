import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { getQuoteLoading } from '../../store/quote';
import {
  DeleteItemFromQuoteRequest,
  getQuoteRequestLoading,
  getSelectedQuoteRequest,
  UpdateQuoteRequestItems,
} from '../../store/quote-request';
import { QuotingState } from '../../store/quoting.state';

@Component({
  selector: 'ish-quote-edit-page-container',
  templateUrl: './quote-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageContainerComponent implements OnInit {
  quote$: Observable<Quote | QuoteRequest>;
  quoteLoading$: Observable<boolean>;
  quoteRequestLoading$: Observable<boolean>;

  constructor(private store: Store<QuotingState>) {}

  ngOnInit() {
    this.quote$ = this.store.pipe(select(getSelectedQuoteRequest));
    this.quoteLoading$ = this.store.pipe(select(getQuoteLoading));
    this.quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  }

  deleteQuoteItem(payload: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId: payload }));
  }

  updateQuoteItems(payload: { items: { itemId: string; quantity: number }[] }) {
    this.store.dispatch(new UpdateQuoteRequestItems(payload));
  }
}
