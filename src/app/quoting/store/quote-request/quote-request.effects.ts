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
import { FeatureToggleService } from '../../../shared/feature-toggle/services/feature-toggle.service';
import { getProductEntities, LoadProduct } from '../../../shopping/store/products';
import { QuoteRequestService } from '../../services/quote-request/quote-request.service';
import { QuotingState } from '../quoting.state';
import { getActiveQuoteRequest, getSelectedQuoteRequestId } from './';
import * as quoteRequestActions from './quote-request.actions';
import { getCurrentQuoteRequests, getSelectedQuoteRequest } from './quote-request.selectors';

@Injectable()
export class QuoteRequestEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteRequestService: QuoteRequestService,
    private router: Router,
    private store: Store<QuotingState | CoreState>
  ) {}

  /**
   * The load quote requests effect.
   */
  @Effect()
  loadQuoteRequests$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.LoadQuoteRequests),
    concatMap(() => {
      return this.quoteRequestService
        .getQuoteRequests()
        .pipe(
          map(quoteRequests => new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequests)),
          catchError(error => of(new quoteRequestActions.LoadQuoteRequestsFail(error)))
        );
    })
  );

  /**
   * Add quote request to a specific user of a specific customer.
   */
  @Effect()
  addQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddQuoteRequest),
    concatMap(() => {
      return this.quoteRequestService
        .addQuoteRequest()
        .pipe(
          map(id => new quoteRequestActions.AddQuoteRequestSuccess(id)),
          catchError(error => of(new quoteRequestActions.AddQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Update specific quote request for a specific user of a specific customer.
   */
  @Effect()
  updateQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.UpdateQuoteRequest),
    map((action: quoteRequestActions.UpdateQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([payload, quoteRequestId]) => {
      return this.quoteRequestService
        .updateQuoteRequest(quoteRequestId, payload)
        .pipe(
          map(quoteRequest => new quoteRequestActions.UpdateQuoteRequestSuccess(quoteRequest)),
          catchError(error => of(new quoteRequestActions.UpdateQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Delete quote request from a specific user of a specific customer.
   */
  @Effect()
  deleteQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.DeleteQuoteRequest),
    map((action: quoteRequestActions.DeleteQuoteRequest) => action.payload),
    concatMap(quoteRequestId => {
      return this.quoteRequestService
        .deleteQuoteRequest(quoteRequestId)
        .pipe(
          map(id => new quoteRequestActions.DeleteQuoteRequestSuccess(id)),
          catchError(error => of(new quoteRequestActions.DeleteQuoteRequestFail(error)))
        );
    })
  );

  /**
   * The load quote requests items effect.
   */
  @Effect()
  loadQuoteRequestItems$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.LoadQuoteRequestItems),
    map((action: quoteRequestActions.LoadQuoteRequestItems) => action.payload),
    withLatestFrom(this.store.pipe(select(getCurrentQuoteRequests))),
    map(([quoteId, quoteRequests]) => quoteRequests.filter(item => item.id === quoteId).pop()),
    filter(quoteRequest => !!quoteRequest),
    mergeMap(quoteRequest =>
      forkJoin(
        quoteRequest.items.map(item => this.quoteRequestService.getQuoteRequestItem(quoteRequest.id, item['title']))
      ).pipe(
        defaultIfEmpty(undefined),
        map(items => new quoteRequestActions.LoadQuoteRequestItemsSuccess(items)),
        catchError(error => of(new quoteRequestActions.LoadQuoteRequestItemsFail(error)))
      )
    )
  );

  /**
   * After successfully loading quote request, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess),
    map((action: quoteRequestActions.LoadQuoteRequestItemsSuccess) => action.payload),
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
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddProductToQuoteRequest),
    map((action: quoteRequestActions.AddProductToQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getUserAuthorized)), this.store.pipe(select(getActiveQuoteRequest))),
    filter(([payload, authorized, quoteRequest]) => authorized && (!!quoteRequest || !!payload.quoteRequestId)),
    map(([payload, , quoteRequest]) => ({
      // get quote request id from AddProductToQuoteRequest action if set, otherwise use id from current quote request state
      quoteRequestId: payload.quoteRequestId || quoteRequest.id,
      item: { sku: payload.sku, quantity: payload.quantity },
    })),
    concatMap(({ quoteRequestId, item }) =>
      this.quoteRequestService
        .addProductToQuoteRequest(quoteRequestId, item)
        .pipe(
          map(id => new quoteRequestActions.AddProductToQuoteRequestSuccess(id)),
          catchError(error => of(new quoteRequestActions.AddProductToQuoteRequestFail(error)))
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
    ofType(quoteRequestActions.QuoteRequestActionTypes.UpdateQuoteRequestItems),
    map((action: quoteRequestActions.UpdateQuoteRequestItems) => action.payload),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequest))),
    map(([payloadItems, selectedQuoteRequest]) => ({
      quoteRequestId: selectedQuoteRequest.id,
      updatedItems: this.filterQuoteRequestsForQuantityChanges(payloadItems, selectedQuoteRequest),
    })),
    concatMap(payload =>
      forkJoin(
        payload.updatedItems.map(
          item =>
            item.quantity > 0
              ? this.quoteRequestService.updateQuoteRequestItem(payload.quoteRequestId, item)
              : this.quoteRequestService.removeItemFromQuoteRequest(payload.quoteRequestId, item.itemId)
        )
      ).pipe(
        defaultIfEmpty(undefined),
        map(ids => new quoteRequestActions.UpdateQuoteRequestItemsSuccess(ids)),
        catchError(error => of(new quoteRequestActions.UpdateQuoteRequestItemsFail(error)))
      )
    )
  );

  /**
   * Delete item from quote request for a specific user of a specific customer.
   */
  @Effect()
  deleteItemFromQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.DeleteItemFromQuoteRequest),
    map((action: quoteRequestActions.DeleteItemFromQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([payload, quoteRequestId]) => {
      return this.quoteRequestService
        .removeItemFromQuoteRequest(quoteRequestId, payload.itemId)
        .pipe(
          map(id => new quoteRequestActions.DeleteItemFromQuoteRequestSuccess(id)),
          catchError(error => of(new quoteRequestActions.DeleteItemFromQuoteRequestFail(error)))
        );
    })
  );

  /**
   * Call quoteRequestService for addQuoteRequest before triggering AddProductToQuoteRequest with valid quote request id if user logged in
   */
  @Effect()
  addQuoteRequestBeforeAddProductToQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddProductToQuoteRequest),
    map((action: quoteRequestActions.AddProductToQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getUserAuthorized)), this.store.pipe(select(getActiveQuoteRequest))),
    filter(([payload, authorized, quoteRequest]) => authorized && !quoteRequest && !payload.quoteRequestId),
    mergeMap(([payload]) => {
      return forkJoin(of(payload), this.quoteRequestService.addQuoteRequest());
    }),
    map(([payload, quoteRequestId]) => {
      return new quoteRequestActions.AddProductToQuoteRequest({
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
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddProductToQuoteRequest),
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
      quoteRequestActions.QuoteRequestActionTypes.AddQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.UpdateQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.DeleteQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.AddProductToQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess,
      quoteRequestActions.QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    filter(() => this.featureToggleService.enabled('quoting')),
    map(() => new quoteRequestActions.LoadQuoteRequests())
  );

  /**
   * Triggers a SelectQuoteRequest action if route contains quoteRequestId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    map((action: RouteNavigation) => action.payload.params['quoteRequestId']),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    filter(([fromAction, selectedQuoteId]) => fromAction !== selectedQuoteId),
    map(([itemId]) => new quoteRequestActions.SelectQuoteRequest(itemId))
  );

  /**
   * Triggers a LoadQuoteRequestItems action if a quote request gets selected and LoadQuoteRequestsSuccess action triggered
   */
  @Effect()
  loadQuoteRequestItemsAfterSelectQuoteRequest$ = combineLatest(
    this.actions$.pipe(
      ofType(quoteRequestActions.QuoteRequestActionTypes.SelectQuoteRequest),
      map((action: quoteRequestActions.SelectQuoteRequest) => action.payload)
    ),
    this.actions$.pipe(ofType(quoteRequestActions.QuoteRequestActionTypes.LoadQuoteRequestsSuccess))
  ).pipe(filter(([quoteId]) => !!quoteId), map(([quoteId]) => new quoteRequestActions.LoadQuoteRequestItems(quoteId)));

  /**
   * Filter for itemId and quantity pairs with actual quantity changes.
   * @param payloadItems          The items of the action payload, containing items to update.
   * @param selectedQuoteRequest  The selected quote request item.
   * @returns                     An array of filtered itemId and quantity pairs.
   */
  filterQuoteRequestsForQuantityChanges(
    payloadItems: { itemId: string; quantity: number }[],
    selectedQuoteRequest: QuoteRequest
  ) {
    const quoteRequestItems = selectedQuoteRequest.items;
    const updatedItems: { itemId: string; quantity: number }[] = [];
    if (quoteRequestItems) {
      for (const quoteRequestItem of quoteRequestItems as QuoteRequestItem[]) {
        for (const item of payloadItems) {
          if (quoteRequestItem.id === item.itemId && quoteRequestItem.quantity.value !== item.quantity) {
            updatedItems.push(item);
          }
        }
      }
    }
    return updatedItems;
  }
}
