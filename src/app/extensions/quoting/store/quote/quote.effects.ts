import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { mapToParam, ofRoute } from 'ngrx-router';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { UpdateBasket, getCurrentBasketId } from 'ish-core/store/checkout/basket';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { UserActionTypes } from 'ish-core/store/user';
import { SetBreadcrumbData } from 'ish-core/store/viewconf';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { QuoteService } from '../../services/quote/quote.service';
import { QuoteRequestActionTypes } from '../quote-request';

import * as actions from './quote.actions';
import { getSelectedQuote, getSelectedQuoteId, getSelectedQuoteWithProducts } from './quote.selectors';

@Injectable()
export class QuoteEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteService: QuoteService,
    private basketService: BasketService,
    private router: Router,
    private store: Store<{}>,
    private translateService: TranslateService
  ) {}

  /**
   * The load quotes effect.
   */
  @Effect()
  loadQuotes$ = this.actions$.pipe(
    ofType(actions.QuoteActionTypes.LoadQuotes),
    concatMap(() =>
      this.quoteService.getQuotes().pipe(
        map(quotes => new actions.LoadQuotesSuccess({ quotes })),
        mapErrorToAction(actions.LoadQuotesFail)
      )
    )
  );

  /**
   * Delete quote from a specific user of a specific customer.
   */
  @Effect()
  deleteQuote$ = this.actions$.pipe(
    ofType<actions.DeleteQuote>(actions.QuoteActionTypes.DeleteQuote),
    mapToPayloadProperty('id'),
    concatMap(quoteId =>
      this.quoteService.deleteQuote(quoteId).pipe(
        map(id => new actions.DeleteQuoteSuccess({ id })),
        mapErrorToAction(actions.DeleteQuoteFail)
      )
    )
  );

  /**
   * Reject quote from a specific user of a specific customer.
   */
  @Effect()
  rejectQuote$ = this.actions$.pipe(
    ofType(actions.QuoteActionTypes.RejectQuote),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    concatMap(([, quoteId]) =>
      this.quoteService.rejectQuote(quoteId).pipe(
        map(id => new actions.RejectQuoteSuccess({ id })),
        mapErrorToAction(actions.RejectQuoteFail)
      )
    )
  );

  /**
   * Create quote request based on selected quote from a specific user of a specific customer.
   */
  @Effect()
  createQuoteRequestFromQuote$ = this.actions$.pipe(
    ofType(actions.QuoteActionTypes.CreateQuoteRequestFromQuote),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteWithProducts))),
    concatMap(([, currentQuoteRequest]) =>
      this.quoteService.createQuoteRequestFromQuote(currentQuoteRequest).pipe(
        map(quoteLineItemRequest => new actions.CreateQuoteRequestFromQuoteSuccess({ quoteLineItemRequest })),
        tap(quoteLineItemResult =>
          this.router.navigate([`/account/quotes/request/${quoteLineItemResult.payload.quoteLineItemRequest.title}`])
        ),
        mapErrorToAction(actions.CreateQuoteRequestFromQuoteFail)
      )
    )
  );

  /**
   * Triggers a LoadQuotes action after successful quote related interaction with the Quote API.
   */
  @Effect()
  loadQuotesAfterChangeSuccess$ = this.actions$.pipe(
    ofType(
      actions.QuoteActionTypes.DeleteQuoteSuccess,
      actions.QuoteActionTypes.RejectQuoteSuccess,
      QuoteRequestActionTypes.SubmitQuoteRequestSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    filter(() => this.featureToggleService.enabled('quoting')),
    mapTo(new actions.LoadQuotes())
  );

  /**
   * Triggers a SelectQuote action if route contains quoteId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.actions$.pipe(
    ofRoute(),
    mapToParam<string>('quoteId'),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    filter(([fromAction, selectedQuoteId]) => fromAction !== selectedQuoteId),
    map(([itemId]) => new actions.SelectQuote({ id: itemId }))
  );

  /**
   * After selecting and successfully loading quote, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedQuote$ = combineLatest([
    this.actions$.pipe(
      ofType<actions.SelectQuote>(actions.QuoteActionTypes.SelectQuote),
      mapToPayloadProperty('id')
    ),
    this.actions$.pipe(
      ofType<actions.LoadQuotesSuccess>(actions.QuoteActionTypes.LoadQuotesSuccess),
      mapToPayloadProperty('quotes')
    ),
  ]).pipe(
    map(([quoteId, quotes]) => quotes.filter(quote => quote.id === quoteId).pop()),
    whenTruthy(),
    concatMap(quote => [
      ...quote.items.map(
        ({ productSKU }) => new LoadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
      ),
    ])
  );

  /**
   * Add quote to the current basket.
   * Only triggers if the user has a basket.
   */
  @Effect()
  addQuoteToBasket$ = this.actions$.pipe(
    ofType<actions.AddQuoteToBasket>(actions.QuoteActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, currentBasketId]) => !!currentBasketId || !!payload.basketId),
    concatMap(([payload, currentBasketId]) =>
      this.quoteService.addQuoteToBasket(payload.quoteId, currentBasketId || payload.basketId).pipe(
        map(link => new actions.AddQuoteToBasketSuccess({ link })),
        mapErrorToAction(actions.AddQuoteToBasketFail)
      )
    )
  );

  /**
   * Get current basket if missing and call AddQuoteToBasketAction
   * Only triggers if the user has not yet a basket
   */
  @Effect()
  getBasketBeforeAddQuoteToBasket$ = this.actions$.pipe(
    ofType<actions.AddQuoteToBasket>(actions.QuoteActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, basketId]) => !basketId && !payload.basketId),
    mergeMap(([{ quoteId }]) =>
      this.basketService
        .createBasket()
        .pipe(map(basket => new actions.AddQuoteToBasket({ quoteId, basketId: basket.id })))
    )
  );

  /**
   * Triggers a Caluculate Basket action after adding a quote to basket.
   * ToDo: This is only necessary as long as api v0 is used for addQuote and addPayment
   */
  @Effect()
  calculateBasketAfterAddToQuote = this.actions$.pipe(
    ofType(actions.QuoteActionTypes.AddQuoteToBasketSuccess, actions.QuoteActionTypes.AddQuoteToBasketFail),
    mapTo(new UpdateBasket({ update: { calculated: true } }))
  );

  /**
   * Triggers a navigation to the basket if quote successfully added to the basket.
   */
  @Effect({ dispatch: false })
  gotoBasketAfterAddQuoteToBasketSuccess$ = this.actions$.pipe(
    ofType(actions.QuoteActionTypes.AddQuoteToBasketSuccess),
    tap(() => {
      this.router.navigate(['/basket']);
    })
  );

  @Effect()
  setQuoteRequestBreadcrumb$ = this.actions$.pipe(
    ofRoute(),
    mapToParam('quoteId'),
    whenTruthy(),
    switchMapTo(this.store.pipe(select(getSelectedQuote))),
    whenTruthy(),
    withLatestFrom(this.translateService.get('quote.edit.responded.quote_details.text')),
    withLatestFrom(this.translateService.get('quote.edit.unsubmitted.quote_request_details.text')),
    map(([[quote, x], y]) => [quote, quote.state === 'Responded' ? x : y]),
    map(
      ([quote, x]) =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quotes' },
            { text: `${x} - ${quote.displayName}` },
          ],
        })
    )
  );
}
