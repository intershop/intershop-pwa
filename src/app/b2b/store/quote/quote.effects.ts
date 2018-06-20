import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouteNavigation, ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { combineLatest, forkJoin, of } from 'rxjs';
import {
  catchError,
  concatMap,
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { getUserAuthorized, UserActionTypes } from '../../../core/store/user';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { getProductEntities, LoadProduct } from '../../../shopping/store/products';
import { QuoteService } from '../../services/quote/quote.service';
import { B2bState } from '../b2b.state';
import { getActiveQuoteRequest, getCurrentQuotes, getSelectedQuoteId } from './';
import * as quoteActions from './quote.actions';
import { getCurrentQuoteRequests } from './quote.selectors';

@Injectable()
export class QuoteEffects {
  constructor(
    private actions$: Actions,
    private store: Store<B2bState | CoreState>,
    private quoteService: QuoteService,
    private router: Router
  ) {}

  /**
   * The load quote requests effect.
   */
  @Effect()
  loadQuoteRequests$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.LoadQuoteRequests),
    concatMap(() => {
      return this.quoteService
        .getQuoteRequests()
        .pipe(
          map(quoteRequests => new quoteActions.LoadQuoteRequestsSuccess(quoteRequests)),
          catchError(error => of(new quoteActions.LoadQuoteRequestsFail(error)))
        );
    })
  );

  /**
   * The load quotes effect.
   */
  @Effect()
  loadQuotes$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.LoadQuotes),
    concatMap(() => {
      return this.quoteService
        .getQuotes()
        .pipe(
          map(quotes => new quoteActions.LoadQuotesSuccess(quotes)),
          catchError(error => of(new quoteActions.LoadQuotesFail(error)))
        );
    })
  );

  /**
   * Add quote request to a specific user of a specific customer.
   */
  @Effect()
  addQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.AddQuoteRequest),
    concatMap(() => {
      return this.quoteService
        .addQuoteRequest()
        .pipe(
          map(() => new quoteActions.AddQuoteRequestSuccess()),
          catchError(error => of(new quoteActions.AddQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Update specific quote request for a specific user of a specific customer.
   */
  @Effect()
  updateQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.UpdateQuoteRequest),
    map((action: quoteActions.UpdateQuoteRequest) => action.payload),
    concatMap(payload => {
      return this.quoteService
        .updateQuoteRequest(payload)
        .pipe(
          map(() => new quoteActions.UpdateQuoteRequestSuccess()),
          catchError(error => of(new quoteActions.UpdateQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Delete quote request from a specific user of a specific customer.
   */
  @Effect()
  deleteQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.DeleteQuoteRequest),
    map((action: quoteActions.DeleteQuoteRequest) => action.payload),
    concatMap(quoteRequestId => {
      return this.quoteService
        .deleteQuoteRequest(quoteRequestId)
        .pipe(
          map(() => new quoteActions.DeleteQuoteRequestSuccess()),
          catchError(error => of(new quoteActions.DeleteQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Delete quote from a specific user of a specific customer.
   */
  @Effect()
  deleteQuote$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.DeleteQuote),
    map((action: quoteActions.DeleteQuote) => action.payload),
    concatMap(quoteId => {
      return this.quoteService
        .deleteQuote(quoteId)
        .pipe(
          map(() => new quoteActions.DeleteQuoteSuccess()),
          catchError(error => of(new quoteActions.DeleteQuoteFail(error)))
        );
    })
  );

  /**
   * The load quote requests items effect.
   */
  @Effect()
  loadQuoteRequestItems$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.LoadQuoteRequestItems),
    map((action: quoteActions.LoadQuoteRequestItems) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentQuotes))),
    mergeMap(([payload, quotes]) => {
      const quote = quotes.filter(item => item.id === payload).pop();

      if (!quote) {
        return of(undefined);
      }

      return forkJoin(quote.items.map(item => this.quoteService.getQuoteRequestItem(payload, item['title']))).pipe(
        defaultIfEmpty(undefined),
        map(items => {
          return new quoteActions.LoadQuoteRequestItemsSuccess(items);
        }),
        catchError(error => of(new quoteActions.LoadQuoteRequestItemsFail(error)))
      );
    })
  );

  /**
   * After successfully loading quote request, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.LoadQuoteRequestItemsSuccess),
    map((action: quoteActions.LoadQuoteRequestItemsSuccess) => action.payload),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    concatMap(([lineItems, products]) => [
      ...lineItems
        .filter(lineItem => !products[lineItem.productSKU])
        .map(lineItem => new LoadProduct(lineItem.productSKU)),
    ])
  );

  /**
   * Add an item to the current editable quote request from a specific user of a specific customer.
   */
  @Effect()
  addProductToQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.AddProductToQuoteRequest),
    map((action: quoteActions.AddProductToQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getUserAuthorized)), this.store.pipe(select(getActiveQuoteRequest))),
    filter(([payload, authorized, quoteRequest]) => authorized && (!!quoteRequest || !!payload.quoteRequestId)),
    map(([payload, , quoteRequest]) => ({
      // get quote request id from AddProductToQuoteRequest action if set, otherwise use id from current quote request state
      quoteRequestId: payload.quoteRequestId || quoteRequest.id,
      item: { sku: payload.sku, quantity: payload.quantity },
    })),
    concatMap(({ quoteRequestId, item }) =>
      this.quoteService
        .addProductToQuoteRequest(quoteRequestId, item)
        .pipe(
          map(() => new quoteActions.AddProductToQuoteRequestSuccess()),
          catchError(error => of(new quoteActions.AddProductToQuoteRequestFail(error)))
        )
    )
  );

  /**
   * Update quote request items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  @Effect()
  updateQuoteRequestItems$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.UpdateQuoteRequestItems),
    map((action: quoteActions.UpdateQuoteRequestItems) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentQuoteRequests))),
    map(([payload, quotes]) => ({
      quoteRequestId: payload.quoteRequestId,
      updatedItems: this.filterQuotesForQuantityChanges(payload, quotes),
    })),
    concatMap(payload =>
      forkJoin(
        payload.updatedItems.map(
          item =>
            item.quantity > 0
              ? this.quoteService.updateQuoteRequestItem(payload.quoteRequestId, item)
              : this.quoteService.removeItemFromQuoteRequest(payload.quoteRequestId, item.itemId)
        )
      ).pipe(
        defaultIfEmpty(undefined),
        map(() => new quoteActions.UpdateQuoteRequestItemsSuccess()),
        catchError(error => of(new quoteActions.UpdateQuoteRequestItemsFail(error)))
      )
    )
  );

  /**
   * Delete item from quote request for a specific user of a specific customer.
   */
  @Effect()
  deleteItemFromQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.DeleteItemFromQuoteRequest),
    map((action: quoteActions.DeleteItemFromQuoteRequest) => action.payload),
    concatMap(payload => {
      return this.quoteService
        .removeItemFromQuoteRequest(payload.quoteRequestId, payload.itemId)
        .pipe(
          map(quotes => new quoteActions.DeleteItemFromQuoteRequestSuccess()),
          catchError(error => of(new quoteActions.DeleteItemFromQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Call quoteService for addQuoteRequest before triggering AddProductToQuoteRequest with valid quote request id if user logged in
   */
  @Effect()
  addQuoteRequestBeforeAddProductToQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.AddProductToQuoteRequest),
    map((action: quoteActions.AddProductToQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getUserAuthorized)), this.store.pipe(select(getActiveQuoteRequest))),
    filter(([payload, authorized, quoteRequest]) => authorized && !quoteRequest && !payload.quoteRequestId),
    mergeMap(([payload]) => {
      return forkJoin(of(payload), this.quoteService.addQuoteRequest());
    }),
    map(([payload, quoteRequestId]) => {
      return new quoteActions.AddProductToQuoteRequest({
        quoteRequestId: quoteRequestId,
        sku: payload.sku,
        quantity: payload.quantity,
      });
    })
  );

  /**
   * Call router for navigate to login on AddProductToQuoteRequest if not logged in.
   */
  @Effect({ dispatch: false })
  goToLoginOnAddQuoteRequest$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.AddProductToQuoteRequest),
    switchMap(() => this.store.pipe(select(getUserAuthorized))),
    filter(authorized => !authorized),
    tap(() => {
      const queryParams = { returnUrl: this.router.routerState.snapshot.url };
      this.router.navigate(['/login'], { queryParams });
    })
  );

  /**
   * Triggers a LoadQuoteRequests action after successful quote request related interaction with the Quote API.
   */
  @Effect()
  loadQuoteRequestsAfterChangeSuccess$ = this.actions$.pipe(
    ofType(
      quoteActions.QuoteActionTypes.AddQuoteRequestSuccess,
      quoteActions.QuoteActionTypes.UpdateQuoteRequestSuccess,
      quoteActions.QuoteActionTypes.DeleteQuoteRequestSuccess,
      quoteActions.QuoteActionTypes.AddProductToQuoteRequestSuccess,
      quoteActions.QuoteActionTypes.UpdateQuoteRequestItemsSuccess,
      quoteActions.QuoteActionTypes.DeleteItemFromQuoteRequestSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    map(() => new quoteActions.LoadQuoteRequests())
  );

  /**
   * Triggers a LoadQuotes action after successful quote related interaction with the Quote API.
   */
  @Effect()
  loadQuotesAfterChangeSuccess$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.DeleteQuoteSuccess, UserActionTypes.LoadCompanyUserSuccess),
    map(() => new quoteActions.LoadQuotes())
  );

  /**
   * Triggers a SelectQuote action if route contains quoteId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    map((action: RouteNavigation) => action.payload.params['quoteId']),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
    filter(([fromAction, selectedQuoteId]) => fromAction !== selectedQuoteId),
    map(([itemId]) => new quoteActions.SelectQuote(itemId))
  );

  /**
   * Triggers a LoadQuoteRequestItems action if a quote items gets selected and LoadQuoteRequestsSuccess action triggered
   */
  @Effect()
  loadQuoteRequestItemsAfterSelectQuote$ = combineLatest(
    this.actions$.pipe(
      ofType(quoteActions.QuoteActionTypes.SelectQuote),
      map((action: quoteActions.SelectQuote) => action.payload)
    ),
    this.actions$.pipe(ofType(quoteActions.QuoteActionTypes.LoadQuoteRequestsSuccess))
  ).pipe(filter(([quoteId]) => !!quoteId), map(([quoteId]) => new quoteActions.LoadQuoteRequestItems(quoteId)));

  /**
   * Filter for itemId and quantity pairs with actual quantity changes.
   * @param payload The action payload, containing items to update.
   * @param quotes  An array of current quotes.
   * @returns       An array of filtered itemId and quantity pairs.
   */
  filterQuotesForQuantityChanges(
    payload: { quoteRequestId; items: { itemId: string; quantity: number }[] },
    quotes: QuoteRequest[]
  ) {
    const quoteRequestItems = quotes.filter(quote => quote.id === payload.quoteRequestId).pop().items;
    const updatedItems: { itemId: string; quantity: number }[] = [];
    if (quoteRequestItems) {
      for (const quoteRequestItem of quoteRequestItems as QuoteRequestItem[]) {
        for (const item of payload.items) {
          if (quoteRequestItem.id === item.itemId && quoteRequestItem.quantity.value !== item.quantity) {
            updatedItems.push(item);
          }
        }
      }
    }
    return updatedItems;
  }
}
