import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { ApiService, resolveLinks, unpackEnvelope } from '../../../core/services/api/api.service';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInCustomer, getLoggedInUser } from '../../../core/store/user';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItemData } from '../../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequestItemMapper } from '../../../models/quote-request-item/quote-request-item.mapper';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteData } from '../../../models/quote/quote.interface';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequestService } from '../quote-request/quote-request.service';

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

  constructor(
    private apiService: ApiService,
    private quoteRequestServie: QuoteRequestService,
    store: Store<CoreState>
  ) {
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
            quotes.map<QuoteData>(quoteData => {
              return {
                ...quoteData,
                items: quoteData.items.map((quoteItemData: QuoteRequestItemData) =>
                  QuoteRequestItemMapper.fromData(quoteItemData, undefined)
                ),
              };
            })
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
        this.apiService.delete(`customers/${customerId}/users/${userId}/quotes/${quoteId}`).pipe(map(() => quoteId))
      )
    );
  }

  /**
   * Creates a new quote request and sets list of quote request line items from a quote for the given customerId and userId
   * @param quote A quote containing quote line items
   * @returns     Information about successful and unsuccessful line item adds
   */
  createQuoteRequestFromQuote(quoteRequest: Quote): Observable<QuoteLineItemResultModel> {
    const body = {
      elements: quoteRequest.items.map((item: QuoteRequestItem) => {
        return { productSKU: item.productSKU, quantity: { value: item.quantity.value } };
      }),
    };

    return this.ids$.pipe(
      concatMap(({ userId, customerId }) =>
        this.quoteRequestServie
          .addQuoteRequest()
          .pipe(
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
}
