import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { ApiService, resolveLinks, unpackEnvelope } from '../../../core/services/api/api.service';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInCustomer, getLoggedInUser } from '../../../core/store/user';
import { Link } from '../../../models/link/link.model';
import { QuoteRequestItemData } from '../../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequestItemMapper } from '../../../models/quote-request-item/quote-request-item.mapper';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';

/**
 * The Quote Service handles the interaction with the 'quote' related REST API.
 */
@Injectable()
export class QuoteService {
  /**
   * Observable containing user and customer information for ReST requests.
   * emits once for every subscription
   */
  private ids$: Observable<{ userId: string; customerId: string }>;

  constructor(private apiService: ApiService, store: Store<CoreState>) {
    this.ids$ = combineLatest(store.pipe(select(getLoggedInUser)), store.pipe(select(getLoggedInCustomer))).pipe(
      take(1),
      concatMap(
        ([user, customer]) =>
          !!user && !!user.email && !!customer && !!customer.customerNo
            ? of({ userId: user.email, customerId: customer.customerNo })
            : throwError({ message: 'not logged in' })
      )
    );
  }

  /**
   * Get quote requests for the given customerId and userId.
   * @returns The list of quote requests
   */
  getQuoteRequests(): Observable<QuoteRequest[]> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .get(`customers/${customerId}/users/${userId}/quoterequests`)
          .pipe(unpackEnvelope(), resolveLinks<QuoteRequest>(this.apiService))
      )
    );
  }

  /**
   * Get quotes for the given customerId and userId.
   * @returns The list of quotes
   */
  getQuotes(): Observable<Quote[]> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .get(`customers/${customerId}/users/${userId}/quotes`)
          .pipe(unpackEnvelope(), resolveLinks<Quote>(this.apiService))
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
   * @param data The quote request data to be updated
   * @return     The updated quote request
   */
  updateQuoteRequest(data: QuoteRequest): Observable<QuoteRequest> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService.put<QuoteRequest>(`customers/${customerId}/users/${userId}/quoterequests/${data.id}`, data)
      )
    );
  }

  /**
   * Delete specific quote request for the given customerId and userId.
   * @param quoteRequestId The quote request id.
   * @return               The deleted quote request id
   */
  deleteQuoteRequest(quoteRequestId: string): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .delete(`customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}`)
          .pipe(map(() => quoteRequestId))
      )
    );
  }

  /**
   * Delete specific quote for the given customerId and userId.
   * @param quoteId The quote id.
   * @return        The deleted quote id
   */
  deleteQuote(quoteId: string): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService.delete(`customers/${customerId}/users/${userId}/quotes/${quoteId}`).pipe(map(() => quoteId))
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
   * @param quoteRequestId  The id of the quote request.
   * @param item            The product SKU and quantity pair to be added to the quote request.
   * @returns               The id of the updated quote request
   */
  addProductToQuoteRequest(quoteRequestId: string, item: { sku: string; quantity: number }): Observable<string> {
    const body = {
      productSKU: item.sku,
      quantity: {
        value: item.quantity,
      },
    };

    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .post(`customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items`, body)
          .pipe(map(() => quoteRequestId))
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
          .pipe(map(() => quoteRequestId))
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
          .pipe(map(() => quoteRequestId))
      )
    );
  }
}
