import { Injectable } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import { QuoteRequest } from '../models/quote-request/quote-request.model';
import { Quote } from '../models/quote/quote.model';
import {
  AddQuoteToBasket,
  CreateQuoteRequestFromQuote,
  DeleteQuote,
  LoadQuotes,
  RejectQuote,
  getCurrentQuotes,
  getQuoteError,
  getQuoteLoading,
  getSelectedQuoteWithProducts,
} from '../store/quote';
import {
  AddBasketToQuoteRequest,
  AddProductToQuoteRequest,
  CreateQuoteRequestFromQuoteRequest,
  DeleteItemFromQuoteRequest,
  DeleteQuoteRequest,
  LoadQuoteRequests,
  SelectQuoteRequest,
  SubmitQuoteRequest,
  UpdateQuoteRequest,
  UpdateQuoteRequestItems,
  UpdateSubmitQuoteRequest,
  getActiveQuoteRequestWithProducts,
  getCurrentQuoteRequests,
  getQuoteRequestError,
  getQuoteRequestLoading,
  getSelectedQuoteRequestWithProducts,
} from '../store/quote-request';

const getQuotesAndQuoteRequests = createSelector(
  getCurrentQuotes,
  getCurrentQuoteRequests,
  (quotes, quoteRequests): (Quote | QuoteRequest)[] => [...quotes, ...quoteRequests]
);

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  constructor(private store: Store<{}>) {}

  // QUOTE
  quote$ = this.store.pipe(select(getSelectedQuoteWithProducts));
  quoteLoading$ = this.store.pipe(select(getQuoteLoading));
  quoteError$ = this.store.pipe(select(getQuoteError));

  quotes$() {
    this.loadQuotes();
    return this.store.pipe(select(getCurrentQuotes));
  }

  private loadQuotes() {
    this.store.dispatch(new LoadQuotes());
  }

  rejectQuote() {
    this.store.dispatch(new RejectQuote());
  }

  deleteQuote(id: string) {
    this.store.dispatch(new DeleteQuote({ id }));
  }

  addQuoteToBasket(quoteId: string) {
    this.store.dispatch(new AddQuoteToBasket({ quoteId }));
  }

  // QUOTE REQUEST
  quoteRequest$ = this.store.pipe(select(getSelectedQuoteRequestWithProducts));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  quoteRequestError$ = this.store.pipe(select(getQuoteRequestError));
  activeQuoteRequest$ = this.store.pipe(select(getActiveQuoteRequestWithProducts));

  quoteRequests$() {
    this.loadQuoteRequests();
    return this.store.pipe(select(getCurrentQuoteRequests));
  }

  private loadQuoteRequests() {
    this.store.dispatch(new LoadQuoteRequests());
  }

  selectQuoteRequest(id: string) {
    this.store.dispatch(new SelectQuoteRequest({ id }));
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(new UpdateQuoteRequest(payload));
  }

  deleteQuoteRequest(id: string) {
    this.store.dispatch(new DeleteQuoteRequest({ id }));
  }

  submitQuoteRequest() {
    this.store.dispatch(new SubmitQuoteRequest());
  }

  updateSubmitQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(new UpdateSubmitQuoteRequest(payload));
  }

  copyQuoteRequest() {
    this.store.dispatch(new CreateQuoteRequestFromQuoteRequest());
  }

  updateQuoteRequestItem(update: LineItemUpdate) {
    this.store.dispatch(new UpdateQuoteRequestItems({ lineItemUpdates: [update] }));
  }

  deleteQuoteRequestItem(itemId: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId }));
  }

  addBasketToQuoteRequest() {
    this.store.dispatch(new AddBasketToQuoteRequest());
  }

  addProductToQuoteRequest(sku: string, quantity: number) {
    this.store.dispatch(new AddProductToQuoteRequest({ sku, quantity }));
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
    this.store.dispatch(new CreateQuoteRequestFromQuote());
  }
}
