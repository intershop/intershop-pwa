import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Quote } from '../../../models/quote/quote.model';
import { B2bState } from '../../store/b2b.state';
import {
  DeleteItemFromQuoteRequest,
  getQuoteLoading,
  getSelectedQuote,
  UpdateQuoteRequestItems,
} from '../../store/quote';

@Component({
  selector: 'ish-quote-edit-page-container',
  templateUrl: './quote-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageContainerComponent implements OnInit {
  quote$: Observable<Quote>;
  quoteLoading$: Observable<boolean>;

  constructor(private store: Store<B2bState>) {}

  ngOnInit() {
    this.quote$ = this.store.pipe(select(getSelectedQuote));
    this.quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  }

  deleteBasketItem(payload: { quoteRequestId: string; itemId: string }) {
    this.store.dispatch(new DeleteItemFromQuoteRequest(payload));
  }

  updateBasketItems(payload: { quoteRequestId: string; items: { itemId: string; quantity: number }[] }) {
    this.store.dispatch(new UpdateQuoteRequestItems(payload));
  }
}
