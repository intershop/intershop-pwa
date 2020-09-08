import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { ObservableInput, timer } from 'rxjs';
import { filter, first, map, sample, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { selectRouteParam } from 'ish-core/store/core/router';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import { waitForFeatureStore, whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuotingEntity } from '../models/quoting/quoting.model';
import {
  addQuoteToBasket,
  createQuoteRequestFromBasket,
  createQuoteRequestFromQuote,
  deleteQuotingEntity,
  getActiveQuoteRequestId,
  getQuotingEntities,
  getQuotingEntity,
  getQuotingError,
  getQuotingLoading,
  loadQuoting,
  loadQuotingDetail,
  rejectQuote,
  submitQuoteRequest,
} from '../store/quoting';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  private loadInitial: () => void;

  constructor(private store: Store) {
    const initializer = once(() => store.dispatch(loadQuoting()));
    this.loadInitial = initializer;
    store.pipe(select(getUserAuthorized), whenFalsy()).subscribe(() => {
      this.loadInitial = initializer;
    });
  }

  private awaitQuoting<T>(obs: ObservableInput<T>) {
    return this.store.pipe(waitForFeatureStore('quoting2'), first(), switchMapTo(obs));
  }

  loading$ = this.awaitQuoting(this.store.pipe(select(getQuotingLoading)));

  quotingEntities$ = this.awaitQuoting(
    this.store.pipe(
      select(getQuotingEntities),
      sample(this.loading$.pipe(whenFalsy())),
      tap(() => this.loadInitial()),
      tap(entities => {
        entities.filter(QuotingHelper.isStub).forEach(entity => {
          this.store.dispatch(loadQuotingDetail({ entity, level: 'List' }));
        });
      }),
      map(entities => entities.filter(QuotingHelper.isNotStub))
    )
  );

  error$ = this.awaitQuoting(this.store.pipe(select(getQuotingError)));

  state$(quoteId: string) {
    return this.awaitQuoting(
      timer(0, 2000).pipe(switchMapTo(this.store.pipe(select(getQuotingEntity(quoteId)))), map(QuotingHelper.state))
    );
  }

  delete(entity: QuotingEntity) {
    this.store.dispatch(deleteQuotingEntity({ entity }));
  }

  rejectQuote(quote: Quote) {
    this.store.dispatch(rejectQuote({ quoteId: quote.id }));
  }

  createQuoteRequestFromQuote(quote: Quote) {
    this.store.dispatch(createQuoteRequestFromQuote({ quoteId: quote.id }));
  }

  createQuoteRequestFromBasket() {
    this.store.dispatch(createQuoteRequestFromBasket());
  }

  addQuoteToBasket(quote: Quote) {
    this.store.dispatch(addQuoteToBasket({ quoteId: quote.id }));
  }

  submitQuoteRequest(quoteRequestId: string) {
    this.store.dispatch(submitQuoteRequest({ quoteRequestId }));
  }

  private fetchDetail(quoteId: string) {
    return this.store.pipe(
      select(getQuotingEntity(quoteId)),
      tap(() => this.loadInitial()),
      whenTruthy(),
      tap(entity => {
        if (entity?.completenessLevel !== 'Detail') {
          this.store.dispatch(loadQuotingDetail({ entity, level: 'Detail' }));
        }
      }),
      filter(entity => entity?.completenessLevel === 'Detail'),
      map(quote => quote as Quote | QuoteRequest)
    );
  }

  selected$ = this.store.pipe(
    select(selectRouteParam('quoteId')),
    switchMap(quoteId => this.fetchDetail(quoteId))
  );

  selectedState$ = this.selected$.pipe(map(QuotingHelper.state));

  activeQuoteRequest$ = this.store.pipe(
    select(getActiveQuoteRequestId),
    switchMap(quoteRequestId => this.fetchDetail(quoteRequestId)),
    map(QuotingHelper.asQuoteRequest)
  );

  activeQuoteRequestState$ = this.activeQuoteRequest$.pipe(map(QuotingHelper.state));
}
