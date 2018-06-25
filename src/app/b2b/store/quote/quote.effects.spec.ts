import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Params, Router, RouterState } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../../../core/store/core.state';
import { LoadCompanyUserSuccess, LoginUserSuccess } from '../../../core/store/user';
import { userReducer } from '../../../core/store/user/user.reducer';
import { Customer } from '../../../models/customer/customer.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { User } from '../../../models/user/user.model';
import { LoadProduct } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { QuoteService } from '../../services/quote/quote.service';
import { B2bState } from '../b2b.state';
import { b2bReducers } from '../b2b.system';
import * as quoteActions from './quote.actions';
import { QuoteEffects } from './quote.effects';

describe('Quote Effects', () => {
  let actions$;
  let quoteServiceMock: QuoteService;
  let routerMock: Router;
  let effects: QuoteEffects;
  let store$: Store<B2bState | CoreState>;

  const quoteRequests = [
    {
      id: 'test',
    },
    {
      id: 'test2',
      editable: true,
      items: [
        {
          id: 'test',
          quantity: {
            value: 1,
          },
        },
      ],
    },
  ] as QuoteRequest[];
  const quoteRequestsWithLinkItem = [
    {
      id: 'test',
      editable: true,
      items: [
        {
          title: 'test',
        },
      ],
    },
  ] as QuoteRequest[];
  const quotes = [
    {
      id: 'test',
    },
  ] as Quote[];
  const quoteRequestItems = [
    {
      productSKU: 'test',
    },
  ] as QuoteRequestItem[];
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
    routerMock = mock(Router);

    invalid = false;

    when(quoteServiceMock.getQuoteRequests()).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quoteRequests);
      }
    });

    when(quoteServiceMock.getQuotes()).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quotes);
      }
    });

    when(quoteServiceMock.addQuoteRequest()).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of('test');
      }
    });

    when(quoteServiceMock.updateQuoteRequest(anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(null);
      }
    });

    when(quoteServiceMock.deleteQuoteRequest(anyString())).thenCall(quoteRequest => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quoteRequest.id);
      }
    });

    when(quoteServiceMock.deleteQuote(anyString())).thenCall(quote => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quote.id);
      }
    });

    when(quoteServiceMock.getQuoteRequestItem(anyString(), anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quoteRequestItems[0]);
      }
    });

    when(quoteServiceMock.addProductToQuoteRequest(anyString(), anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(null);
      }
    });

    when(quoteServiceMock.updateQuoteRequestItem(anyString(), anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(null);
      }
    });

    when(quoteServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(null);
      }
    });

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          b2b: combineReducers(b2bReducers),
          shopping: combineReducers(shoppingReducers),
          user: userReducer,
        }),
      ],
      providers: [
        QuoteEffects,
        provideMockActions(() => actions$),
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
      ],
    });

    effects = TestBed.get(QuoteEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadQuoteRequests$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for getQuoteRequests', done => {
      const action = new quoteActions.LoadQuoteRequests();
      actions$ = of(action);

      effects.loadQuoteRequests$.subscribe(() => {
        verify(quoteServiceMock.getQuoteRequests()).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestsSuccess', () => {
      const action = new quoteActions.LoadQuoteRequests();
      const completion = new quoteActions.LoadQuoteRequestsSuccess(quoteRequests);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestsFail', () => {
      invalid = true;
      const action = new quoteActions.LoadQuoteRequests();
      const completion = new quoteActions.LoadQuoteRequestsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });
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

  describe('addQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for addQuoteRequest', done => {
      const action = new quoteActions.AddQuoteRequest();
      actions$ = of(action);

      effects.addQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.addQuoteRequest()).once();
        done();
      });
    });

    it('should map to action of type AddQuoteRequestSuccess', () => {
      const action = new quoteActions.AddQuoteRequest();
      const completion = new quoteActions.AddQuoteRequestSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteRequestFail', () => {
      invalid = true;
      const action = new quoteActions.AddQuoteRequest();
      const completion = new quoteActions.AddQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteActions.LoadQuoteRequestsSuccess(quoteRequests));
    });

    it('should call the quoteService for updateQuoteRequest', done => {
      const payload = {
        id: 'test',
      } as Quote;
      const action = new quoteActions.UpdateQuoteRequest(payload);
      actions$ = of(action);

      effects.updateQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.updateQuoteRequest(payload)).once();
        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestSuccess', () => {
      const payload = {
        id: 'test',
      } as Quote;
      const action = new quoteActions.UpdateQuoteRequest(payload);
      const completion = new quoteActions.UpdateQuoteRequestSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestFail', () => {
      invalid = true;
      const payload = {
        id: 'test',
      } as Quote;
      const action = new quoteActions.UpdateQuoteRequest(payload);
      const completion = new quoteActions.UpdateQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('deleteQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for deleteQuoteRequest with specific quoteRequestId', done => {
      const payload = 'test';
      const action = new quoteActions.DeleteQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.deleteQuoteRequest(payload)).once();
        done();
      });
    });

    it('should map to action of type deleteQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new quoteActions.DeleteQuoteRequest(payload);
      const completion = new quoteActions.DeleteQuoteRequestSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteRequestFail', () => {
      invalid = true;
      const payload = 'test';
      const action = new quoteActions.DeleteQuoteRequest(payload);
      const completion = new quoteActions.DeleteQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
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
      const completion = new quoteActions.DeleteQuoteSuccess();
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

  describe('loadQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteActions.LoadQuoteRequestsSuccess(quoteRequestsWithLinkItem));
    });

    it('should call the quoteService for getQuoteRequestItem', done => {
      const payload = 'test';
      const action = new quoteActions.LoadQuoteRequestItems(payload);
      actions$ = of(action);

      effects.loadQuoteRequestItems$.subscribe(() => {
        verify(quoteServiceMock.getQuoteRequestItem('test', 'test')).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestItemsSuccess', () => {
      const payload = 'test';
      const action = new quoteActions.LoadQuoteRequestItems(payload);
      const completion = new quoteActions.LoadQuoteRequestItemsSuccess(quoteRequestItems);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestItemsFail', () => {
      invalid = true;
      const payload = 'test';
      const action = new quoteActions.LoadQuoteRequestItems(payload);
      const completion = new quoteActions.LoadQuoteRequestItemsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForQuoteRequest$', () => {
    it('should trigger LoadProduct actions for line items if LoadQuoteRequestItemsSuccess action triggered', () => {
      const action = new quoteActions.LoadQuoteRequestItemsSuccess(quoteRequestItems);
      const completion = new LoadProduct('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('addProductToQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteActions.LoadQuoteRequestsSuccess(quoteRequests));
    });

    it('should call the quoteService for addProductToQuoteRequest', done => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addProductToQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.addProductToQuoteRequest('test2', anything())).once();
        done();
      });
    });

    it('should call the quoteService for addProductToQuoteRequest with specific quoteRequestId', done => {
      const payload = {
        quoteRequestId: 'test',
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addProductToQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.addProductToQuoteRequest('test', anything())).once();
        done();
      });
    });

    it('should map to action of type AddProductToQuoteRequestSuccess', () => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      const completion = new quoteActions.AddProductToQuoteRequestSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddProductToQuoteRequestFail', () => {
      invalid = true;
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      const completion = new quoteActions.AddProductToQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteActions.LoadQuoteRequestsSuccess([quoteRequests[1]]));
    });

    it('should call the quoteService for updateQuoteRequestItems if quantity > 0', done => {
      const payload = {
        quoteRequestId: 'test2',
        items: [
          {
            itemId: 'test',
            quantity: 2,
          },
        ],
      };
      const action = new quoteActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteServiceMock.updateQuoteRequestItem(payload.quoteRequestId, payload.items[0])).once();
        done();
      });
    });

    it('should not call the quoteService for updateQuoteRequestItems if quantity is identical', done => {
      const payload = {
        quoteRequestId: 'test2',
        items: [
          {
            itemId: 'test',
            quantity: 1,
          },
        ],
      };
      const action = new quoteActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteServiceMock.updateQuoteRequestItem(payload.quoteRequestId, payload.items[0])).never();
        done();
      });
    });

    it('should call the quoteService for removeItemFromQuoteRequest if quantity is 0', done => {
      const payload = {
        quoteRequestId: 'test2',
        items: [
          {
            itemId: 'test',
            quantity: 0,
          },
        ],
      };
      const action = new quoteActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteServiceMock.removeItemFromQuoteRequest(payload.quoteRequestId, payload.items[0].itemId)).once();

        done();
      });
    });

    it('should call the quoteService for updateQuoteRequestItems without quoteRequestId set in payload and if quantity > 0', done => {
      store$.dispatch(new quoteActions.SelectQuote('test2'));

      const payload = {
        items: [
          {
            itemId: 'test',
            quantity: 2,
          },
        ],
      };
      const action = new quoteActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteServiceMock.updateQuoteRequestItem('test2', payload.items[0])).once();
        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestItemsSuccess', () => {
      const payload = {
        quoteRequestId: 'test2',
        items: [
          {
            itemId: 'test',
            quantity: 2,
          },
        ],
      };
      const action = new quoteActions.UpdateQuoteRequestItems(payload);
      const completion = new quoteActions.UpdateQuoteRequestItemsSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestItemsFail', () => {
      invalid = true;
      const payload = {
        quoteRequestId: 'test2',
        items: [
          {
            itemId: 'test',
            quantity: 2,
          },
        ],
      };
      const action = new quoteActions.UpdateQuoteRequestItems(payload);
      const completion = new quoteActions.UpdateQuoteRequestItemsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('deleteItemFromQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteActions.LoadQuoteRequestsSuccess(quoteRequests));
    });

    it('should call the quoteService for removeItemFromQuoteRequest', done => {
      const payload = {
        quoteRequestId: 'test',
        itemId: 'test',
      };
      const action = new quoteActions.DeleteItemFromQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteItemFromQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.removeItemFromQuoteRequest(payload.quoteRequestId, payload.itemId)).once();

        done();
      });
    });

    it('should call the quoteService for removeItemFromQuoteRequest even if quoteRequestId is not set in payload', done => {
      store$.dispatch(new quoteActions.SelectQuote('test2'));

      const payload = {
        itemId: 'test',
      };
      const action = new quoteActions.DeleteItemFromQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteItemFromQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.removeItemFromQuoteRequest('test2', payload.itemId)).once();

        done();
      });
    });

    it('should map to action of type DeleteItemFromQuoteRequestSuccess', () => {
      const payload = {
        quoteRequestId: 'test',
        itemId: 'test',
      };
      const action = new quoteActions.DeleteItemFromQuoteRequest(payload);
      const completion = new quoteActions.DeleteItemFromQuoteRequestSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteItemFromQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteItemFromQuoteRequestFail', () => {
      invalid = true;
      const payload = {
        quoteRequestId: 'test',
        itemId: 'test',
      };
      const action = new quoteActions.DeleteItemFromQuoteRequest(payload);
      const completion = new quoteActions.DeleteItemFromQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteItemFromQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('addQuoteRequestBeforeAddProductToQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for addQuoteRequest', done => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addQuoteRequestBeforeAddProductToQuoteRequest$.subscribe(() => {
        verify(quoteServiceMock.addQuoteRequest()).once();
        done();
      });
    });

    it('should map to action of type AddProductToQuoteRequest', () => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      const completion = new quoteActions.AddProductToQuoteRequest({ quoteRequestId: 'test', ...payload });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequestBeforeAddProductToQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('goToLoginOnAddQuoteRequest$', () => {
    it('should navigate to /login with returnUrl set if AddQuoteRequest called without propper login.', done => {
      when(routerMock.routerState).thenReturn({
        snapshot: {
          root: {
            queryParams: {
              returnUrl: '/foobar',
            } as Params,
          },
        },
      } as RouterState);

      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.goToLoginOnAddQuoteRequest$.subscribe(() => {
        verify(routerMock.navigate(anything(), anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/login']);
        done();
      });
    });
  });

  describe('loadQuoteRequestsAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuoteRequests if AddQuoteRequestSuccess action triggered', () => {
      const action = new quoteActions.AddQuoteRequestSuccess();
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestSuccess action triggered', () => {
      const action = new quoteActions.UpdateQuoteRequestSuccess();
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteQuoteRequestSuccess action triggered', () => {
      const action = new quoteActions.DeleteQuoteRequestSuccess();
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if AddProductToQuoteRequestSuccess action triggered', () => {
      const action = new quoteActions.AddProductToQuoteRequestSuccess();
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestItemsSuccess action triggered', () => {
      const action = new quoteActions.UpdateQuoteRequestItemsSuccess();
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteItemFromQuoteRequestSuccess action triggered', () => {
      const action = new quoteActions.DeleteItemFromQuoteRequestSuccess();
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if LoadCompanyUserSuccess action triggered', () => {
      const action = new LoadCompanyUserSuccess({} as User);
      const completion = new quoteActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('loadQuotesAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuotes if DeleteQuoteSuccess action triggered', () => {
      const action = new quoteActions.DeleteQuoteSuccess();
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

  describe('routeListenerForSelectingQuote$', () => {
    it('should fire SelectQuote when route /quote/XXX is navigated', () => {
      const action = new RouteNavigation({
        path: 'quote/:quoteId',
        params: { quoteId: 'test' },
        queryParams: {},
      });
      const expected = new quoteActions.SelectQuote('test');

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingQuote$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not fire SelectQuote when route /something is navigated', () => {
      const action = new RouteNavigation({ path: 'something', params: {}, queryParams: {} });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingQuote$).toBeObservable(cold('-'));
    });
  });

  describe('loadQuoteRequestItemsAfterSelectQuote', () => {
    it('should fire LoadQuoteRequestItems when SelectQuote and LoadQuoteRequestsSuccess action triggered.', () => {
      const selectQuoteAction = new quoteActions.SelectQuote('test');
      const loadQuoteRequestSuccessAction = new quoteActions.LoadQuoteRequestsSuccess([]);
      const expected = new quoteActions.LoadQuoteRequestItems('test');

      actions$ = hot('a--b--a', { a: selectQuoteAction, b: loadQuoteRequestSuccessAction });
      expect(effects.loadQuoteRequestItemsAfterSelectQuote$).toBeObservable(cold('---a--a', { a: expected }));
    });
  });
});
