import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of, throwError } from 'rxjs';
import { concatMap, filter, map, mapTo, shareReplay, take } from 'rxjs/operators';

import { ApiService, resolveLinks, unpackEnvelope } from '../../../core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from '../../../core/store/user';
import { Link } from '../../../models/link/link.model';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItemData } from '../../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequestItemMapper } from '../../../models/quote-request-item/quote-request-item.mapper';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../../models/quote-request/quote-request.interface';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { getActiveQuoteRequest } from '../../store/quote-request';

/**
 * The Quote Request Service handles the interaction with the 'quoteRequest' related REST API.
 */
@Injectable()
export class QuoteRequestService {
  /**
   * Observable containing user and customer information for ReST requests.
   * emits once for every subscription
   */
  private ids$: Observable<{ userId: string; customerId: string }>;

  /**
   * observable contains the current active quoterequest id
   * or adds a new quoterequest when not available.
   */
  private quoteRequest$: Observable<string>;

  constructor(private apiService: ApiService, private store: Store<{}>) {
    this.ids$ = combineLatest(store.pipe(select(getLoggedInUser)), store.pipe(select(getLoggedInCustomer))).pipe(
      take(1),
      concatMap(
        ([user, customer]) =>
          !!user && !!user.email && !!customer && !!customer.customerNo
            ? of({ userId: user.email, customerId: customer.customerNo })
            : throwError({ message: 'not logged in' })
      )
    );

    // rebuild the stream everytime the selected id switches back to undefined
    store
      .pipe(
        select(getActiveQuoteRequest),
        filter(x => !x)
      )
      .subscribe(() => this.buildActiveQuoteRequestStream());

    this.buildActiveQuoteRequestStream();
  }

  /**
   * Get quote requests for the given customerId and userId.
   * @returns The list of quote requests
   */
  getQuoteRequests(): Observable<QuoteRequestData[]> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService.get(`customers/${customerId}/users/${userId}/quoterequests`).pipe(
          unpackEnvelope(),
          resolveLinks<QuoteRequestData>(this.apiService)
        )
      )
    );
  }

  /**
   * Add new quote request for the given customerId and userId.
   * @return The id of the created quote request
   */
  addQuoteRequest(): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .post<Link>(`customers/${customerId}/users/${userId}/quoterequests`)
          .pipe(map(link => link.title))
      )
    );
  }

  /**
   * Update specific quote request for the given customerId and userId.
   * @param id    The id of the quote request to be updated.
   * @param data  The quote request data to be updated
   * @return      The updated quote request
   */
  updateQuoteRequest(id: string, data: { displayName?: string; description?: string }): Observable<QuoteRequestData> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService.put<QuoteRequestData>(`customers/${customerId}/users/${userId}/quoterequests/${id}`, data)
      )
    );
  }

  /**
   * Delete specific quote request for the given customerId and userId.
   * @param quoteRequestId The quote request id.
   * @return               The deleted quote request id.
   */
  deleteQuoteRequest(quoteRequestId: string): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .delete(`customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}`)
          .pipe(mapTo(quoteRequestId))
      )
    );
  }

  /**
   * Submit specific quote request for the given customerId and userId.
   * @param quoteRequestId The quote request id.
   * @return               The submitted quote request id.
   */
  submitQuoteRequest(quoteRequestId: string): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .post(`customers/${customerId}/users/${userId}/quotes`, { quoteRequestID: quoteRequestId })
          .pipe(mapTo(quoteRequestId))
      )
    );
  }

  /**
   * Get a specific line item of a specific quote request for the given customerId and userId.
   * @param quoteRequestId  The quote request id.
   * @param itemId          The line item id.
   * @returns               The list of quote request line items
   */
  getQuoteRequestItem(quoteRequestId: string, itemId: string): Observable<QuoteRequestItem> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .get<QuoteRequestItemData>(
            `customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items/${itemId}`
          )
          // TODO: item id should be returned from api. Please update implementation after api got updated.
          .pipe(map(quoteRequestItemData => QuoteRequestItemMapper.fromData(quoteRequestItemData, itemId)))
      )
    );
  }

  /**
   * Adds item with the given sku and quantity to a specific quote request for the given customerId and userId.
   * @param sku       The SKU of the product that should be added.
   * @param quantity  The quantity of the product that should be added.
   * @returns         The id of the updated quote request
   */
  addProductToQuoteRequest(sku: string, quantity: number): Observable<string> {
    const body = {
      productSKU: sku,
      quantity: {
        value: quantity,
      },
    };

    return combineLatest(this.ids$, this.quoteRequest$).pipe(
      concatMap(([{ userId, customerId }, quoteRequestId]) =>
        this.apiService
          .post(`customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items`, body)
          .pipe(mapTo(quoteRequestId))
      )
    );
  }

  /**
   * Creates a new quote request and sets list of quote request line items from a submitted quote request for the given customerId and userId
   * @param quoteRequest  A quote request containing quote line items
   * @returns             Information about successful and unsuccessful line item adds
   */
  createQuoteRequestFromQuoteRequest(quoteRequest: QuoteRequest): Observable<QuoteLineItemResultModel> {
    if (!quoteRequest.submitted) {
      return throwError({ message: 'createQuoteRequestFromQuoteRequest() called with unsubmitted quote request' });
    }

    const body = {
      elements: quoteRequest.items.map((item: QuoteRequestItem) => ({
        productSKU: item.productSKU,
        quantity: { value: item.quantity.value },
      })),
    };

    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.addQuoteRequest().pipe(
          concatMap(quoteRequestId =>
            this.apiService.put<QuoteLineItemResultModel>(
              `customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items`,
              body
            )
          )
        )
      )
    );
  }

  /**
   * Updated specific item with the given quantity for a specific quote request for the given customerId and userId.
   * @param quoteRequestId  The id of the quote request.
   * @param item            The item id and quantity pair to be updated
   * @returns               The id of the updated quote request
   */
  updateQuoteRequestItem(quoteRequestId: string, item: { itemId: string; quantity: number }): Observable<string> {
    const body = {
      quantity: {
        value: item.quantity,
      },
    };

    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .put(`customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items/${item.itemId}`, body)
          .pipe(mapTo(quoteRequestId))
      )
    );
  }

  /**
   * Remove specific item from a specific quote request for the given customerId and userId.
   * @param quoteRequestId  The id of the quote request.
   * @param itemId          The id of the item that should be deleted.
   * @returns               The id of the updated quote request
   */
  removeItemFromQuoteRequest(quoteRequestId: string, itemId: string): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .delete(`customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items/${itemId}`)
          .pipe(mapTo(quoteRequestId))
      )
    );
  }

  /**
   * Build active quote request stream
   * selects or creates editable quote request
   */
  private buildActiveQuoteRequestStream() {
    this.quoteRequest$ = this.store.pipe(select(getActiveQuoteRequest)).pipe(
      take(1),
      concatMap(quoteRequest => (!!quoteRequest ? of(quoteRequest.id) : this.addQuoteRequest())),
      shareReplay(1)
    );
  }
}
