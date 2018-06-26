import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { UserActionTypes } from '../../../core/store/user';
import { QuoteService } from '../../services/quote/quote.service';
import * as quoteActions from './quote.actions';

@Injectable()
export class QuoteEffects {
  constructor(private actions$: Actions, private quoteService: QuoteService) {}

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
          map(id => new quoteActions.DeleteQuoteSuccess(id)),
          catchError(error => of(new quoteActions.DeleteQuoteFail(error)))
        );
    })
  );

  /**
   * Triggers a LoadQuotes action after successful quote related interaction with the Quote API.
   */
  @Effect()
  loadQuotesAfterChangeSuccess$ = this.actions$.pipe(
    ofType(quoteActions.QuoteActionTypes.DeleteQuoteSuccess, UserActionTypes.LoadCompanyUserSuccess),
    map(() => new quoteActions.LoadQuotes())
  );
}
