import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { getLoggedInUser } from 'ish-core/store/user';
import {
  CreateQuoteRequestFromQuoteRequest,
  DeleteItemFromQuoteRequest,
  DeleteQuoteRequest,
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

  updateQuoteRequestItem(payload: LineItemUpdate) {
    this.store.dispatch(new UpdateQuoteRequestItems({ lineItemUpdates: [payload] }));
  }

  deleteQuoteRequestItem(payload: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId: payload }));
  }

  deleteQuoteRequest(payload: string) {
    this.store.dispatch(new DeleteQuoteRequest({ id: payload }));
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
