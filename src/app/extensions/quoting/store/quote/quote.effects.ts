import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE, RouteNavigation } from 'ngrx-router';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { LoadProduct, getProductEntities } from 'ish-core/store/shopping/products';
import { UserActionTypes } from 'ish-core/store/user';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { QuoteService } from '../../services/quote/quote.service';
import { QuoteRequestActionTypes } from '../quote-request';

import * as actions from './quote.actions';
import { getSelectedQuote, getSelectedQuoteId } from './quote.selectors';

@Injectable()
export class QuoteEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteService: QuoteService,
    private store: Store<{}>
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
    withLatestFrom(this.store.pipe(select(getSelectedQuote))),
    concatMap(([, currentQuoteRequest]) =>
      this.quoteService.createQuoteRequestFromQuote(currentQuoteRequest).pipe(
        map(quoteLineItemRequest => new actions.CreateQuoteRequestFromQuoteSuccess({ quoteLineItemRequest })),
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
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.params.quoteId),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    filter(([fromAction, selectedQuoteId]) => fromAction !== selectedQuoteId),
    map(([itemId]) => new actions.SelectQuote(itemId))
  );

  /**
   * After selecting and successfully loading quote, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedQuote$ = combineLatest(
    this.actions$.pipe(
      ofType<actions.SelectQuote>(actions.QuoteActionTypes.SelectQuote),
      mapToPayloadProperty('id')
    ),
    this.actions$.pipe(
      ofType<actions.LoadQuotesSuccess>(actions.QuoteActionTypes.LoadQuotesSuccess),
      mapToPayloadProperty('quotes')
    )
  ).pipe(
    map(([quoteId, quotes]) => quotes.filter(quote => quote.id === quoteId).pop()),
    whenTruthy(),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    concatMap(([quote, products]) => [
      ...quote.items
        .map(lineItem => lineItem.productSKU)
        .filter(sku => !products[sku])
        .map(sku => new LoadProduct({ sku })),
    ])
  );
}
