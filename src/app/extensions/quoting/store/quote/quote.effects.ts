import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasketId, updateBasket } from 'ish-core/store/customer/basket';
import { loadCompanyUserSuccess } from 'ish-core/store/customer/user';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { QuoteService } from '../../services/quote/quote.service';
import { submitQuoteRequestSuccess } from '../quote-request';

import {
  addQuoteToBasket,
  addQuoteToBasketFail,
  addQuoteToBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteFail,
  createQuoteRequestFromQuoteSuccess,
  deleteQuote,
  deleteQuoteFail,
  deleteQuoteSuccess,
  loadQuotes,
  loadQuotesFail,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuoteFail,
  rejectQuoteSuccess,
  selectQuote,
} from './quote.actions';
import { getSelectedQuote, getSelectedQuoteId, getSelectedQuoteWithProducts } from './quote.selectors';

@Injectable()
export class QuoteEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteService: QuoteService,
    private basketService: BasketService,
    private router: Router,
    private store: Store,
    private translateService: TranslateService
  ) {}

  /**
   * The load quotes effect.
   */
  loadQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotes),
      concatMap(() =>
        this.quoteService.getQuotes().pipe(
          map(quotes => loadQuotesSuccess({ quotes })),
          mapErrorToAction(loadQuotesFail)
        )
      )
    )
  );

  /**
   * Delete quote from a specific user of a specific customer.
   */
  deleteQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuote),
      mapToPayloadProperty('id'),
      concatMap(quoteId =>
        this.quoteService.deleteQuote(quoteId).pipe(
          map(id => deleteQuoteSuccess({ id })),
          mapErrorToAction(deleteQuoteFail)
        )
      )
    )
  );

  /**
   * Reject quote from a specific user of a specific customer.
   */
  rejectQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
      concatMap(([, quoteId]) =>
        this.quoteService.rejectQuote(quoteId).pipe(
          map(id => rejectQuoteSuccess({ id })),
          mapErrorToAction(rejectQuoteFail)
        )
      )
    )
  );

  /**
   * Create quote request based on selected quote from a specific user of a specific customer.
   */
  createQuoteRequestFromQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuote),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteWithProducts))),
      concatMap(([, currentQuoteRequest]) =>
        this.quoteService.createQuoteRequestFromQuote(currentQuoteRequest).pipe(
          map(quoteLineItemRequest => createQuoteRequestFromQuoteSuccess({ quoteLineItemRequest })),
          tap(quoteLineItemResult =>
            this.router.navigate([`/account/quotes/request/${quoteLineItemResult.payload.quoteLineItemRequest.title}`])
          ),
          mapErrorToAction(createQuoteRequestFromQuoteFail)
        )
      )
    )
  );

  /**
   * Triggers a LoadQuotes action after successful quote related interaction with the Quote API.
   */
  loadQuotesAfterChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuoteSuccess, rejectQuoteSuccess, submitQuoteRequestSuccess, loadCompanyUserSuccess),
      filter(() => this.featureToggleService.enabled('quoting')),
      mapTo(loadQuotes())
    )
  );

  /**
   * Triggers a SelectQuote action if route contains quoteId parameter
   */
  routeListenerForSelectingQuote$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('quoteId')),
      whenTruthy(),
      map(id => selectQuote({ id }))
    )
  );

  /**
   * After selecting and successfully loading quote, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  loadProductsForSelectedQuote$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(selectQuote), mapToPayloadProperty('id')),
      this.actions$.pipe(ofType(loadQuotesSuccess), mapToPayloadProperty('quotes')),
    ]).pipe(
      map(([quoteId, quotes]) => quotes.filter(quote => quote.id === quoteId).pop()),
      whenTruthy(),
      concatMap(quote => [
        ...quote.items.map(({ productSKU }) =>
          loadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
        ),
      ])
    )
  );

  /**
   * Add quote to the current basket.
   * Only triggers if the user has a basket.
   */
  addQuoteToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([payload, currentBasketId]) => !!currentBasketId || !!payload.basketId),
      concatMap(([payload, currentBasketId]) =>
        this.quoteService.addQuoteToBasket(payload.quoteId, currentBasketId || payload.basketId).pipe(
          map(link => addQuoteToBasketSuccess({ link })),
          mapErrorToAction(addQuoteToBasketFail)
        )
      )
    )
  );

  /**
   * Get current basket if missing and call AddQuoteToBasketAction
   * Only triggers if the user has not yet a basket
   */
  getBasketBeforeAddQuoteToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([payload, basketId]) => !basketId && !payload.basketId),
      mergeMap(([{ quoteId }]) =>
        this.basketService.createBasket().pipe(map(basket => addQuoteToBasket({ quoteId, basketId: basket.id })))
      )
    )
  );

  /**
   * Triggers a Caluculate Basket action after adding a quote to basket.
   * ToDo: This is only necessary as long as api v0 is used for addQuote and addPayment
   */
  calculateBasketAfterAddToQuote = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasketSuccess, addQuoteToBasketFail),
      mapTo(updateBasket({ update: { calculated: true } }))
    )
  );

  /**
   * Triggers a navigation to the basket if quote successfully added to the basket.
   */
  gotoBasketAfterAddQuoteToBasketSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addQuoteToBasketSuccess),
        tap(() => {
          this.router.navigate(['/basket']);
        })
      ),
    { dispatch: false }
  );

  setQuoteRequestBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedQuote),
      whenTruthy(),
      withLatestFrom(this.translateService.get('quote.edit.responded.quote_details.text')),
      withLatestFrom(this.translateService.get('quote.edit.unsubmitted.quote_request_details.text')),
      map(([[quote, x], y]) => [quote, quote.state === 'Responded' ? x : y]),
      map(([quote, x]) =>
        setBreadcrumbData({
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quotes' },
            { text: `${x} - ${quote.displayName}` },
          ],
        })
      )
    )
  );
}
