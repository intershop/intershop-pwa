import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getUserAuthorized, loadCompanyUserSuccess } from 'ish-core/store/customer/user';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
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
import { createQuoteRequestFromQuoteSuccess } from '../quote/quote.actions';

import {
  addBasketToQuoteRequest,
  addBasketToQuoteRequestFail,
  addBasketToQuoteRequestSuccess,
  addProductToQuoteRequest,
  addProductToQuoteRequestFail,
  addProductToQuoteRequestSuccess,
  addQuoteRequest,
  addQuoteRequestFail,
  addQuoteRequestSuccess,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestFail,
  createQuoteRequestFromQuoteRequestSuccess,
  deleteItemFromQuoteRequest,
  deleteItemFromQuoteRequestFail,
  deleteItemFromQuoteRequestSuccess,
  deleteQuoteRequest,
  deleteQuoteRequestFail,
  deleteQuoteRequestSuccess,
  loadQuoteRequestItems,
  loadQuoteRequestItemsFail,
  loadQuoteRequestItemsSuccess,
  loadQuoteRequests,
  loadQuoteRequestsFail,
  loadQuoteRequestsSuccess,
  selectQuoteRequest,
  submitQuoteRequest,
  submitQuoteRequestFail,
  submitQuoteRequestSuccess,
  updateQuoteRequest,
  updateQuoteRequestFail,
  updateQuoteRequestItems,
  updateQuoteRequestItemsFail,
  updateQuoteRequestItemsSuccess,
  updateQuoteRequestSuccess,
  updateSubmitQuoteRequest,
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
  loadQuoteRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuoteRequests),
      concatMap(() =>
        this.quoteRequestService.getQuoteRequests().pipe(
          map(quoteRequests => loadQuoteRequestsSuccess({ quoteRequests })),
          mapErrorToAction(loadQuoteRequestsFail)
        )
      )
    )
  );

  /**
   * Add quote request to a specific user of a specific customer.
   */
  addQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteRequest),
      concatMap(() =>
        this.quoteRequestService.addQuoteRequest().pipe(
          map(id => addQuoteRequestSuccess({ id })),
          mapErrorToAction(addQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Update specific quote request for a specific user of a specific customer.
   */
  updateQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateQuoteRequest),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
      concatMap(([payload, quoteRequestId]) =>
        this.quoteRequestService.updateQuoteRequest(quoteRequestId, payload).pipe(
          map(quoteRequest => updateQuoteRequestSuccess({ quoteRequest })),
          mapErrorToAction(updateQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Delete quote request from a specific user of a specific customer.
   */
  deleteQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuoteRequest),
      mapToPayloadProperty('id'),

      concatMap(quoteRequestId =>
        this.quoteRequestService.deleteQuoteRequest(quoteRequestId).pipe(
          mergeMap(id => [
            deleteQuoteRequestSuccess({ id }),
            displaySuccessMessage({ message: 'quote.delete.message' }),
          ]),
          mapErrorToAction(deleteQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Submit quote request from a specific user of a specific customer.
   */
  submitQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitQuoteRequest),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
      concatMap(([, quoteRequestId]) =>
        this.quoteRequestService.submitQuoteRequest(quoteRequestId).pipe(
          map(id => submitQuoteRequestSuccess({ id })),
          mapErrorToAction(submitQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Update quote request before submitting the quote request.
   */
  updateSubmitQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSubmitQuoteRequest),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
      concatMap(([payload, quoteRequestId]) =>
        this.quoteRequestService.updateQuoteRequest(quoteRequestId, payload).pipe(
          switchMap(quoteRequest =>
            this.quoteRequestService.submitQuoteRequest(quoteRequest.id).pipe(
              map(id => submitQuoteRequestSuccess({ id })),
              mapErrorToAction(submitQuoteRequestFail)
            )
          ),
          mapErrorToAction(updateQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Create quote request based on selected, submited quote request from a specific user of a specific customer.
   */
  createQuoteRequestFromQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuoteRequest),
      mapToPayloadProperty('redirect'),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestWithProducts))),
      concatMap(([redirect, currentQuoteRequest]) =>
        this.quoteRequestService.createQuoteRequestFromQuoteRequest(currentQuoteRequest).pipe(
          map(quoteLineItemResult => createQuoteRequestFromQuoteRequestSuccess({ quoteLineItemResult })),
          tap(quoteLineItemResult => {
            if (redirect) {
              this.router.navigate([
                `/account/quotes/request/${quoteLineItemResult.payload.quoteLineItemResult.title}`,
              ]);
            }
          }),
          mapErrorToAction(createQuoteRequestFromQuoteRequestFail)
        )
      )
    )
  );

  /**
   * The load quote requests items effect.
   */
  loadQuoteRequestItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuoteRequestItems),
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
            ...quoteRequestItems.map(item =>
              loadProductIfNotLoaded({ sku: item.productSKU, level: ProductCompletenessLevel.List })
            ),
            loadQuoteRequestItemsSuccess({ quoteRequestItems }),
          ]),
          mapErrorToAction(loadQuoteRequestItemsFail)
        )
      )
    )
  );

  /**
   * After successfully loading quote request, trigger a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  loadProductsForQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuoteRequestItemsSuccess),
      mapToPayloadProperty('quoteRequestItems'),
      concatMap(lineItems => [
        ...lineItems.map(({ productSKU }) =>
          loadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
        ),
      ])
    )
  );

  /**
   * Add an item to the current editable quote request from a specific user of a specific customer.
   */
  addProductToQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToQuoteRequest),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      concatMap(([item]) =>
        this.quoteRequestService.addProductToQuoteRequest(item.sku, item.quantity).pipe(
          map(id => addProductToQuoteRequestSuccess({ id })),
          mapErrorToAction(addProductToQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Trigger an AddProductToQuoteRequest action for each line item thats in the current basket.
   */
  addBasketToQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketToQuoteRequest),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([, currentBasket]) =>
        concat(
          ...currentBasket.lineItems.map(lineItem =>
            this.quoteRequestService.addProductToQuoteRequest(lineItem.productSKU, lineItem.quantity.value)
          )
        ).pipe(
          last(),
          map(id => addBasketToQuoteRequestSuccess({ id })),
          mapErrorToAction(addBasketToQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Update quote request items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   * TODO: currently updating more than one item at a time is not needed. We could simplify this effect.
   */
  updateQuoteRequestItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateQuoteRequestItems),
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
          map(itemIds => updateQuoteRequestItemsSuccess({ itemIds })),
          mapErrorToAction(updateQuoteRequestItemsFail)
        )
      )
    )
  );

  /**
   * Delete item from quote request for a specific user of a specific customer.
   */
  deleteItemFromQuoteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteItemFromQuoteRequest),
      mapToPayloadProperty('itemId'),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteRequestId))),
      concatMap(([payload, quoteRequestId]) =>
        this.quoteRequestService.removeItemFromQuoteRequest(quoteRequestId, payload).pipe(
          map(id => deleteItemFromQuoteRequestSuccess({ id })),
          mapErrorToAction(deleteItemFromQuoteRequestFail)
        )
      )
    )
  );

  /**
   * Call router for navigate to login on AddProductToQuoteRequest if not logged in.
   */
  goToLoginOnAddQuoteRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addProductToQuoteRequest, addBasketToQuoteRequest),
        mergeMap(() => this.store.pipe(select(getUserAuthorized), first())),
        whenFalsy(),
        tap(() => {
          const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'quotes' };
          this.router.navigate(['/login'], { queryParams });
        })
      ),
    { dispatch: false }
  );

  goToQuoteRequestDetail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addBasketToQuoteRequestSuccess),
        mapToPayloadProperty('id'),
        tap(quoteRequestId => {
          this.router.navigate([`/account/quotes/request/${quoteRequestId}`]);
        })
      ),
    { dispatch: false }
  );

  /**
   * Triggers a SelectQuoteRequest action for the just created copy after successfully creating a quote request copy.
   */
  selectQuoteRequestAfterCopy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuoteRequestSuccess),
      mapToPayload(),
      map(payload => selectQuoteRequest({ id: payload.quoteLineItemResult.title }))
    )
  );

  /**
   * Triggers a LoadQuoteRequests action after successful quote request related interaction with the Quote API.
   */
  loadQuoteRequestsAfterChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        addQuoteRequestSuccess,
        updateQuoteRequestSuccess,
        deleteQuoteRequestSuccess,
        submitQuoteRequestSuccess,
        createQuoteRequestFromQuoteRequestSuccess,
        addProductToQuoteRequestSuccess,
        addBasketToQuoteRequestSuccess,
        updateQuoteRequestItemsSuccess,
        deleteItemFromQuoteRequestSuccess,
        createQuoteRequestFromQuoteSuccess,
        loadCompanyUserSuccess
      ),
      filter(() => this.featureToggleService.enabled('quoting')),
      mapTo(loadQuoteRequests())
    )
  );

  /**
   * Triggers a SelectQuoteRequest action if route contains quoteRequestId parameter
   */
  routeListenerForSelectingQuote$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('quoteRequestId')),
      distinctCompareWith(this.store.pipe(select(getSelectedQuoteRequestId))),
      map(id => selectQuoteRequest({ id }))
    )
  );

  /**
   * Triggers a LoadQuoteRequestItems action if a quote request gets selected and LoadQuoteRequestsSuccess action triggered
   */
  loadQuoteRequestItemsAfterSelectQuoteRequest$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(selectQuoteRequest), mapToPayloadProperty('id')),
      this.actions$.pipe(ofType(loadQuoteRequestsSuccess)),
    ]).pipe(
      filter(([quoteId]) => !!quoteId),
      map(([quoteId]) => loadQuoteRequestItems({ id: quoteId }))
    )
  );

  loadQuoteRequestsOnLogin$ = createEffect(() =>
    this.store.pipe(select(getUserAuthorized), whenTruthy(), mapTo(loadQuoteRequests()))
  );

  setQuoteRequestBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/account\/.*/),
      select(getSelectedQuoteRequest),
      whenTruthy(),
      withLatestFrom(this.translateService.get('quote.edit.unsubmitted.quote_request_details.text')),
      map(([quoteRequest, x]) =>
        setBreadcrumbData({
          breadcrumbData: [
            { key: 'quote.quotes.link', link: '/account/quotes' },
            { text: `${x} - ${quoteRequest.displayName}` },
          ],
        })
      )
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
