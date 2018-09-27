import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInUser } from '../../../core/store/user';
import { LineItemQuantity } from '../../../models/line-item-quantity/line-item-quantity.model';
import {
  CreateQuoteRequestFromQuoteRequest,
  DeleteItemFromQuoteRequest,
  SubmitQuoteRequest,
  UpdateQuoteRequest,
  UpdateQuoteRequestItems,
  getQuoteRequestLoading,
  getSelectedQuoteRequest,
} from '../../store/quote-request';

@Component({
  selector: 'ish-quote-request-edit-page-container',
  templateUrl: './quote-request-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestEditPageContainerComponent {
  quote$ = this.store.pipe(select(getSelectedQuoteRequest));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  user$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>) {}

  updateQuoteRequestItem(payload: LineItemQuantity) {
    this.store.dispatch(new UpdateQuoteRequestItems([payload]));
  }

  deleteQuoteRequestItem(payload: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId: payload }));
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(new UpdateQuoteRequest(payload));
  }

  submitQuoteRequest() {
    this.store.dispatch(new SubmitQuoteRequest());
  }

  copyQuote() {
    this.store.dispatch(new CreateQuoteRequestFromQuoteRequest());
  }
}
