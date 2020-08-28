import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ObservableInput, timer } from 'rxjs';
import { first, map, sample, switchMapTo, tap } from 'rxjs/operators';

import { waitForFeatureStore, whenFalsy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { QuotingEntity } from '../models/quoting/quoting.model';
import {
  deleteQuotingEntity,
  getQuotingEntities,
  getQuotingEntity,
  getQuotingError,
  getQuotingLoading,
  loadQuotingDetail,
} from '../store/quoting';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  constructor(private store: Store) {}

  private awaitQuoting<T>(obs: ObservableInput<T>) {
    return this.store.pipe(waitForFeatureStore('quoting2'), first(), switchMapTo(obs));
  }

  loading$ = this.awaitQuoting(this.store.pipe(select(getQuotingLoading)));

  quotingEntities$ = this.awaitQuoting(
    this.store.pipe(
      select(getQuotingEntities),
      sample(this.loading$.pipe(whenFalsy())),
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
}
