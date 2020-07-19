import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jest-marbles';
import { noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Link } from 'ish-core/models/link/link.model';
import { User } from 'ish-core/models/user/user.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadBasketSuccess } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadCompanyUserSuccess, loginUserSuccess } from 'ish-core/store/customer/user';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteData } from '../../models/quote/quote.interface';
import { QuoteService } from '../../services/quote/quote.service';
import { submitQuoteRequestSuccess } from '../quote-request';
import { QuotingStoreModule } from '../quoting-store.module';

import {
  addQuoteToBasket,
  addQuoteToBasketFail,
  addQuoteToBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteFail,
  createQuoteRequestFromQuoteSuccess,
  deleteQuote,
  deleteQuoteFail,
  deleteQuoteSuccess,
  loadQuotes,
  loadQuotesFail,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuoteFail,
  rejectQuoteSuccess,
  selectQuote,
} from './quote.actions';
import { QuoteEffects } from './quote.effects';

describe('Quote Effects', () => {
  let actions$;
  let quoteServiceMock: QuoteService;
  let basketServiceMock: BasketService;
  let effects: QuoteEffects;
  let store$: Store;
  let location: Location;

  const customer = { customerNo: 'CID', isBusinessCustomer: true } as Customer;

  beforeEach(async(() => {
    quoteServiceMock = mock(QuoteService);
    basketServiceMock = mock(BasketService);

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('basket'),
        FeatureToggleModule.forTesting('quoting'),
        QuotingStoreModule.forTesting('quote'),
        RouterTestingModule.withRoutes([
          { path: 'account/quotes/request/:quoteRequestId', component: DummyComponent },
          { path: 'basket', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('products'),
        TranslateModule.forRoot(),
      ],
      providers: [
        QuoteEffects,
        provideMockActions(() => actions$),
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
      ],
    });

    effects = TestBed.inject(QuoteEffects);
    store$ = TestBed.inject(Store);
    location = TestBed.inject(Location);

    store$.dispatch(loginUserSuccess({ customer }));
    store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
  }));

  describe('loadQuotes$', () => {
    beforeEach(() => {
      when(quoteServiceMock.getQuotes()).thenReturn(of([{ id: 'QID' } as QuoteData]));
    });

    it('should call the quoteService for getQuotes', done => {
      const action = loadQuotes();
      actions$ = of(action);

      effects.loadQuotes$.subscribe(() => {
        verify(quoteServiceMock.getQuotes()).once();
        done();
      });
    });

    it('should map to action of type LoadQuotesSuccess', () => {
      const action = loadQuotes();
      const completion = loadQuotesSuccess({ quotes: [{ id: 'QID' } as QuoteData] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuotesFail', () => {
      when(quoteServiceMock.getQuotes()).thenReturn(throwError(makeHttpError({ message: 'invalid' })));

      const action = loadQuotes();
      const completion = loadQuotesFail({ error: makeHttpError({ message: 'invalid' }) });
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
      const action = deleteQuote({ id });
      actions$ = of(action);

      effects.deleteQuote$.subscribe(() => {
        verify(quoteServiceMock.deleteQuote(id)).once();
        done();
      });
    });

    it('should map to action of type DeleteQuoteSuccess', () => {
      const id = 'QID';
      const action = deleteQuote({ id });
      const completion = deleteQuoteSuccess({ id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteFail', () => {
      when(quoteServiceMock.deleteQuote(anyString())).thenReturn(throwError(makeHttpError({ message: 'invalid' })));

      const action = deleteQuote({ id: 'QID' });
      const completion = deleteQuoteFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });
  });

  describe('rejectQuote$', () => {
    beforeEach(() => {
      store$.dispatch(
        loadQuotesSuccess({
          quotes: [
            {
              id: 'QID',
              items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
            } as QuoteData,
          ],
        })
      );
      store$.dispatch(selectQuote({ id: 'QID' }));

      when(quoteServiceMock.rejectQuote(anyString())).thenCall(() => of('QID'));
    });

    it('should call the quoteService for rejectQuote', done => {
      const action = rejectQuote();
      actions$ = of(action);

      effects.rejectQuote$.subscribe(() => {
        verify(quoteServiceMock.rejectQuote('QID')).once();
        done();
      });
    });

    it('should map to action of type RejectQuoteSuccess', () => {
      const action = rejectQuote();
      const completion = rejectQuoteSuccess({ id: 'QID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.rejectQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type RejectQuoteFail', () => {
      when(quoteServiceMock.rejectQuote(anyString())).thenCall(() => throwError(makeHttpError({ message: 'invalid' })));

      const action = rejectQuote();
      const completion = rejectQuoteFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.rejectQuote$).toBeObservable(expected$);
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        loadQuotesSuccess({
          quotes: [
            {
              id: 'QID',
              items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
            } as QuoteData,
          ],
        })
      );
      store$.dispatch(selectQuote({ id: 'QID' }));

      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(
        of({ type: 'test' } as QuoteLineItemResult)
      );
    });

    it('should call the quoteService for createQuoteRequestFromQuote', done => {
      const action = createQuoteRequestFromQuote();
      actions$ = of(action);

      effects.createQuoteRequestFromQuote$.subscribe(() => {
        verify(quoteServiceMock.createQuoteRequestFromQuote(anything())).once();
        done();
      });
    });

    it('should map to action of type CreateQuoteRequestFromQuoteSuccess', () => {
      const action = createQuoteRequestFromQuote();
      const completion = createQuoteRequestFromQuoteSuccess({
        quoteLineItemRequest: {
          type: 'test',
        } as QuoteLineItemResult,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateQuoteRequestFromQuoteFail', () => {
      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = createQuoteRequestFromQuote();
      const completion = createQuoteRequestFromQuoteFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });
  });

  describe('loadQuotesAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuotes if DeleteQuoteSuccess action triggered', () => {
      const action = deleteQuoteSuccess(anyString());
      const completion = loadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if RejectQuoteSuccess action triggered', () => {
      const action = rejectQuoteSuccess(anyString());
      const completion = loadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if SubmitQuoteRequestSuccess action triggered', () => {
      const action = submitQuoteRequestSuccess(anyString());
      const completion = loadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if LoadCompanyUserSuccess action triggered', () => {
      const action = loadCompanyUserSuccess({ user: {} as User });
      const completion = loadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('addQuoteToBasket$', () => {
    it('should call the basketService for addQuoteToBasket', done => {
      when(quoteServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = addQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.addQuoteToBasket$.subscribe(() => {
        verify(quoteServiceMock.addQuoteToBasket(quoteId, 'BID')).once();
        done();
      });
    });

    it('should call the basketService for createBasket if no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const quoteId = 'quoteId';
      const action = addQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.getBasketBeforeAddQuoteToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        done();
      });
    });

    it('should map to action of type AddQuoteToBasketSuccess', () => {
      when(quoteServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));

      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = addQuoteToBasket({ quoteId });
      const completion = addQuoteToBasketSuccess({ link: {} as Link });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteToBasketFail', () => {
      when(quoteServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = addQuoteToBasket({ quoteId });
      const completion = addQuoteToBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });
  });

  describe('gotoBasketAfterAddQuoteToBasketSuccess$', () => {
    it('should navigate to basket when success', fakeAsync(() => {
      const action = addQuoteToBasketSuccess({ link: {} as Link });
      actions$ = of(action);
      effects.gotoBasketAfterAddQuoteToBasketSuccess$.subscribe(noop, fail, noop);
      tick(1000);
      expect(location.path()).toBe('/basket');
    }));
  });
});
