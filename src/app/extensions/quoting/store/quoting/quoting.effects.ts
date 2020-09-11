import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { iif, of } from 'rxjs';
import {
  concatMap,
  delay,
  first,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData, setPageEdited } from 'ish-core/store/core/viewconf';
import { getCurrentBasketId, loadBasket } from 'ish-core/store/customer/basket';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';

import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuoteRequest } from '../../models/quoting/quoting.model';
import { QuotingService } from '../../services/quoting/quoting.service';

import {
  addProductToQuoteRequest,
  addProductToQuoteRequestSuccess,
  addQuoteToBasket,
  addQuoteToBasketSuccess,
  createQuoteRequestFromBasket,
  createQuoteRequestFromBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteSuccess,
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
  submitQuoteRequest,
  submitQuoteRequestSuccess,
  updateAndSubmitQuoteRequest,
  updateQuoteRequest,
  updateQuoteRequestSuccess,
} from './quoting.actions';
import { getQuotingEntity } from './quoting.selectors';

@Injectable()
export class QuotingEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
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
        this.quotingService.getQuoteDetails(entity.id, entity.type, level).pipe(
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

  createQuoteRequestFromQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuote),
      mapToPayloadProperty('quoteId'),
      concatMap(quoteId =>
        this.quotingService.createQuoteRequestFromQuote(quoteId).pipe(
          map(quote => createQuoteRequestFromQuoteSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  createQuoteRequestFromBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromBasket),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([, basketID]) =>
        this.quotingService.createQuoteRequestFromBasket(basketID).pipe(
          map(quote => createQuoteRequestFromBasketSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  redirectToNewQuote$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createQuoteRequestFromQuoteSuccess, createQuoteRequestFromBasketSuccess),
        mapToPayloadProperty('quote'),
        mapToProperty('id'),
        tap(id => {
          this.router.navigateByUrl('/account/quotes/' + id);
        })
      ),
    { dispatch: false }
  );

  submitQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitQuoteRequest),
      mapToPayloadProperty('quoteRequestId'),
      concatMap(quoteRequestId =>
        this.quotingService.submitQuoteRequest(quoteRequestId).pipe(
          concatMap(id => this.quotingService.getQuoteDetails(id, 'QuoteRequest', 'Detail')),
          map(quote => submitQuoteRequestSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  addProductToQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToQuoteRequest),
      mapToPayload(),
      concatMap(({ sku, quantity }) =>
        this.quotingService.addProductToQuoteRequest(sku, quantity).pipe(
          concatMap(id => this.quotingService.getQuoteDetails(id, 'QuoteRequest', 'Detail')),
          map(quote => addProductToQuoteRequestSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  setQuotingBreadcrumb$ = createEffect(() =>
    this.store
      .pipe(
        select(selectRouteParam('quoteId')),
        switchMap(quoteId => this.store.pipe(select(getQuotingEntity(quoteId))))
      )
      .pipe(
        switchMap(quote =>
          iif(
            () => !!quote,
            of(quote).pipe(
              map(QuotingHelper.state),
              map(state => [
                { key: 'quote.quotes.link', link: '/account/quotes' },
                {
                  key:
                    state === 'New' ? 'quote.edit.unsubmitted.quote_request_details.text' : 'quote.quote_details.link',
                },
              ]),
              // short delay to override parent breadcrumb
              delay(100),
              map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
            )
          )
        )
      )
  );

  updateQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateQuoteRequest),
      mapToPayload(),
      concatMap(({ quoteRequestId, changes }) =>
        this.quotingService.updateQuoteRequest(quoteRequestId, changes).pipe(
          concatMap(id => this.quotingService.getQuoteDetails(id, 'QuoteRequest', 'Detail')),
          map(quote => updateQuoteRequestSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  updateQuoteRequestSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateQuoteRequestSuccess),
      mapToPayloadProperty('quote'),
      map((quote: QuoteRequest) =>
        displaySuccessMessage({
          message: 'quote.edit.saved.your_quote_request_has_been_saved.text',
          messageParams: { 0: quote.displayName },
        })
      )
    )
  );

  updateAndSubmitQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAndSubmitQuoteRequest),
      mapToPayload(),
      concatMap(({ quoteRequestId, changes }) =>
        this.quotingService.updateQuoteRequest(quoteRequestId, changes).pipe(
          delay(1000),
          concatMap(id => this.quotingService.submitQuoteRequest(id)),
          concatMap(id => this.quotingService.getQuoteDetails(id, 'QuoteRequest', 'Detail')),
          map(quote => submitQuoteRequestSuccess({ quote })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  resetPageEditedState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateQuoteRequestSuccess, submitQuoteRequestSuccess),
      mapTo(setPageEdited({ edited: false }))
    )
  );
}
