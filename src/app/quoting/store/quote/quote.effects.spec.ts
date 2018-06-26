import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../../../core/store/core.state';
import { LoadCompanyUserSuccess, LoginUserSuccess } from '../../../core/store/user';
import { userReducer } from '../../../core/store/user/user.reducer';
import { Customer } from '../../../models/customer/customer.model';
import { Quote } from '../../../models/quote/quote.model';
import { User } from '../../../models/user/user.model';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { QuoteService } from '../../services/quote/quote.service';
import { QuotingState } from '../quoting.state';
import { quotingReducers } from '../quoting.system';
import * as quoteActions from './quote.actions';
import { QuoteEffects } from './quote.effects';

describe('Quote Effects', () => {
  let actions$;
  let quoteServiceMock: QuoteService;
  let effects: QuoteEffects;
  let store$: Store<QuotingState | CoreState>;

  const quotes = [
    {
      id: 'test',
    },
  ] as Quote[];
  const customer = {
    customerNo: 'test',
    type: 'SMBCustomer',
  } as Customer;
  const user = {
    email: 'test',
  } as User;

  let invalid: boolean;

  beforeEach(() => {
    quoteServiceMock = mock(QuoteService);

    invalid = false;

    when(quoteServiceMock.getQuotes()).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quotes);
      }
    });

    when(quoteServiceMock.deleteQuote(anyString())).thenCall(quote => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of('test');
      }
    });

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
          user: userReducer,
        }),
      ],
      providers: [
        QuoteEffects,
        provideMockActions(() => actions$),
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
      ],
    });

    effects = TestBed.get(QuoteEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadQuotes$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for getQuotes', done => {
      const action = new quoteActions.LoadQuotes();
      actions$ = of(action);

      effects.loadQuotes$.subscribe(() => {
        verify(quoteServiceMock.getQuotes()).once();
        done();
      });
    });

    it('should map to action of type LoadQuotesSuccess', () => {
      const action = new quoteActions.LoadQuotes();
      const completion = new quoteActions.LoadQuotesSuccess(quotes);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuotesFail', () => {
      invalid = true;
      const action = new quoteActions.LoadQuotes();
      const completion = new quoteActions.LoadQuotesFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });
  });

  describe('deleteQuote$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for deleteQuote with specific quoteId', done => {
      const payload = 'test';
      const action = new quoteActions.DeleteQuote(payload);
      actions$ = of(action);

      effects.deleteQuote$.subscribe(() => {
        verify(quoteServiceMock.deleteQuote(payload)).once();
        done();
      });
    });

    it('should map to action of type deleteQuoteSuccess', () => {
      const payload = 'test';
      const action = new quoteActions.DeleteQuote(payload);
      const completion = new quoteActions.DeleteQuoteSuccess('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteFail', () => {
      invalid = true;
      const payload = 'test';
      const action = new quoteActions.DeleteQuote(payload);
      const completion = new quoteActions.DeleteQuoteFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });
  });

  describe('loadQuotesAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuotes if DeleteQuoteSuccess action triggered', () => {
      const action = new quoteActions.DeleteQuoteSuccess('test');
      const completion = new quoteActions.LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if LoadCompanyUserSuccess action triggered', () => {
      const action = new LoadCompanyUserSuccess({} as User);
      const completion = new quoteActions.LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });
  });
});
