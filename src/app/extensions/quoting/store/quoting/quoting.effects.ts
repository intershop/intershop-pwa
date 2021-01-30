import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from, iif, of } from 'rxjs';
import { concatMap, filter, first, map, mergeMap, mergeMapTo, switchMap, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasketId, updateBasket } from 'ish-core/store/customer/basket';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';

import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuotingService } from '../../services/quoting/quoting.service';

import {
  addProductToQuoteRequest,
  addProductToQuoteRequestSuccess,
  addQuoteToBasket,
  addQuoteToBasketSuccess,
  createQuoteRequestFromBasket,
  createQuoteRequestFromBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestSuccess,
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
      mergeMap(({ entity: { id, type }, level }) =>
        this.quotingService.getQuoteDetails(id, type, level).pipe(
          map(entity => loadQuotingDetailSuccess({ entity })),
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

  deleteSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuotingEntitySuccess),
      map(() => displaySuccessMessage({ message: 'quote.delete.message' }))
    )
  );

  rejectQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      mapToPayloadProperty('id'),
      concatMap(id =>
        this.quotingService.rejectQuote(id).pipe(
          map(entity => loadQuotingDetailSuccess({ entity })),
          mapErrorToAction(rejectQuoteFail, { id })
        )
      )
    )
  );

  addQuoteToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasket),
      mapToPayloadProperty('id'),
      concatMap(id =>
        this.store.pipe(
          select(getCurrentBasketId),
          first(),
          switchMap(basketId =>
            !basketId ? this.basketService.createBasket().pipe(map(basket => basket.id)) : of(basketId)
          ),
          concatMap(() => this.quotingService.addQuoteToBasket(id)),
          mergeMapTo([updateBasket({ update: { calculated: true } }), addQuoteToBasketSuccess({ id })]),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  createQuoteRequestFromQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuote),
      mapToPayloadProperty('id'),
      concatMap(quoteId =>
        this.quotingService.createQuoteRequestFromQuote(quoteId).pipe(
          map(entity => createQuoteRequestFromQuoteSuccess({ entity })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  createQuoteRequestFromQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuoteRequest),
      mapToPayloadProperty('id'),
      concatMap(quoteRequestId =>
        this.quotingService.createQuoteRequestFromQuoteRequest(quoteRequestId).pipe(
          // concatMap(id => this.quotingService.getQuoteDetails(id, 'QuoteRequest', 'List')),
          map(entity => createQuoteRequestFromQuoteRequestSuccess({ entity })),
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
          map(entity => createQuoteRequestFromBasketSuccess({ entity })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  redirectToNewQuoteRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createQuoteRequestFromQuoteSuccess, createQuoteRequestFromBasketSuccess),
        mapToPayloadProperty('entity'),
        mapToProperty('id'),
        concatMap(id => from(this.router.navigateByUrl('/account/quotes/' + id)))
      ),
    { dispatch: false }
  );

  redirectToNewQuoteRequestCopy$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createQuoteRequestFromQuoteRequestSuccess),
        mapToPayloadProperty('entity'),
        mapToProperty('id'),
        withLatestFrom(this.store.pipe(select(selectUrl))),
        filter(([, url]) => url.startsWith('/account/quotes')),
        concatMap(([id]) => from(this.router.navigateByUrl('/account/quotes/' + id)))
      ),
    { dispatch: false }
  );

  submitQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitQuoteRequest),
      mapToPayloadProperty('id'),
      concatMap(quoteRequestId =>
        this.quotingService.submitQuoteRequest(quoteRequestId).pipe(
          concatMap(id => this.quotingService.getQuoteDetails(id, 'QuoteRequest', 'Detail')),
          map(entity => submitQuoteRequestSuccess({ entity })),
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
          map(entity => addProductToQuoteRequestSuccess({ entity })),
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
        switchMap(entity =>
          iif(
            () => !!entity,
            of(entity).pipe(
              map(QuotingHelper.state),
              map(state => [
                { key: 'quote.quotes.link', link: '/account/quotes' },
                {
                  key:
                    state === 'New' ? 'quote.edit.unsubmitted.quote_request_details.text' : 'quote.quote_details.link',
                },
              ]),
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
      concatMap(({ id, changes }) =>
        this.quotingService.updateQuoteRequest(id, changes).pipe(
          concatMap(quoteRequestId => this.quotingService.getQuoteDetails(quoteRequestId, 'QuoteRequest', 'Detail')),
          map(entity => updateQuoteRequestSuccess({ entity })),
          mapErrorToAction(loadQuotingFail)
        )
      )
    )
  );

  updateQuoteRequestSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateQuoteRequestSuccess),
      mapToPayloadProperty('entity'),
      map(QuotingHelper.asQuoteRequest),
      withLatestFrom(this.store.pipe(select(selectUrl))),
      filter(([, url]) => url.startsWith('/account/quotes')),
      map(([entity]) =>
        displaySuccessMessage({
          message: 'quote.edit.saved.your_quote_request_has_been_saved.text',
          messageParams: { 0: entity.displayName || entity.number },
        })
      )
    )
  );
}
