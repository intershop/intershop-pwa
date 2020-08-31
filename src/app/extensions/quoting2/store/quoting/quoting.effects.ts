import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, first, map, mergeMap, mergeMapTo, switchMap } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { getCurrentBasketId, loadBasket } from 'ish-core/store/customer/basket';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { QuotingService } from '../../services/quoting/quoting.service';

import {
  addQuoteToBasket,
  addQuoteToBasketSuccess,
  deleteQuotingEntity,
  deleteQuotingEntityFail,
  deleteQuotingEntitySuccess,
  loadQuoting,
  loadQuotingDetail,
  loadQuotingDetailSuccess,
  loadQuotingFail,
  loadQuotingSuccess,
  rejectQuote,
  rejectQuoteFail,
} from './quoting.actions';

@Injectable()
export class QuotingEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private quotingService: QuotingService,
    private basketService: BasketService
  ) {}

  loadQuoting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuoting),
      switchMap(() =>
        this.quotingService.getQuotes().pipe(
          map(quoting => loadQuotingSuccess({ quoting })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  loadQuotingDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotingDetail),
      mapToPayload(),
      mergeMap(({ entity, level }) =>
        this.quotingService.getQuoteDetails(entity, level).pipe(
          map(quote => loadQuotingDetailSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  deleteQuoting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuotingEntity),
      mapToPayloadProperty('entity'),
      mergeMap(entity =>
        this.quotingService.deleteQuote(entity).pipe(
          map(id => deleteQuotingEntitySuccess({ id })),
          mapErrorToAction(deleteQuotingEntityFail, { id: entity.id })
        )
      )
    )
  );

  rejectQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      mapToPayloadProperty('quoteId'),
      concatMap(id =>
        this.quotingService.rejectQuote(id).pipe(
          map(quote => loadQuotingDetailSuccess({ quote })),
          mapErrorToAction(rejectQuoteFail, { id })
        )
      )
    )
  );

  addQuoteToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasket),
      mapToPayloadProperty('quoteId'),
      concatMap(quoteId =>
        this.store.pipe(
          select(getCurrentBasketId),
          first(),
          switchMap(basketId =>
            !basketId ? this.basketService.createBasket().pipe(map(basket => basket.id)) : of(basketId)
          ),
          concatMap(basketId => this.quotingService.addQuoteToBasket(quoteId, basketId)),
          mergeMapTo([loadBasket(), addQuoteToBasketSuccess({ quoteId })]),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );
}
