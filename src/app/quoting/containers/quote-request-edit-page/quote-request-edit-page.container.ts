import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { User } from '../../../models/user/user.model';
import {
  CreateQuoteRequestFromQuote,
  DeleteItemFromQuoteRequest,
  SubmitQuoteRequest,
  UpdateQuoteRequest,
  UpdateQuoteRequestItems,
  getQuoteRequestLoading,
  getSelectedQuoteRequest,
} from '../../store/quote-request';
import { QuotingState } from '../../store/quoting.state';

@Component({
  selector: 'ish-quote-request-edit-page-container',
  templateUrl: './quote-request-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestEditPageContainerComponent implements OnInit {
  quote$: Observable<QuoteRequest>;
  quoteLoading$: Observable<boolean>;
  quoteRequestLoading$: Observable<boolean>;
  user$: Observable<User>;

  constructor(private store: Store<CoreState | QuotingState>) {}

  ngOnInit() {
    this.quote$ = this.store.pipe(select(getSelectedQuoteRequest));
    this.quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }

  updateQuoteRequestItem(payload: { itemId: string; quantity: number }) {
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
    this.store.dispatch(new CreateQuoteRequestFromQuote());
  }
}
