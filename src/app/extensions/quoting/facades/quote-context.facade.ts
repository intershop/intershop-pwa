import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { Observable, defer, timer } from 'rxjs';
import { filter, first, map, shareReplay, switchMapTo, tap } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { Quote, QuoteRequest } from '../models/quoting/quoting.model';
import {
  addQuoteToBasket,
  createQuoteRequestFromQuote,
  getQuotingEntity,
  getQuotingError,
  getQuotingLoading,
  isQuotingInitialized,
  loadQuoting,
  loadQuotingDetail,
  rejectQuote,
  submitQuoteRequest,
} from '../store/quoting';

@Injectable()
export abstract class QuoteContextFacade {
  loading$ = this.store.pipe(select(getQuotingLoading));
  error$ = this.store.pipe(select(getQuotingError));

  entity$: Observable<Quote | QuoteRequest>;

  state$ = defer(() => timer(0, 2000).pipe(switchMapTo(this.entity$.pipe(map(QuotingHelper.state)))));

  isQuoteStarted$ = defer(() =>
    this.entity$.pipe(map(quote => Date.now() > QuotingHelper.asQuote(quote)?.validFromDate))
  );

  isQuoteValid$ = defer(() =>
    this.entity$.pipe(
      map(QuotingHelper.asQuote),
      map(quote => Date.now() < quote?.validToDate && Date.now() > quote?.validFromDate)
    )
  );

  isQuoteRequestEditable$ = defer(() =>
    this.entity$.pipe(
      map(QuotingHelper.asQuoteRequest),
      map(quoteRequest => !!quoteRequest.editable)
    )
  );

  constructor(private store: Store) {}

  private idOnce$ = defer(() =>
    this.entity$.pipe(
      map(q => q?.id),
      whenTruthy(),
      first()
    )
  );

  reject() {
    this.idOnce$.subscribe(quoteId => this.store.dispatch(rejectQuote({ quoteId })));
  }

  copy() {
    this.idOnce$.subscribe(quoteId => this.store.dispatch(createQuoteRequestFromQuote({ quoteId })));
  }

  addToBasket() {
    this.idOnce$.subscribe(quoteId => this.store.dispatch(addQuoteToBasket({ quoteId })));
  }

  update() {
    console.log('TODO', 'update');
  }

  submit() {
    this.idOnce$.subscribe(quoteRequestId => this.store.dispatch(submitQuoteRequest({ quoteRequestId })));
  }

  protected fetchDetail(quoteId: string) {
    return this.store.pipe(
      tap(
        once(state => {
          if (!isQuotingInitialized(state)) {
            this.store.dispatch(loadQuoting());
          }
        })
      ),
      select(getQuotingEntity(quoteId)),
      whenTruthy(),
      tap(
        once(entity => {
          if (entity?.completenessLevel !== 'Detail') {
            this.store.dispatch(loadQuotingDetail({ entity, level: 'Detail' }));
          }
        })
      ),
      filter(entity => entity?.completenessLevel === 'Detail'),
      map(quote => quote as Quote | QuoteRequest),
      shareReplay(1)
    );
  }
}
