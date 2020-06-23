import { Injectable } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import { QuoteRequest } from '../models/quote-request/quote-request.model';
import { Quote } from '../models/quote/quote.model';
import {
  addQuoteToBasket,
  createQuoteRequestFromQuote,
  deleteQuote,
  getCurrentQuotes,
  getQuoteError,
  getQuoteLoading,
  getSelectedQuoteWithProducts,
  loadQuotes,
  rejectQuote,
  resetQuoteError,
} from '../store/quote';
import {
  addBasketToQuoteRequest,
  addProductToQuoteRequest,
  createQuoteRequestFromQuoteRequest,
  deleteItemFromQuoteRequest,
  deleteQuoteRequest,
  getActiveQuoteRequestWithProducts,
  getCurrentQuoteRequests,
  getQuoteRequestError,
  getQuoteRequestLoading,
  getSelectedQuoteRequestWithProducts,
  loadQuoteRequests,
  selectQuoteRequest,
  submitQuoteRequest,
  updateQuoteRequest,
  updateQuoteRequestItems,
  updateSubmitQuoteRequest,
} from '../store/quote-request';

const getQuotesAndQuoteRequests = createSelector(getCurrentQuotes, getCurrentQuoteRequests, (quotes, quoteRequests): (
  | Quote
  | QuoteRequest
)[] => [...quotes, ...quoteRequests]);

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  constructor(private store: Store) {}

  // QUOTE

  quote$ = this.store.pipe(select(getSelectedQuoteWithProducts));
  quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  quoteError$ = this.store.pipe(select(getQuoteError));

  private loadQuotes() {
    this.store.dispatch(loadQuotes());
  }

  rejectQuote() {
    this.store.dispatch(rejectQuote());
  }

  private deleteQuote(id: string) {
    this.store.dispatch(deleteQuote({ id }));
  }

  addQuoteToBasket(quoteId: string) {
    this.store.dispatch(addQuoteToBasket({ quoteId }));
  }

  resetQuoteError() {
    this.store.dispatch(resetQuoteError());
  }

  // QUOTE REQUEST

  quoteRequest$ = this.store.pipe(select(getSelectedQuoteRequestWithProducts));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  quoteRequestError$ = this.store.pipe(select(getQuoteRequestError));
  activeQuoteRequest$ = this.store.pipe(select(getActiveQuoteRequestWithProducts));

  private loadQuoteRequests() {
    this.store.dispatch(loadQuoteRequests());
  }

  selectQuoteRequest(id: string) {
    this.store.dispatch(selectQuoteRequest({ id }));
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(updateQuoteRequest(payload));
  }

  deleteQuoteRequest(id: string) {
    this.store.dispatch(deleteQuoteRequest({ id }));
  }

  submitQuoteRequest() {
    this.store.dispatch(submitQuoteRequest());
  }

  updateSubmitQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(updateSubmitQuoteRequest(payload));
  }

  copyQuoteRequest(preventRedirect?: boolean) {
    this.store.dispatch(createQuoteRequestFromQuoteRequest({ redirect: !preventRedirect }));
  }

  updateQuoteRequestItem(update: LineItemUpdate) {
    this.store.dispatch(updateQuoteRequestItems({ lineItemUpdates: [update] }));
  }

  deleteQuoteRequestItem(itemId: string) {
    this.store.dispatch(deleteItemFromQuoteRequest({ itemId }));
  }

  addBasketToQuoteRequest() {
    this.store.dispatch(addBasketToQuoteRequest());
  }

  addProductToQuoteRequest(sku: string, quantity: number) {
    this.store.dispatch(addProductToQuoteRequest({ sku, quantity }));
  }

  // QUOTE AND QUOTE REQUEST

  quotesAndQuoteRequests$() {
    this.loadQuotes();
    this.loadQuoteRequests();
    return this.store.pipe(select(getQuotesAndQuoteRequests));
  }

  quotesOrQuoteRequestsLoading$ = combineLatest([this.quoteLoading$, this.quoteRequestLoading$]).pipe(
    map(([l1, l2]) => l1 || l2)
  );

  deleteQuoteOrRequest(item: Quote | QuoteRequest) {
    if (item.type === 'QuoteRequest') {
      this.deleteQuoteRequest(item.id);
    } else if (item.type === 'Quote') {
      this.deleteQuote(item.id);
    }
  }

  createQuoteRequestFromQuote() {
    this.store.dispatch(createQuoteRequestFromQuote());
  }
}
