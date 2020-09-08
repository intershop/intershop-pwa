import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { ObservableInput, timer } from 'rxjs';
import { first, map, sample, switchMapTo, tap } from 'rxjs/operators';

import { getUserAuthorized } from 'ish-core/store/customer/user';
import { waitForFeatureStore, whenFalsy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { QuotingEntity } from '../models/quoting/quoting.model';
import {
  createQuoteRequestFromBasket,
  deleteQuotingEntity,
  getQuotingEntities,
  getQuotingEntity,
  getQuotingLoading,
  loadQuoting,
  loadQuotingDetail,
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
    return this.store.pipe(waitForFeatureStore('quoting'), first(), switchMapTo(obs));
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

  state$(quoteId: string) {
    return this.awaitQuoting(
      timer(0, 2000).pipe(switchMapTo(this.store.pipe(select(getQuotingEntity(quoteId)))), map(QuotingHelper.state))
    );
  }

  delete(entity: QuotingEntity) {
    this.store.dispatch(deleteQuotingEntity({ entity }));
  }

  createQuoteRequestFromBasket() {
    this.store.dispatch(createQuoteRequestFromBasket());
  }
}
