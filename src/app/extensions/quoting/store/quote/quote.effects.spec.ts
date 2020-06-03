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
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Link } from 'ish-core/models/link/link.model';
import { User } from 'ish-core/models/user/user.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { AccountStoreModule } from 'ish-core/store/account/account-store.module';
import { LoadBasketSuccess } from 'ish-core/store/account/basket';
import { LoadCompanyUserSuccess, LoginUserSuccess } from 'ish-core/store/account/user';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteData } from '../../models/quote/quote.interface';
import { QuoteService } from '../../services/quote/quote.service';
import { SubmitQuoteRequestSuccess } from '../quote-request';
import { QuotingStoreModule } from '../quoting-store.module';

import {
  AddQuoteToBasket,
  AddQuoteToBasketFail,
  AddQuoteToBasketSuccess,
  CreateQuoteRequestFromQuote,
  CreateQuoteRequestFromQuoteFail,
  CreateQuoteRequestFromQuoteSuccess,
  DeleteQuote,
  DeleteQuoteFail,
  DeleteQuoteSuccess,
  LoadQuotes,
  LoadQuotesFail,
  LoadQuotesSuccess,
  RejectQuote,
  RejectQuoteFail,
  RejectQuoteSuccess,
  SelectQuote,
} from './quote.actions';
import { QuoteEffects } from './quote.effects';

describe('Quote Effects', () => {
  let actions$;
  let quoteServiceMock: QuoteService;
  let basketServiceMock: BasketService;
  let effects: QuoteEffects;
  let store$: Store;
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
        AccountStoreModule.forTesting('basket'),
        CoreStoreModule.forTesting(),
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

    store$.dispatch(new LoginUserSuccess({ customer }));
    store$.dispatch(new LoadCompanyUserSuccess({ user: { email: 'test' } as User }));
  }));

  describe('loadQuotes$', () => {
    beforeEach(() => {
      when(quoteServiceMock.getQuotes()).thenReturn(of([{ id: 'QID' } as QuoteData]));
    });

    it('should call the quoteService for getQuotes', done => {
      const action = new LoadQuotes();
      actions$ = of(action);

      effects.loadQuotes$.subscribe(() => {
        verify(quoteServiceMock.getQuotes()).once();
        done();
      });
    });

    it('should map to action of type LoadQuotesSuccess', () => {
      const action = new LoadQuotes();
      const completion = new LoadQuotesSuccess({ quotes: [{ id: 'QID' } as QuoteData] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotes$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuotesFail', () => {
      when(quoteServiceMock.getQuotes()).thenReturn(throwError({ message: 'invalid' }));

      const action = new LoadQuotes();
      const completion = new LoadQuotesFail({ error: { message: 'invalid' } as HttpError });
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
      const action = new DeleteQuote({ id });
      actions$ = of(action);

      effects.deleteQuote$.subscribe(() => {
        verify(quoteServiceMock.deleteQuote(id)).once();
        done();
      });
    });

    it('should map to action of type DeleteQuoteSuccess', () => {
      const id = 'QID';
      const action = new DeleteQuote({ id });
      const completion = new DeleteQuoteSuccess({ id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteFail', () => {
      when(quoteServiceMock.deleteQuote(anyString())).thenReturn(throwError({ message: 'invalid' }));

      const action = new DeleteQuote({ id: 'QID' });
      const completion = new DeleteQuoteFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuote$).toBeObservable(expected$);
    });
  });

  describe('rejectQuote$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadQuotesSuccess({
          quotes: [
            {
              id: 'QID',
              items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
            } as QuoteData,
          ],
        })
      );
      store$.dispatch(new SelectQuote({ id: 'QID' }));

      when(quoteServiceMock.rejectQuote(anyString())).thenCall(() => of('QID'));
    });

    it('should call the quoteService for rejectQuote', done => {
      const action = new RejectQuote();
      actions$ = of(action);

      effects.rejectQuote$.subscribe(() => {
        verify(quoteServiceMock.rejectQuote('QID')).once();
        done();
      });
    });

    it('should map to action of type RejectQuoteSuccess', () => {
      const action = new RejectQuote();
      const completion = new RejectQuoteSuccess({ id: 'QID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.rejectQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type RejectQuoteFail', () => {
      when(quoteServiceMock.rejectQuote(anyString())).thenCall(() => throwError({ message: 'invalid' }));

      const action = new RejectQuote();
      const completion = new RejectQuoteFail({ error: { message: 'invalid' } as HttpError });
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
        new LoadQuotesSuccess({
          quotes: [
            {
              id: 'QID',
              items: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
            } as QuoteData,
          ],
        })
      );
      store$.dispatch(new SelectQuote({ id: 'QID' }));

      when(quoteServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(
        of({ type: 'test' } as QuoteLineItemResult)
      );
    });

    it('should call the quoteService for createQuoteRequestFromQuote', done => {
      const action = new CreateQuoteRequestFromQuote();
      actions$ = of(action);

      effects.createQuoteRequestFromQuote$.subscribe(() => {
        verify(quoteServiceMock.createQuoteRequestFromQuote(anything())).once();
        done();
      });
    });

    it('should map to action of type CreateQuoteRequestFromQuoteSuccess', () => {
      const action = new CreateQuoteRequestFromQuote();
      const completion = new CreateQuoteRequestFromQuoteSuccess({
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

      const action = new CreateQuoteRequestFromQuote();
      const completion = new CreateQuoteRequestFromQuoteFail({
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
      const action = new DeleteQuoteSuccess(anyString());
      const completion = new LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if RejectQuoteSuccess action triggered', () => {
      const action = new RejectQuoteSuccess(anyString());
      const completion = new LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if SubmitQuoteRequestSuccess action triggered', () => {
      const action = new SubmitQuoteRequestSuccess(anyString());
      const completion = new LoadQuotes();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuotesAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuotes if LoadCompanyUserSuccess action triggered', () => {
      const action = new LoadCompanyUserSuccess({ user: {} as User });
      const completion = new LoadQuotes();
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
      const action = new AddQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.addQuoteToBasket$.subscribe(() => {
        verify(quoteServiceMock.addQuoteToBasket(quoteId, 'BID')).once();
        done();
      });
    });

    it('should call the basketService for createBasket if no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const quoteId = 'quoteId';
      const action = new AddQuoteToBasket({ quoteId });
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
      const action = new AddQuoteToBasket({ quoteId });
      const completion = new AddQuoteToBasketSuccess({ link: {} as Link });
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
      const action = new AddQuoteToBasket({ quoteId });
      const completion = new AddQuoteToBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });
  });

  describe('gotoBasketAfterAddQuoteToBasketSuccess$', () => {
    it('should navigate to basket when success', fakeAsync(() => {
      const action = new AddQuoteToBasketSuccess({ link: {} as Link });
      actions$ = of(action);
      effects.gotoBasketAfterAddQuoteToBasketSuccess$.subscribe(noop, fail, noop);
      tick(1000);
      expect(location.path()).toBe('/basket');
    }));
  });
});
