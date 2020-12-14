import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Observable, timer } from 'rxjs';
import { distinctUntilChanged, filter, first, map, sample, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStatus } from '../models/quoting/quoting.model';
import {
  addQuoteToBasket,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteRequest,
  getQuotingEntity,
  getQuotingError,
  getQuotingLoading,
  isQuotingInitialized,
  loadQuoting,
  loadQuotingDetail,
  rejectQuote,
  submitQuoteRequest,
  updateQuoteRequest,
} from '../store/quoting';

export const isQuoteStarted = (state$: Observable<{ entityAsQuote: Quote }>) =>
  state$.pipe(map(state => Date.now() > state.entityAsQuote?.validFromDate));

export const isQuoteValid = (state$: Observable<{ entityAsQuote: Quote }>) =>
  state$.pipe(
    map(state => Date.now() < state.entityAsQuote?.validToDate && Date.now() > state.entityAsQuote?.validFromDate)
  );

@Injectable()
export abstract class QuoteContextFacade
  extends RxState<{
    id: string;
    loading: boolean;
    error: HttpError;
    entity: Quote | QuoteRequest;
    entityAsQuoteRequest: QuoteRequest;
    entityAsQuote: Quote;
    state: QuoteStatus;
    editable: boolean;
    justSubmitted: boolean;
  }>
  implements OnDestroy {
  constructor(private store: Store) {
    super();
    store.pipe(first()).subscribe(state => {
      if (!isQuotingInitialized(state)) {
        this.store.dispatch(loadQuoting());
      }
    });

    this.connect('loading', this.store.pipe(select(getQuotingLoading)));

    this.connect('error', this.store.pipe(select(getQuotingError)));

    this.connect(
      'entity',
      this.select('id').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        switchMap(quoteId =>
          this.store.pipe(
            select(getQuotingEntity(quoteId)),
            whenTruthy(),
            tap(entity => {
              if (entity?.completenessLevel !== 'Detail') {
                this.store.dispatch(loadQuotingDetail({ entity, level: 'Detail' }));
              }
            }),
            sample(this.select('loading').pipe(whenFalsy())),
            filter(entity => entity?.completenessLevel === 'Detail'),
            map(entity => entity as Quote | QuoteRequest)
          )
        ),
        whenTruthy()
      )
    );

    this.connect('entityAsQuoteRequest', this.select('entity').pipe(map(QuotingHelper.asQuoteRequest)));
    this.connect('entityAsQuote', this.select('entity').pipe(map(QuotingHelper.asQuote)));

    this.connect(
      'state',
      timer(0, 2000).pipe(switchMapTo(this.select('entity').pipe(map(QuotingHelper.state))), distinctUntilChanged())
    );

    this.connect('editable', this.select('state').pipe(map(state => state === 'New')));
  }

  updateItem(item: LineItemUpdate) {
    if (!item.quantity) {
      this.deleteItem(item.itemId);
    } else {
      this.store.dispatch(
        updateQuoteRequest({
          id: this.get('entity', 'id'),
          changes: [{ type: 'change-item', itemId: item.itemId, quantity: item.quantity }],
        })
      );
    }
  }

  deleteItem(itemId: string) {
    this.store.dispatch(
      updateQuoteRequest({
        id: this.get('entity', 'id'),
        changes: [{ type: 'remove-item', itemId }],
      })
    );
  }

  reject() {
    this.store.dispatch(rejectQuote({ id: this.get('entity', 'id') }));
  }

  copy() {
    if (this.get('entity', 'type') === 'Quote') {
      this.store.dispatch(createQuoteRequestFromQuote({ id: this.get('entity', 'id') }));
    } else {
      this.store.dispatch(createQuoteRequestFromQuoteRequest({ id: this.get('entity', 'id') }));
    }
  }

  addToBasket() {
    this.store.dispatch(addQuoteToBasket({ id: this.get('entity', 'id') }));
  }

  update(meta: { displayName: string; description: string }) {
    this.store.dispatch(
      updateQuoteRequest({ id: this.get('entity', 'id'), changes: [{ type: 'meta-data', ...meta }] })
    );
  }

  submit() {
    this.set('justSubmitted', () => true);
    this.store.dispatch(submitQuoteRequest({ id: this.get('entity', 'id') }));
  }
}
