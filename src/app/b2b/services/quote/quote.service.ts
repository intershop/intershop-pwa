import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { ApiService, resolveLinks, unpackEnvelope } from '../../../core/services/api/api.service';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInCustomer, getLoggedInUser } from '../../../core/store/user';
import { Quote } from '../../../models/quote/quote.model';

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
}
