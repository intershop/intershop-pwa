import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, concat, forkJoin } from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  filter,
  first,
  last,
  map,
  mapTo,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { SuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { SetBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { UserActionTypes, getUserAuthorized } from 'ish-core/store/customer/user';
import { LoadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  whenFalsy,
  whenTruthy,
} from 'ish-core/utils/operators';

import { QuoteRequest } from '../../models/quote-request/quote-request.model';
import { QuoteRequestService } from '../../services/quote-request/quote-request.service';
import { QuoteActionTypes } from '../quote/quote.actions';

import {
  AddBasketToQuoteRequestFail,
  AddBasketToQuoteRequestSuccess,
  AddProductToQuoteRequest,
  AddProductToQuoteRequestFail,
  AddProductToQuoteRequestSuccess,
  AddQuoteRequestFail,
  AddQuoteRequestSuccess,
  CreateQuoteRequestFromQuoteRequest,
  CreateQuoteRequestFromQuoteRequestFail,
  CreateQuoteRequestFromQuoteRequestSuccess,
  DeleteItemFromQuoteRequest,
  DeleteItemFromQuoteRequestFail,
  DeleteItemFromQuoteRequestSuccess,
  DeleteQuoteRequest,
  DeleteQuoteRequestFail,
  DeleteQuoteRequestSuccess,
  LoadQuoteRequestItems,
  LoadQuoteRequestItemsFail,
  LoadQuoteRequestItemsSuccess,
  LoadQuoteRequests,
  LoadQuoteRequestsFail,
  LoadQuoteRequestsSuccess,
  QuoteRequestActionTypes,
  SelectQuoteRequest,
  SubmitQuoteRequestFail,
  SubmitQuoteRequestSuccess,
  UpdateQuoteRequest,
  UpdateQuoteRequestFail,
  UpdateQuoteRequestItems,
  UpdateQuoteRequestItemsFail,
  UpdateQuoteRequestItemsSuccess,
  UpdateQuoteRequestSuccess,
} from './quote-request.actions';
import {
  getCurrentQuoteRequests,
  getSelectedQuoteRequest,
  getSelectedQuoteRequestId,
  getSelectedQuoteRequestWithProducts,
} from './quote-request.selectors';

@Injectable()
export class QuoteRequestEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteRequestService: QuoteRequestService,
    private router: Router,
    private store: Store,
    private translateService: TranslateService
  ) {}

  /**
   * The load quote requests effect.
   */
  @Effect()
  loadQuoteRequests$ = this.actions$.pipe(
    ofType(QuoteRequestActionTypes.LoadQuoteRequests),
    concatMap(() =>
      this.quoteRequestService.getQuoteRequests().pipe(
        map(quoteRequests => new LoadQuoteRequestsSuccess({ quoteRequests })),
        mapErrorToAction(LoadQuoteRequestsFail)
      )
    )
  );

  /**
   * Add quote request to a specific user of a specific customer.
   */
  @Effect()
  addQuoteRequest$ = this.actions$.pipe(
    ofType(QuoteRequestActionTypes.AddQuoteRequest),
    concatMap(() =>
      this.quoteRequestService.addQuoteRequest().pipe(
        map(id => new AddQuoteRequestSuccess({ id })),
        mapErrorToAction(AddQuoteRequestFail)
      )
    )
  );

  /**
   * Update specific quote request for a specific user of a specific customer.
   */
  @Effect()
  updateQuoteRequest$ = this.actions$.pipe(
    ofType<UpdateQuoteRequest>(QuoteRequestActionTypes.UpdateQuoteRequest),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([payload, quoteRequestId]) =>
      this.quoteRequestService.updateQuoteRequest(quoteRequestId, payload).pipe(
        map(quoteRequest => new UpdateQuoteRequestSuccess({ quoteRequest })),
        mapErrorToAction(UpdateQuoteRequestFail)
      )
    )
  );

  /**
   * Delete quote request from a specific user of a specific customer.
   */
  @Effect()
  deleteQuoteRequest$ = this.actions$.pipe(
    ofType<DeleteQuoteRequest>(QuoteRequestActionTypes.DeleteQuoteRequest),
    mapToPayloadProperty('id'),

    concatMap(quoteRequestId =>
      this.quoteRequestService.deleteQuoteRequest(quoteRequestId).pipe(
        mergeMap(id => [
          new DeleteQuoteRequestSuccess({ id }),
          new SuccessMessage({ message: 'quote.delete.message' }),
        ]),
        mapErrorToAction(DeleteQuoteRequestFail)
      )
    )
  );

  /**
   * Submit quote request from a specific user of a specific customer.
   */
  @Effect()
  submitQuoteRequest$ = this.actions$.pipe(
    ofType(QuoteRequestActionTypes.SubmitQuoteRequest),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([, quoteRequestId]) =>
      this.quoteRequestService.submitQuoteRequest(quoteRequestId).pipe(
        map(id => new SubmitQuoteRequestSuccess({ id })),
        mapErrorToAction(SubmitQuoteRequestFail)
      )
    )
  );

  /**
   * Update quote request before submitting the quote request.
   */
  @Effect()
  updateSubmitQuoteRequest$ = this.actions$.pipe(
    ofType(QuoteRequestActionTypes.UpdateSubmitQuoteRequest),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([payload, quoteRequestId]) =>
      this.quoteRequestService.updateQuoteRequest(quoteRequestId, payload).pipe(
        switchMap(quoteRequest =>
          this.quoteRequestService.submitQuoteRequest(quoteRequest.id).pipe(
            map(id => new SubmitQuoteRequestSuccess({ id })),
            mapErrorToAction(SubmitQuoteRequestFail)
          )
        ),
        mapErrorToAction(UpdateQuoteRequestFail)
      )
    )
  );

  /**
   * Create quote request based on selected, submited quote request from a specific user of a specific customer.
   */
  @Effect()
  createQuoteRequestFromQuoteRequest$ = this.actions$.pipe(
    ofType<CreateQuoteRequestFromQuoteRequest>(QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequest),
    mapToPayloadProperty('redirect'),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestWithProducts))),
    concatMap(([redirect, currentQuoteRequest]) =>
      this.quoteRequestService.createQuoteRequestFromQuoteRequest(currentQuoteRequest).pipe(
        map(quoteLineItemResult => new CreateQuoteRequestFromQuoteRequestSuccess({ quoteLineItemResult })),
        tap(quoteLineItemResult => {
          if (redirect) {
            this.router.navigate([`/account/quotes/request/${quoteLineItemResult.payload.quoteLineItemResult.title}`]);
          }
        }),
        mapErrorToAction(CreateQuoteRequestFromQuoteRequestFail)
      )
    )
  );

  /**
   * The load quote requests items effect.
   */
  @Effect()
  loadQuoteRequestItems$ = this.actions$.pipe(
    ofType<LoadQuoteRequestItems>(QuoteRequestActionTypes.LoadQuoteRequestItems),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store.pipe(select(getCurrentQuoteRequests))),
    map(([quoteId, quoteRequests]) => quoteRequests.filter(item => item.id === quoteId).pop()),
    whenTruthy(),
    mergeMap(quoteRequest =>
      forkJoin(
        // tslint:disable-next-line:no-string-literal
        quoteRequest.items.map(item => this.quoteRequestService.getQuoteRequestItem(quoteRequest.id, item['title']))
      ).pipe(
        defaultIfEmpty([]),
        mergeMap(quoteRequestItems => [
          ...quoteRequestItems.map(
            item => new LoadProductIfNotLoaded({ sku: item.productSKU, level: ProductCompletenessLevel.List })
          ),
          new LoadQuoteRequestItemsSuccess({ quoteRequestItems }),
        ]),
        mapErrorToAction(LoadQuoteRequestItemsFail)
      )
    )
  );

  /**
   * After successfully loading quote request, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  @Effect()
  loadProductsForQuoteRequest$ = this.actions$.pipe(
    ofType<LoadQuoteRequestItemsSuccess>(QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess),
    mapToPayloadProperty('quoteRequestItems'),
    concatMap(lineItems => [
      ...lineItems.map(
        ({ productSKU }) => new LoadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
      ),
    ])
  );

  /**
   * Add an item to the current editable quote request from a specific user of a specific customer.
   */
  @Effect()
  addProductToQuoteRequest$ = this.actions$.pipe(
    ofType<AddProductToQuoteRequest>(QuoteRequestActionTypes.AddProductToQuoteRequest),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getUserAuthorized))),
    filter(([, authorized]) => authorized),
    concatMap(([item]) =>
      this.quoteRequestService.addProductToQuoteRequest(item.sku, item.quantity).pipe(
        map(id => new AddProductToQuoteRequestSuccess({ id })),
        mapErrorToAction(AddProductToQuoteRequestFail)
      )
    )
  );

  /**
   * Trigger an AddProductToQuoteRequest action for each line item thats in the current basket.
   */
  @Effect()
  addBasketToQuoteRequest$ = this.actions$.pipe(
    ofType(QuoteRequestActionTypes.AddBasketToQuoteRequest),
    withLatestFrom(this.store.pipe(select(getCurrentBasket))),
    concatMap(([, currentBasket]) =>
      concat(
        ...currentBasket.lineItems.map(lineItem =>
          this.quoteRequestService.addProductToQuoteRequest(lineItem.productSKU, lineItem.quantity.value)
        )
      ).pipe(
        last(),
        map(id => new AddBasketToQuoteRequestSuccess({ id })),
        mapErrorToAction(AddBasketToQuoteRequestFail)
      )
    )
  );

  /**
   * Update quote request items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   * TODO: currently updating more than one item at a time is not needed. We could simplify this effect.
   */
  @Effect()
  updateQuoteRequestItems$ = this.actions$.pipe(
    ofType<UpdateQuoteRequestItems>(QuoteRequestActionTypes.UpdateQuoteRequestItems),
    mapToPayloadProperty('lineItemUpdates'),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestWithProducts))),
    map(([lineItemUpdates, selectedQuoteRequest]) => ({
      quoteRequestId: selectedQuoteRequest.id,
      updatedItems: this.filterQuoteRequestsForChanges(lineItemUpdates, selectedQuoteRequest),
    })),
    concatMap(payload =>
      forkJoin(
        payload.updatedItems.map(item =>
          item.quantity === 0
            ? this.quoteRequestService.removeItemFromQuoteRequest(payload.quoteRequestId, item.itemId)
            : this.quoteRequestService.updateQuoteRequestItem(payload.quoteRequestId, item)
        )
      ).pipe(
        defaultIfEmpty(),
        map(itemIds => new UpdateQuoteRequestItemsSuccess({ itemIds })),
        mapErrorToAction(UpdateQuoteRequestItemsFail)
      )
    )
  );

  /**
   * Delete item from quote request for a specific user of a specific customer.
   */
  @Effect()
  deleteItemFromQuoteRequest$ = this.actions$.pipe(
    ofType<DeleteItemFromQuoteRequest>(QuoteRequestActionTypes.DeleteItemFromQuoteRequest),
    mapToPayloadProperty('itemId'),
    withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
    concatMap(([payload, quoteRequestId]) =>
      this.quoteRequestService.removeItemFromQuoteRequest(quoteRequestId, payload).pipe(
        map(id => new DeleteItemFromQuoteRequestSuccess({ id })),
        mapErrorToAction(DeleteItemFromQuoteRequestFail)
      )
    )
  );

  /**
   * Call router for navigate to login on AddProductToQuoteRequest if not logged in.
   */
  @Effect({ dispatch: false })
  goToLoginOnAddQuoteRequest$ = this.actions$.pipe(
    ofType(QuoteRequestActionTypes.AddProductToQuoteRequest, QuoteRequestActionTypes.AddBasketToQuoteRequest),
    mergeMap(() => this.store.pipe(select(getUserAuthorized), first())),
    whenFalsy(),
    tap(() => {
      const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'quotes' };
      this.router.navigate(['/login'], { queryParams });
    })
  );

  @Effect({ dispatch: false })
  goToQuoteRequestDetail$ = this.actions$.pipe(
    ofType<AddBasketToQuoteRequestSuccess>(QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess),
    mapToPayloadProperty('id'),
    tap(quoteRequestId => {
      this.router.navigate([`/account/quotes/request/${quoteRequestId}`]);
    })
  );

  /**
   * Triggers a SelectQuoteRequest action for the just created copy after successfully creating a quote request copy.
   */
  @Effect()
  selectQuoteRequestAfterCopy$ = this.actions$.pipe(
    ofType<CreateQuoteRequestFromQuoteRequestSuccess>(
      QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestSuccess
    ),
    mapToPayload(),
    map(payload => new SelectQuoteRequest({ id: payload.quoteLineItemResult.title }))
  );

  /**
   * Triggers a LoadQuoteRequests action after successful quote request related interaction with the Quote API.
   */
  @Effect()
  loadQuoteRequestsAfterChangeSuccess$ = this.actions$.pipe(
    ofType(
      QuoteRequestActionTypes.AddQuoteRequestSuccess,
      QuoteRequestActionTypes.UpdateQuoteRequestSuccess,
      QuoteRequestActionTypes.DeleteQuoteRequestSuccess,
      QuoteRequestActionTypes.SubmitQuoteRequestSuccess,
      QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestSuccess,
      QuoteRequestActionTypes.AddProductToQuoteRequestSuccess,
      QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess,
      QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess,
      QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess,
      QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess,
      UserActionTypes.LoadCompanyUserSuccess
    ),
    filter(() => this.featureToggleService.enabled('quoting')),
    mapTo(new LoadQuoteRequests())
  );

  /**
   * Triggers a SelectQuoteRequest action if route contains quoteRequestId parameter
   */
  @Effect()
  routeListenerForSelectingQuote$ = this.store.pipe(
    select(selectRouteParam('quoteRequestId')),
    distinctCompareWith(this.store.pipe(select(getSelectedQuoteRequestId))),
    map(id => new SelectQuoteRequest({ id }))
  );

  /**
   * Triggers a LoadQuoteRequestItems action if a quote request gets selected and LoadQuoteRequestsSuccess action triggered
   */
  @Effect()
  loadQuoteRequestItemsAfterSelectQuoteRequest$ = combineLatest([
    this.actions$.pipe(
      ofType<SelectQuoteRequest>(QuoteRequestActionTypes.SelectQuoteRequest),
      mapToPayloadProperty('id')
    ),
    this.actions$.pipe(ofType(QuoteRequestActionTypes.LoadQuoteRequestsSuccess)),
  ]).pipe(
    filter(([quoteId]) => !!quoteId),
    map(([quoteId]) => new LoadQuoteRequestItems({ id: quoteId }))
  );

  @Effect()
  loadQuoteRequestsOnLogin$ = this.store.pipe(select(getUserAuthorized), whenTruthy(), mapTo(new LoadQuoteRequests()));

  @Effect()
  setQuoteRequestBreadcrumb$ = this.store.pipe(
    select(getSelectedQuoteRequest),
    whenTruthy(),
    withLatestFrom(this.translateService.get('quote.edit.unsubmitted.quote_request_details.text')),
    map(
      ([quoteRequest, x]) =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quotes' },
            { text: `${x} - ${quoteRequest.displayName}` },
          ],
        })
    )
  );

  /**
   * Filter for itemId and update pairs with actual quantity or sku changes.
   * @param payloadItems          The items of the action payload, containing items to update.
   * @param selectedQuoteRequest  The selected quote request item.
   * @returns                     An array of filtered itemId and quantity pairs.
   */
  filterQuoteRequestsForChanges(
    lineItemUpdates: LineItemUpdate[],
    selectedQuoteRequest: QuoteRequest
  ): LineItemUpdate[] {
    const quoteRequestItems = selectedQuoteRequest.items;

    if (!quoteRequestItems) {
      return [];
    }

    return LineItemUpdateHelper.filterUpdatesByItems(lineItemUpdates, quoteRequestItems as LineItemUpdateHelperItem[]);
  }
}
