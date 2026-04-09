import { ApplicationRef, Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, OperatorFunction, identity, timer } from 'rxjs';
import { map, sample, switchMap, take, tap } from 'rxjs/operators';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { delayUntil, whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { QuotingHelper } from '../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuotingEntity } from '../models/quoting/quoting.model';
import {
  createQuoteRequestFromBasket,
  deleteQuoteFromBasket,
  deleteQuotingEntity,
  getQuotingEntities,
  getQuotingEntity,
  getQuotingLoading,
  loadQuoting,
  loadQuotingDetail,
} from '../store/quoting';

interface QuoteEntitiesOptions {
  automaticRefresh?: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  private moduleLoader = inject(ModuleLoaderService);
  private isStable$ = new BehaviorSubject<boolean>(false);

  constructor(
    private store: Store,
    appRef: ApplicationRef
  ) {
    appRef.isStable.pipe(whenTruthy(), take(1)).subscribe(isStable => this.isStable$.next(isStable));
  }
  loading$ = this.moduleLoader.whenLoaded('quoting', () => this.store.pipe(select(getQuotingLoading)));

  quotingEntities$(options: QuoteEntitiesOptions = { automaticRefresh: true }) {
    return this.moduleLoader.whenLoaded('quoting', () => {
      // update on subscription
      this.loadQuoting();

      return this.store.pipe(
        select(getQuotingEntities),
        sample(this.loading$.pipe(whenFalsy())),
        options?.automaticRefresh ? this.automaticQuoteRefresh() : identity,
        tap(entities => {
          entities.filter(QuotingHelper.isStub).forEach(entity => {
            this.store.dispatch(loadQuotingDetail({ entity, level: 'List' }));
          });
        }),
        map(entities => entities.filter(QuotingHelper.isNotStub))
      );
    });
  }

  state$(quoteId: string) {
    return this.moduleLoader.whenLoaded('quoting', () =>
      this.store.pipe(select(getQuotingEntity(quoteId)), map(QuotingHelper.state))
    );
  }

  name$(quoteId: string) {
    return this.moduleLoader.whenLoaded('quoting', () =>
      this.store.pipe(
        select(getQuotingEntity(quoteId)),
        map((quote: Quote | QuoteRequest) => quote?.displayName)
      )
    );
  }

  delete(entity: QuotingEntity) {
    void this.moduleLoader.ensureLoaded('quoting').then(() => this.store.dispatch(deleteQuotingEntity({ entity })));
  }

  createQuoteRequestFromBasket() {
    void this.moduleLoader.ensureLoaded('quoting').then(() => this.store.dispatch(createQuoteRequestFromBasket()));
  }

  loadQuoting() {
    void this.moduleLoader.ensureLoaded('quoting').then(() => this.store.dispatch(loadQuoting()));
  }

  deleteQuoteFromBasket(quoteId: string) {
    void this.moduleLoader
      .ensureLoaded('quoting')
      .then(() => this.store.dispatch(deleteQuoteFromBasket({ id: quoteId })));
  }

  private automaticQuoteRefresh<T>(): OperatorFunction<T, T> {
    return (source$: Observable<T>) =>
      source$.pipe(
        delayUntil(this.isStable$.pipe(whenTruthy())),
        switchMap(entities =>
          // update every minute
          timer(0, 60_000).pipe(
            tap(count => {
              if (count) {
                this.loadQuoting();
              }
            }),
            map(() => entities)
          )
        )
      );
  }
}
