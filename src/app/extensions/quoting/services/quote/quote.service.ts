import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of, throwError } from 'rxjs';
import { concatMap, map, mapTo, take } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, resolveLinks, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/account/user';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItemData } from '../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequestItemMapper } from '../../models/quote-request-item/quote-request-item.mapper';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteData } from '../../models/quote/quote.interface';
import { Quote } from '../../models/quote/quote.model';
import { QuoteRequestService } from '../quote-request/quote-request.service';

/**
 * The Quote Service handles the interaction with the 'quote' related REST API.
 */
@Injectable({ providedIn: 'root' })
export class QuoteService {
  /**
   * Observable containing user and customer information for ReST requests.
   * emits once for every subscription
   */
  private ids$: Observable<{ userId: string; customerId: string }>;

  constructor(private apiService: ApiService, private quoteRequestServie: QuoteRequestService, store: Store) {
    this.ids$ = combineLatest([store.pipe(select(getLoggedInUser)), store.pipe(select(getLoggedInCustomer))]).pipe(
      take(1),
      concatMap(([user, customer]) =>
        !!user && !!user.email && !!customer && !!customer.customerNo
          ? of({ userId: user.email, customerId: customer.customerNo })
          : throwError({ message: 'not logged in' })
      )
    );
  }

  /**
   * Get quotes for the given customerId and userId.
   * @returns The list of quotes
   */
  getQuotes(): Observable<QuoteData[]> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService.get(`customers/${customerId}/users/${userId}/quotes`).pipe(
          unpackEnvelope(),
          resolveLinks<QuoteData>(this.apiService),
          map(quotes =>
            quotes.map<QuoteData>(quoteData => ({
              ...quoteData,
              items: quoteData.items.map((quoteItemData: QuoteRequestItemData) =>
                QuoteRequestItemMapper.fromData(quoteItemData, undefined)
              ),
            }))
          )
        )
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
        this.apiService.delete(`customers/${customerId}/users/${userId}/quotes/${quoteId}`).pipe(mapTo(quoteId))
      )
    );
  }

  /**
   * Reject specific quote for the given customerId and userId.
   * @param quoteId The quote id.
   * @return        The rejected quote id
   */
  rejectQuote(quoteId: string): Observable<string> {
    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.apiService
          .put(`customers/${customerId}/users/${userId}/quotes/${quoteId}`, { rejected: true })
          .pipe(map(() => quoteId))
      )
    );
  }

  /**
   * Creates a new quote request and sets list of quote request line items from a quote for the given customerId and userId
   * @param quote A quote containing quote line items
   * @returns     Information about successful and unsuccessful line item adds
   */
  createQuoteRequestFromQuote(quoteRequest: Quote): Observable<QuoteLineItemResult> {
    const body = {
      elements: quoteRequest.items.map((item: QuoteRequestItem) => ({
        productSKU: item.productSKU,
        quantity: { value: item.quantity.value },
      })),
    };

    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.quoteRequestServie
          .addQuoteRequest()
          .pipe(
            concatMap(quoteRequestId =>
              this.apiService
                .put<QuoteLineItemResult>(
                  `customers/${customerId}/users/${userId}/quoterequests/${quoteRequestId}/items`,
                  body
                )
                .pipe(map(quoteLineItemResult => ({ ...quoteLineItemResult, title: quoteRequestId })))
            )
          )
      )
    );
  }

  /**
   * Add quote to basket.
   * @param quoteId   The id of the quote that should be added to basket.
   * @param basketId  The id of the basket which the quote should be added to.
   * @returns         Link to the updated basket items.
   */
  addQuoteToBasket(quoteId: string, basketId: string): Observable<Link> {
    const body = {
      quoteID: quoteId,
    };

    return this.apiService.post(`baskets/${basketId}/items`, body);
  }
}
