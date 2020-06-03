import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { UpdateBasket, getCurrentBasketId } from 'ish-core/store/account/basket';
import { UserActionTypes } from 'ish-core/store/account/user';
import { selectRouteParam } from 'ish-core/store/core/router';
import { SetBreadcrumbData } from 'ish-core/store/core/viewconf';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { QuoteService } from '../../services/quote/quote.service';
import { QuoteRequestActionTypes } from '../quote-request';

import {
  AddQuoteToBasket,
  AddQuoteToBasketFail,
  AddQuoteToBasketSuccess,
  CreateQuoteRequestFromQuoteFail,
  CreateQuoteRequestFromQuoteSuccess,
  DeleteQuote,
  DeleteQuoteFail,
  DeleteQuoteSuccess,
  LoadQuotes,
  LoadQuotesFail,
  LoadQuotesSuccess,
  QuoteActionTypes,
  RejectQuoteFail,
  RejectQuoteSuccess,
  SelectQuote,
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
  @Effect()
  loadQuotes$ = this.actions$.pipe(
    ofType(QuoteActionTypes.LoadQuotes),
    concatMap(() =>
      this.quoteService.getQuotes().pipe(
        map(quotes => new LoadQuotesSuccess({ quotes })),
        mapErrorToAction(LoadQuotesFail)
      )
    )
  );

  /**
   * Delete quote from a specific user of a specific customer.
   */
  @Effect()
  deleteQuote$ = this.actions$.pipe(
    ofType<DeleteQuote>(QuoteActionTypes.DeleteQuote),
    mapToPayloadProperty('id'),
    concatMap(quoteId =>
      this.quoteService.deleteQuote(quoteId).pipe(
        map(id => new DeleteQuoteSuccess({ id })),
        mapErrorToAction(DeleteQuoteFail)
      )
    )
  );

  /**
   * Reject quote from a specific user of a specific customer.
   */
  @Effect()
  rejectQuote$ = this.actions$.pipe(
    ofType(QuoteActionTypes.RejectQuote),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    concatMap(([, quoteId]) =>
      this.quoteService.rejectQuote(quoteId).pipe(
        map(id => new RejectQuoteSuccess({ id })),
        mapErrorToAction(RejectQuoteFail)
      )
    )
  );

  /**
   * Create quote request based on selected quote from a specific user of a specific customer.
   */
  @Effect()
  createQuoteRequestFromQuote$ = this.actions$.pipe(
    ofType(QuoteActionTypes.CreateQuoteRequestFromQuote),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteWithProducts))),
    concatMap(([, currentQuoteRequest]) =>
      this.quoteService.createQuoteRequestFromQuote(currentQuoteRequest).pipe(
        map(quoteLineItemRequest => new CreateQuoteRequestFromQuoteSuccess({ quoteLineItemRequest })),
        tap(quoteLineItemResult =>
          this.router.navigate([`/account/quotes/request/${quoteLineItemResult.payload.quoteLineItemRequest.title}`])
        ),
        mapErrorToAction(CreateQuoteRequestFromQuoteFail)
      )
    )
  );

  /**
   * Triggers a LoadQuotes action after successful quote related interaction with the Quote API.
   */
  @Effect()
  loadQuotesAfterChangeSuccess$ = this.actions$.pipe(
    ofType(
      QuoteActionTypes.DeleteQuoteSuccess,
      QuoteActionTypes.RejectQuoteSuccess,
      QuoteRequestActionTypes.SubmitQuoteRequestSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    filter(() => this.featureToggleService.enabled('quoting')),
    mapTo(new LoadQuotes())
  );

  /**
   * Triggers a SelectQuote action if route contains quoteId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.store.pipe(
    select(selectRouteParam('quoteId')),
    map(id => new SelectQuote({ id }))
  );

  /**
   * After selecting and successfully loading quote, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedQuote$ = combineLatest([
    this.actions$.pipe(ofType<SelectQuote>(QuoteActionTypes.SelectQuote), mapToPayloadProperty('id')),
    this.actions$.pipe(ofType<LoadQuotesSuccess>(QuoteActionTypes.LoadQuotesSuccess), mapToPayloadProperty('quotes')),
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
    ofType<AddQuoteToBasket>(QuoteActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, currentBasketId]) => !!currentBasketId || !!payload.basketId),
    concatMap(([payload, currentBasketId]) =>
      this.quoteService.addQuoteToBasket(payload.quoteId, currentBasketId || payload.basketId).pipe(
        map(link => new AddQuoteToBasketSuccess({ link })),
        mapErrorToAction(AddQuoteToBasketFail)
      )
    )
  );

  /**
   * Get current basket if missing and call AddQuoteToBasketAction
   * Only triggers if the user has not yet a basket
   */
  @Effect()
  getBasketBeforeAddQuoteToBasket$ = this.actions$.pipe(
    ofType<AddQuoteToBasket>(QuoteActionTypes.AddQuoteToBasket),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
    filter(([payload, basketId]) => !basketId && !payload.basketId),
    mergeMap(([{ quoteId }]) =>
      this.basketService.createBasket().pipe(map(basket => new AddQuoteToBasket({ quoteId, basketId: basket.id })))
    )
  );

  /**
   * Triggers a Caluculate Basket action after adding a quote to basket.
   * ToDo: This is only necessary as long as api v0 is used for addQuote and addPayment
   */
  @Effect()
  calculateBasketAfterAddToQuote = this.actions$.pipe(
    ofType(QuoteActionTypes.AddQuoteToBasketSuccess, QuoteActionTypes.AddQuoteToBasketFail),
    mapTo(new UpdateBasket({ update: { calculated: true } }))
  );

  /**
   * Triggers a navigation to the basket if quote successfully added to the basket.
   */
  @Effect({ dispatch: false })
  gotoBasketAfterAddQuoteToBasketSuccess$ = this.actions$.pipe(
    ofType(QuoteActionTypes.AddQuoteToBasketSuccess),
    tap(() => {
      this.router.navigate(['/basket']);
    })
  );

  @Effect()
  setQuoteRequestBreadcrumb$ = this.store.pipe(
    select(getSelectedQuote),
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
