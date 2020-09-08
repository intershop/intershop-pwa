import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { timer } from 'rxjs';
import { map, sample, switchMapTo, tap } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { QuotingEntity } from '../models/quoting/quoting.model';
import {
  createQuoteRequestFromBasket,
  deleteQuotingEntity,
  getQuotingEntities,
  getQuotingEntity,
  getQuotingLoading,
  isQuotingInitialized,
  loadQuoting,
  loadQuotingDetail,
} from '../store/quoting';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  constructor(private store: Store) {}

  loading$ = this.store.pipe(select(getQuotingLoading));

  quotingEntities$ = this.store.pipe(
    tap(
      once(state => {
        if (!isQuotingInitialized(state)) {
          this.store.dispatch(loadQuoting());
        }
      })
    ),
    select(getQuotingEntities),
    sample(this.loading$.pipe(whenFalsy())),
    tap(entities => {
      entities.filter(QuotingHelper.isStub).forEach(entity => {
        this.store.dispatch(loadQuotingDetail({ entity, level: 'List' }));
      });
    }),
    map(entities => entities.filter(QuotingHelper.isNotStub))
  );

  state$(quoteId: string) {
    return timer(0, 2000).pipe(
      switchMapTo(this.store.pipe(select(getQuotingEntity(quoteId)))),
      map(QuotingHelper.state)
    );
  }

  delete(entity: QuotingEntity) {
    this.store.dispatch(deleteQuotingEntity({ entity }));
  }

  createQuoteRequestFromBasket() {
    this.store.dispatch(createQuoteRequestFromBasket());
  }
}
