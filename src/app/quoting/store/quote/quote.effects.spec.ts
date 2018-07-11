import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../../../core/store/core.state';
import { LoadCompanyUserSuccess, LoginUserSuccess } from '../../../core/store/user';
import { userReducer } from '../../../core/store/user/user.reducer';
import { Customer } from '../../../models/customer/customer.model';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteData } from '../../../models/quote/quote.interface';
import { Quote } from '../../../models/quote/quote.model';
import { User } from '../../../models/user/user.model';
import { FeatureToggleModule } from '../../../shared/feature-toggle.module';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { QuoteService } from '../../services/quote/quote.service';
import { SubmitQuoteRequestSuccess } from '../quote-request';
import { QuotingState } from '../quoting.state';
import { quotingReducers } from '../quoting.system';
import * as quoteActions from './quote.actions';
import { QuoteEffects } from './quote.effects';

describe('Quote Effects', () => {
  let actions$;
  let quoteServiceMock: QuoteService;
  let effects: QuoteEffects;
  let store$: Store<QuotingState | CoreState>;

  beforeEach(() => {
    quoteServiceMock = mock(QuoteService);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
          user: userReducer,
        }),
        FeatureToggleModule.testingFeatures({ quoting: true }),
      ],
      providers: [
        QuoteEffects,
        provideMockActions(() => actions$),
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
      ],
    });

    effects = TestBed.get(QuoteEffects);
    store$ = TestBed.get(Store);

    store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
    store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
  });

  describe('loadQuotes$', () => {
    beforeEach(() => {
      when(quoteServiceMock.getQuotes()).thenCall(() => of([{ id: 'QID' } as Quote]));
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
      const completion = new quoteActions.LoadQuotesSuccess([{ id: 'QID' } as QuoteData]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuotesFail', () => {
      when(quoteServiceMock.getQuotes()).thenCall(() => throwError({ message: 'invalid' } as HttpErrorResponse));

      const action = new quoteActions.LoadQuotes();
      const completion = new quoteActions.LoadQuotesFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });
  });

  describe('deleteQuote$', () => {
    beforeEach(() => {
      when(quoteServiceMock.deleteQuote(anyString())).thenCall(() => of('QID'));
    });

    it('should call the quoteService for deleteQuote with specific quoteId', done => {
      const payload = 'QID';
      const action = new quoteActions.DeleteQuote(payload);
      actions$ = of(action);

      effects.deleteQuote$.subscribe(() => {
        verify(quoteServiceMock.deleteQuote(payload)).once();
        done();
      });
    });

    it('should map to action of type deleteQuoteSuccess', () => {
      const payload = 'QID';
      const action = new quoteActions.DeleteQuote(payload);
      const completion = new quoteActions.DeleteQuoteSuccess(payload);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteFail', () => {
      when(quoteServiceMock.deleteQuote(anyString())).thenCall(() =>
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteActions.DeleteQuote('QID');
      const completion = new quoteActions.DeleteQuoteFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(
        new quoteActions.LoadQuotesSuccess([
          {
            id: 'QID',
            items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
          } as QuoteData,
        ])
      );
      store$.dispatch(new quoteActions.SelectQuote('QID'));

      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenCall(() =>
        of({ type: 'test' } as QuoteLineItemResultModel)
      );
    });

    it('should call the quoteService for createQuoteRequestFromQuote', done => {
      const action = new quoteActions.CreateQuoteRequestFromQuote();
      actions$ = of(action);

      effects.createQuoteRequestFromQuote$.subscribe(() => {
        verify(quoteServiceMock.createQuoteRequestFromQuote(anything())).once();
        done();
      });
    });

    it('should map to action of type CreateQuoteRequestFromQuoteSuccess', () => {
      const action = new quoteActions.CreateQuoteRequestFromQuote();
      const completion = new quoteActions.CreateQuoteRequestFromQuoteSuccess({
        type: 'test',
      } as QuoteLineItemResultModel);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateQuoteRequestFromQuoteFail', () => {
      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenCall(() =>
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteActions.CreateQuoteRequestFromQuote();
      const completion = new quoteActions.CreateQuoteRequestFromQuoteFail({
        message: 'invalid',
      } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });
  });

  describe('loadQuotesAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuotes if DeleteQuoteSuccess action triggered', () => {
      const action = new quoteActions.DeleteQuoteSuccess(anyString());
      const completion = new quoteActions.LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if SubmitQuoteRequestSuccess action triggered', () => {
      const action = new SubmitQuoteRequestSuccess(anyString());
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
