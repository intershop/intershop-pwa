import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jest-marbles';
import { noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Link } from 'ish-core/models/link/link.model';
import { User } from 'ish-core/models/user/user.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { LoadBasketSuccess } from 'ish-core/store/checkout/basket/basket.actions';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoadCompanyUserSuccess, LoginUserSuccess } from 'ish-core/store/user';
import { userReducer } from 'ish-core/store/user/user.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteData } from '../../models/quote/quote.interface';
import { QuoteService } from '../../services/quote/quote.service';
import { SubmitQuoteRequestSuccess } from '../quote-request';
import { quotingReducers } from '../quoting-store.module';

import * as quoteActions from './quote.actions';
import { QuoteEffects } from './quote.effects';

describe('Quote Effects', () => {
  let actions$;
  let quoteServiceMock: QuoteService;
  let basketServiceMock: BasketService;
  let effects: QuoteEffects;
  let store$: Store<{}>;
  let location: Location;

  const customer = { customerNo: 'CID', type: 'SMBCustomer' } as Customer;

  beforeEach(async(() => {
    quoteServiceMock = mock(QuoteService);
    basketServiceMock = mock(BasketService);

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        FeatureToggleModule,
        RouterTestingModule.withRoutes([
          { path: 'account/quotes/request/:quoteRequestId', component: DummyComponent },
          { path: 'basket', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            quoting: combineReducers(quotingReducers),
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
            user: userReducer,
            configuration: configurationReducer,
          },
        }),
      ],
      providers: [
        QuoteEffects,
        provideMockActions(() => actions$),
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
      ],
    });

    effects = TestBed.get(QuoteEffects);
    store$ = TestBed.get(Store);
    location = TestBed.get(Location);

    store$.dispatch(new ApplyConfiguration({ features: ['quoting'] }));
    store$.dispatch(new LoginUserSuccess({ customer }));
    store$.dispatch(new LoadCompanyUserSuccess({ user: { email: 'test' } as User }));
  }));

  describe('loadQuotes$', () => {
    beforeEach(() => {
      when(quoteServiceMock.getQuotes()).thenReturn(of([{ id: 'QID' } as QuoteData]));
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
      const completion = new quoteActions.LoadQuotesSuccess({ quotes: [{ id: 'QID' } as QuoteData] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuotesFail', () => {
      when(quoteServiceMock.getQuotes()).thenReturn(throwError({ message: 'invalid' }));

      const action = new quoteActions.LoadQuotes();
      const completion = new quoteActions.LoadQuotesFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });
  });

  describe('deleteQuote$', () => {
    beforeEach(() => {
      when(quoteServiceMock.deleteQuote(anyString())).thenReturn(of('QID'));
    });

    it('should call the quoteService for deleteQuote with specific quoteId', done => {
      const id = 'QID';
      const action = new quoteActions.DeleteQuote({ id });
      actions$ = of(action);

      effects.deleteQuote$.subscribe(() => {
        verify(quoteServiceMock.deleteQuote(id)).once();
        done();
      });
    });

    it('should map to action of type DeleteQuoteSuccess', () => {
      const id = 'QID';
      const action = new quoteActions.DeleteQuote({ id });
      const completion = new quoteActions.DeleteQuoteSuccess({ id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteFail', () => {
      when(quoteServiceMock.deleteQuote(anyString())).thenReturn(throwError({ message: 'invalid' }));

      const action = new quoteActions.DeleteQuote({ id: 'QID' });
      const completion = new quoteActions.DeleteQuoteFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });
  });

  describe('rejectQuote$', () => {
    beforeEach(() => {
      store$.dispatch(
        new quoteActions.LoadQuotesSuccess({
          quotes: [
            {
              id: 'QID',
              items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
            } as QuoteData,
          ],
        })
      );
      store$.dispatch(new quoteActions.SelectQuote({ id: 'QID' }));

      when(quoteServiceMock.rejectQuote(anyString())).thenCall(() => of('QID'));
    });

    it('should call the quoteService for rejectQuote', done => {
      const action = new quoteActions.RejectQuote();
      actions$ = of(action);

      effects.rejectQuote$.subscribe(() => {
        verify(quoteServiceMock.rejectQuote('QID')).once();
        done();
      });
    });

    it('should map to action of type RejectQuoteSuccess', () => {
      const action = new quoteActions.RejectQuote();
      const completion = new quoteActions.RejectQuoteSuccess({ id: 'QID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.rejectQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type RejectQuoteFail', () => {
      when(quoteServiceMock.rejectQuote(anyString())).thenCall(() => throwError({ message: 'invalid' }));

      const action = new quoteActions.RejectQuote();
      const completion = new quoteActions.RejectQuoteFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.rejectQuote$).toBeObservable(expected$);
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      store$.dispatch(new LoadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        new quoteActions.LoadQuotesSuccess({
          quotes: [
            {
              id: 'QID',
              items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
            } as QuoteData,
          ],
        })
      );
      store$.dispatch(new quoteActions.SelectQuote({ id: 'QID' }));

      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(
        of({ type: 'test' } as QuoteLineItemResult)
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
        quoteLineItemRequest: {
          type: 'test',
        } as QuoteLineItemResult,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateQuoteRequestFromQuoteFail', () => {
      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(throwError({ message: 'invalid' }));

      const action = new quoteActions.CreateQuoteRequestFromQuote();
      const completion = new quoteActions.CreateQuoteRequestFromQuoteFail({
        error: {
          message: 'invalid',
        } as HttpError,
      });
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

    it('should map to action of type LoadQuotes if RejectQuoteSuccess action triggered', () => {
      const action = new quoteActions.RejectQuoteSuccess(anyString());
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
      const action = new LoadCompanyUserSuccess({ user: {} as User });
      const completion = new quoteActions.LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('addQuoteToBasket$', () => {
    it('should call the basketService for addQuoteToBasket', done => {
      when(quoteServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));
      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = new quoteActions.AddQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.addQuoteToBasket$.subscribe(() => {
        verify(quoteServiceMock.addQuoteToBasket(quoteId, 'BID')).once();
        done();
      });
    });

    it('should call the basketService for createBasket if no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const quoteId = 'quoteId';
      const action = new quoteActions.AddQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.getBasketBeforeAddQuoteToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        done();
      });
    });

    it('should map to action of type AddQuoteToBasketSuccess', () => {
      when(quoteServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = new quoteActions.AddQuoteToBasket({ quoteId });
      const completion = new quoteActions.AddQuoteToBasketSuccess({ link: {} as Link });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteToBasketFail', () => {
      when(quoteServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = new quoteActions.AddQuoteToBasket({ quoteId });
      const completion = new quoteActions.AddQuoteToBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });
  });

  describe('gotoBasketAfterAddQuoteToBasketSuccess$', () => {
    it('should navigate to basket when success', fakeAsync(() => {
      const action = new quoteActions.AddQuoteToBasketSuccess({ link: {} as Link });
      actions$ = of(action);
      effects.gotoBasketAfterAddQuoteToBasketSuccess$.subscribe(noop, fail, noop);
      tick(1000);
      expect(location.path()).toBe('/basket');
    }));
  });
});
