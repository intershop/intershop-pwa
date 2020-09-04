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
  createQuoteRequestFromQuote,
  deleteQuotingEntity,
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
  loadInitial: () => void;

  constructor(private store: Store) {
    store.pipe(select(getUserAuthorized), whenFalsy()).subscribe(() => {
      this.loadInitial = once(() => store.dispatch(loadQuoting()));
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
      tap(this.loadInitial),
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

  addQuoteToBasket(quote: Quote) {
    this.store.dispatch(addQuoteToBasket({ quoteId: quote.id }));
  }

  submitQuoteRequest(quoteRequestId: string) {
    this.store.dispatch(submitQuoteRequest({ quoteRequestId }));
  }

  selected$ = this.store.pipe(
    select(selectRouteParam('quoteId')),
    switchMap(quoteId =>
      this.store.pipe(
        select(getQuotingEntity(quoteId)),
        whenTruthy(),
        tap(entity => {
          if (entity?.completenessLevel !== 'Detail') {
            this.store.dispatch(loadQuotingDetail({ entity, level: 'Detail' }));
          }
        }),
        filter(entity => entity?.completenessLevel === 'Detail'),
        map(quote => quote as Quote | QuoteRequest)
      )
    )
  );

  selectedState$ = this.selected$.pipe(map(QuotingHelper.state));
}
