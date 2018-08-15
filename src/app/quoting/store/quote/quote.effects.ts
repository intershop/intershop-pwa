import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouteNavigation, ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { UserActionTypes } from '../../../core/store/user';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { FeatureToggleService } from '../../../shared/feature-toggle/services/feature-toggle.service';
import { getProductEntities, LoadProduct } from '../../../shopping/store/products';
import { mapErrorToAction } from '../../../utils/operators';
import { QuoteService } from '../../services/quote/quote.service';
import { QuoteRequestActionTypes } from '../quote-request';
import { QuotingState } from '../quoting.state';
import * as quoteActions from './quote.actions';
import { getSelectedQuote, getSelectedQuoteId } from './quote.selectors';

@Injectable()
export class QuoteEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteService: QuoteService,
    private store: Store<QuotingState | CoreState>
  ) {}

  /**
   * The load quotes effect.
   */
  @Effect()
  loadQuotes$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.LoadQuotes),
    concatMap(() =>
      this.quoteService.getQuotes().pipe(
        map(quotes => new quoteActions.LoadQuotesSuccess(quotes)),
        mapErrorToAction(quoteActions.LoadQuotesFail)
      )
    )
  );

  /**
   * Delete quote from a specific user of a specific customer.
   */
  @Effect()
  deleteQuote$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.DeleteQuote),
    map((action: quoteActions.DeleteQuote) => action.payload),
    concatMap(quoteId =>
      this.quoteService.deleteQuote(quoteId).pipe(
        map(id => new quoteActions.DeleteQuoteSuccess(id)),
        mapErrorToAction(quoteActions.DeleteQuoteFail)
      )
    )
  );

  /**
   * Reject quote from a specific user of a specific customer.
   */
  @Effect()
  rejectQuote$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.RejectQuote),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    concatMap(([, quoteId]) =>
      this.quoteService.rejectQuote(quoteId).pipe(
        map(id => new quoteActions.RejectQuoteSuccess(id)),
        mapErrorToAction(quoteActions.RejectQuoteFail)
      )
    )
  );

  /**
   * Create quote request based on selected quote from a specific user of a specific customer.
   */
  @Effect()
  createQuoteRequestFromQuote$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.CreateQuoteRequestFromQuote),
    withLatestFrom(this.store.pipe(select(getSelectedQuote))),
    concatMap(([, currentQuoteRequest]) =>
      this.quoteService.createQuoteRequestFromQuote(currentQuoteRequest).pipe(
        map(res => new quoteActions.CreateQuoteRequestFromQuoteSuccess(res)),
        mapErrorToAction(quoteActions.CreateQuoteRequestFromQuoteFail)
      )
    )
  );

  /**
   * Triggers a LoadQuotes action after successful quote related interaction with the Quote API.
   */
  @Effect()
  loadQuotesAfterChangeSuccess$ = this.actions$.pipe(
    ofType(
      quoteActions.QuoteActionTypes.DeleteQuoteSuccess,
      quoteActions.QuoteActionTypes.RejectQuoteSuccess,
      QuoteRequestActionTypes.SubmitQuoteRequestSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    filter(() => this.featureToggleService.enabled('quoting')),
    mapTo(new quoteActions.LoadQuotes())
  );

  /**
   * Triggers a SelectQuote action if route contains quoteId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    map((action: RouteNavigation) => action.payload.params.quoteId),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    filter(([fromAction, selectedQuoteId]) => fromAction !== selectedQuoteId),
    map(([itemId]) => new quoteActions.SelectQuote(itemId))
  );

  /**
   * After selecting and successfully loading quote, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForSelectedQuote$ = combineLatest(
    this.actions$.pipe(
      ofType(quoteActions.QuoteActionTypes.SelectQuote),
      map((action: quoteActions.SelectQuote) => action.payload)
    ),
    this.actions$.pipe(
      ofType(quoteActions.QuoteActionTypes.LoadQuotesSuccess),
      map((action: quoteActions.LoadQuotesSuccess) => action.payload)
    )
  ).pipe(
    map(([quoteId, quotes]) => quotes.filter(quote => quote.id === quoteId).pop()),
    filter(quote => !!quote),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    concatMap(([quote, products]) => [
      ...quote.items
        .filter((lineItem: QuoteRequestItem) => !products[lineItem.productSKU])
        .map((lineItem: QuoteRequestItem) => new LoadProduct(lineItem.productSKU)),
    ])
  );
}
