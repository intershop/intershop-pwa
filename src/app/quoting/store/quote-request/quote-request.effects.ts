import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE, RouteNavigation } from 'ngrx-router';
import { combineLatest, forkJoin } from 'rxjs';
import { concatMap, defaultIfEmpty, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { getCurrentBasket } from '../../../checkout/store/basket';
import { UserActionTypes, getUserAuthorized } from '../../../core/store/user';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { FeatureToggleService } from '../../../shared/feature-toggle/services/feature-toggle.service';
import { LoadProduct, getProductEntities } from '../../../shopping/store/products';
import { mapErrorToAction } from '../../../utils/operators';
import { QuoteRequestService } from '../../services/quote-request/quote-request.service';
import { QuoteActionTypes } from '../quote/quote.actions';

import * as quoteRequestActions from './quote-request.actions';
import { getCurrentQuoteRequests, getSelectedQuoteRequest, getSelectedQuoteRequestId } from './quote-request.selectors';

@Injectable()
export class QuoteRequestEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteRequestService: QuoteRequestService,
    private router: Router,
    private store: Store<{}>
  ) {}

  /**
   * The load quote requests effect.
   */
  @Effect()
  loadQuoteRequests$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.LoadQuoteRequests),
    concatMap(() =>
      this.quoteRequestService.getQuoteRequests().pipe(
        map(quoteRequests => new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequests)),
        mapErrorToAction(quoteRequestActions.LoadQuoteRequestsFail)
      )
    )
  );

  /**
   * Add quote request to a specific user of a specific customer.
   */
  @Effect()
  addQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddQuoteRequest),
    concatMap(() =>
      this.quoteRequestService.addQuoteRequest().pipe(
        map(id => new quoteRequestActions.AddQuoteRequestSuccess(id)),
        mapErrorToAction(quoteRequestActions.AddQuoteRequestFail)
      )
    )
  );

  /**
   * Update specific quote request for a specific user of a specific customer.
   */
  @Effect()
  updateQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.UpdateQuoteRequest),
    map((action: quoteRequestActions.UpdateQuoteRequest) => action.payload),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([payload, quoteRequestId]) =>
      this.quoteRequestService.updateQuoteRequest(quoteRequestId, payload).pipe(
        map(quoteRequest => new quoteRequestActions.UpdateQuoteRequestSuccess(quoteRequest)),
        mapErrorToAction(quoteRequestActions.UpdateQuoteRequestFail)
      )
    )
  );

  /**
   * Delete quote request from a specific user of a specific customer.
   */
  @Effect()
  deleteQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.DeleteQuoteRequest),
    map((action: quoteRequestActions.DeleteQuoteRequest) => action.payload),
    concatMap(quoteRequestId =>
      this.quoteRequestService.deleteQuoteRequest(quoteRequestId).pipe(
        map(id => new quoteRequestActions.DeleteQuoteRequestSuccess(id)),
        mapErrorToAction(quoteRequestActions.DeleteQuoteRequestFail)
      )
    )
  );

  /**
   * Submit quote request from a specific user of a specific customer.
   */
  @Effect()
  submitQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.SubmitQuoteRequest),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([, quoteRequestId]) =>
      this.quoteRequestService.submitQuoteRequest(quoteRequestId).pipe(
        map(id => new quoteRequestActions.SubmitQuoteRequestSuccess(id)),
        mapErrorToAction(quoteRequestActions.SubmitQuoteRequestFail)
      )
    )
  );

  /**
   * Create quote request based on selected, submited quote request from a specific user of a specific customer.
   */
  @Effect()
  createQuoteRequestFromQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequest),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequest))),
    concatMap(([, currentQuoteRequest]) =>
      this.quoteRequestService.createQuoteRequestFromQuoteRequest(currentQuoteRequest).pipe(
        map(res => new quoteRequestActions.CreateQuoteRequestFromQuoteRequestSuccess(res)),
        mapErrorToAction(quoteRequestActions.CreateQuoteRequestFromQuoteRequestFail)
      )
    )
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
        // tslint:disable-next-line:no-string-literal
        quoteRequest.items.map(item => this.quoteRequestService.getQuoteRequestItem(quoteRequest.id, item['title']))
      ).pipe(
        defaultIfEmpty([]),
        map(items => new quoteRequestActions.LoadQuoteRequestItemsSuccess(items)),
        mapErrorToAction(quoteRequestActions.LoadQuoteRequestItemsFail)
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
    withLatestFrom(this.store.pipe(select(getUserAuthorized))),
    filter(([, authorized]) => authorized),
    concatMap(([item]) =>
      this.quoteRequestService.addProductToQuoteRequest(item.sku, item.quantity).pipe(
        map(id => new quoteRequestActions.AddProductToQuoteRequestSuccess(id)),
        mapErrorToAction(quoteRequestActions.AddProductToQuoteRequestFail)
      )
    )
  );

  /**
   * Trigger a AddProductToQuoteRequest action for each line item thats in the current basket.
   */
  @Effect()
  addBasketToQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddBasketToQuoteRequest),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, currentBasket]) =>
      forkJoin(
        currentBasket.lineItems.map(lineItem =>
          this.quoteRequestService.addProductToQuoteRequest(lineItem.productSKU, lineItem.quantity.value)
        )
      ).pipe(
        map(ids => new quoteRequestActions.AddBasketToQuoteRequestSuccess(ids[0])),
        mapErrorToAction(quoteRequestActions.AddBasketToQuoteRequestFail)
      )
    )
  );

  // TODO: currently updating more than one item at a time is not needed. We could simplify this effect.
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
        mapErrorToAction(quoteRequestActions.UpdateQuoteRequestItemsFail)
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
    concatMap(([payload, quoteRequestId]) =>
      this.quoteRequestService.removeItemFromQuoteRequest(quoteRequestId, payload.itemId).pipe(
        map(id => new quoteRequestActions.DeleteItemFromQuoteRequestSuccess(id)),
        mapErrorToAction(quoteRequestActions.DeleteItemFromQuoteRequestFail)
      )
    )
  );

  /**
   * Call router for navigate to login on AddProductToQuoteRequest if not logged in.
   */
  @Effect({ dispatch: false })
  goToLoginOnAddQuoteRequest$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddProductToQuoteRequest),
    mergeMap(() => this.store.pipe(select(getUserAuthorized))),
    filter(authorized => !authorized),
    tap(() => {
      const queryParams = { returnUrl: this.router.routerState.snapshot.url };
      this.router.navigate(['/login'], { queryParams });
    })
  );

  @Effect({ dispatch: false })
  goToQuoteRequestDetail$ = this.actions$.pipe(
    ofType(quoteRequestActions.QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess),
    map((action: quoteRequestActions.AddBasketToQuoteRequestSuccess) => action.payload),
    tap(quoteRequestId => {
      this.router.navigate([`/account/quote-request/${quoteRequestId}`]);
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
      quoteRequestActions.QuoteRequestActionTypes.SubmitQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.AddProductToQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess,
      quoteRequestActions.QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess,
      quoteRequestActions.QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess,
      QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    filter(() => this.featureToggleService.enabled('quoting')),
    mapTo(new quoteRequestActions.LoadQuoteRequests())
  );

  /**
   * Triggers a SelectQuoteRequest action if route contains quoteRequestId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    map((action: RouteNavigation) => action.payload.params.quoteRequestId),
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
  ).pipe(
    filter(([quoteId]) => !!quoteId),
    map(([quoteId]) => new quoteRequestActions.LoadQuoteRequestItems(quoteId))
  );

  /**
   * Filter for itemId and quantity pairs with actual quantity changes.
   * @param payloadItems          The items of the action payload, containing items to update.
   * @param selectedQuoteRequest  The selected quote request item.
   * @returns                     An array of filtered itemId and quantity pairs.
   */
  filterQuoteRequestsForQuantityChanges(
    payloadItems: { itemId: string; quantity: number }[],
    selectedQuoteRequest: QuoteRequest
  ): { itemId: string; quantity: number }[] {
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
