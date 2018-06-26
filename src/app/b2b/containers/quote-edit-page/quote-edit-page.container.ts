import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { B2bState } from '../../store/b2b.state';
import { getQuoteLoading } from '../../store/quote';
import {
  DeleteItemFromQuoteRequest,
  getQuoteRequestLoading,
  getSelectedQuoteRequest,
  UpdateQuoteRequestItems,
} from '../../store/quote-request';

@Component({
  selector: 'ish-quote-edit-page-container',
  templateUrl: './quote-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageContainerComponent implements OnInit {
  quote$: Observable<Quote | QuoteRequest>;
  quoteLoading$: Observable<boolean>;
  quoteRequestLoading$: Observable<boolean>;

  constructor(private store: Store<B2bState>) {}

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
