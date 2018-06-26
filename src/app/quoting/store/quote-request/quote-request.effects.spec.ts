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
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { User } from '../../../models/user/user.model';
import { LoadProduct } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { QuoteRequestService } from '../../services/quote-request/quote-request.service';
import { QuotingState } from '../quoting.state';
import { quotingReducers } from '../quoting.system';
import * as quoteRequestActions from './quote-request.actions';
import { QuoteRequestEffects } from './quote-request.effects';

describe('Quote Request Effects', () => {
  let actions$;
  let quoteRequestServiceMock: QuoteRequestService;
  let routerMock: Router;
  let effects: QuoteRequestEffects;
  let store$: Store<QuotingState | CoreState>;

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
    quoteRequestServiceMock = mock(QuoteRequestService);
    routerMock = mock(Router);

    invalid = false;

    when(quoteRequestServiceMock.getQuoteRequests()).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quoteRequests);
      }
    });

    when(quoteRequestServiceMock.addQuoteRequest()).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of('test');
      }
    });

    when(quoteRequestServiceMock.updateQuoteRequest(anything())).thenCall(quoteRequest => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quoteRequest);
      }
    });

    when(quoteRequestServiceMock.deleteQuoteRequest(anyString())).thenCall(quoteRequest => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of('test');
      }
    });

    when(quoteRequestServiceMock.getQuoteRequestItem(anyString(), anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(quoteRequestItems[0]);
      }
    });

    when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of('test');
      }
    });

    when(quoteRequestServiceMock.updateQuoteRequestItem(anyString(), anything())).thenCall(() => {
      if (invalid === true) {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of('test');
      }
    });

    when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenCall(() => {
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
        QuoteRequestEffects,
        provideMockActions(() => actions$),
        { provide: QuoteRequestService, useFactory: () => instance(quoteRequestServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
      ],
    });

    effects = TestBed.get(QuoteRequestEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadQuoteRequests$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for getQuoteRequests', done => {
      const action = new quoteRequestActions.LoadQuoteRequests();
      actions$ = of(action);

      effects.loadQuoteRequests$.subscribe(() => {
        verify(quoteRequestServiceMock.getQuoteRequests()).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestsSuccess', () => {
      const action = new quoteRequestActions.LoadQuoteRequests();
      const completion = new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequests);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestsFail', () => {
      invalid = true;
      const action = new quoteRequestActions.LoadQuoteRequests();
      const completion = new quoteRequestActions.LoadQuoteRequestsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });
  });

  describe('addQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should call the quoteService for addQuoteRequest', done => {
      const action = new quoteRequestActions.AddQuoteRequest();
      actions$ = of(action);

      effects.addQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addQuoteRequest()).once();
        done();
      });
    });

    it('should map to action of type AddQuoteRequestSuccess', () => {
      const action = new quoteRequestActions.AddQuoteRequest();
      const completion = new quoteRequestActions.AddQuoteRequestSuccess('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteRequestFail', () => {
      invalid = true;
      const action = new quoteRequestActions.AddQuoteRequest();
      const completion = new quoteRequestActions.AddQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequests));
    });

    it('should call the quoteService for updateQuoteRequest', done => {
      const payload = {
        id: 'test',
      } as QuoteRequest;
      const action = new quoteRequestActions.UpdateQuoteRequest(payload);
      actions$ = of(action);

      effects.updateQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequest(payload)).once();
        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestSuccess', () => {
      const payload = {
        id: 'test',
      } as QuoteRequest;
      const action = new quoteRequestActions.UpdateQuoteRequest(payload);
      const completion = new quoteRequestActions.UpdateQuoteRequestSuccess(payload);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestFail', () => {
      invalid = true;
      const payload = {
        id: 'test',
      } as QuoteRequest;
      const action = new quoteRequestActions.UpdateQuoteRequest(payload);
      const completion = new quoteRequestActions.UpdateQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
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
      const action = new quoteRequestActions.DeleteQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.deleteQuoteRequest(payload)).once();
        done();
      });
    });

    it('should map to action of type deleteQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new quoteRequestActions.DeleteQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteQuoteRequestSuccess('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteRequestFail', () => {
      invalid = true;
      const payload = 'test';
      const action = new quoteRequestActions.DeleteQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('loadQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequestsWithLinkItem));
    });

    it('should call the quoteService for getQuoteRequestItem', done => {
      const payload = 'test';
      const action = new quoteRequestActions.LoadQuoteRequestItems(payload);
      actions$ = of(action);

      effects.loadQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.getQuoteRequestItem('test', 'test')).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestItemsSuccess', () => {
      const payload = 'test';
      const action = new quoteRequestActions.LoadQuoteRequestItems(payload);
      const completion = new quoteRequestActions.LoadQuoteRequestItemsSuccess(quoteRequestItems);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestItemsFail', () => {
      invalid = true;
      const payload = 'test';
      const action = new quoteRequestActions.LoadQuoteRequestItems(payload);
      const completion = new quoteRequestActions.LoadQuoteRequestItemsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForQuoteRequest$', () => {
    it('should trigger LoadProduct actions for line items if LoadQuoteRequestItemsSuccess action triggered', () => {
      const action = new quoteRequestActions.LoadQuoteRequestItemsSuccess(quoteRequestItems);
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
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequests));
    });

    it('should call the quoteService for addProductToQuoteRequest', done => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addProductToQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addProductToQuoteRequest('test2', anything())).once();
        done();
      });
    });

    it('should call the quoteService for addProductToQuoteRequest with specific quoteRequestId', done => {
      const payload = {
        quoteRequestId: 'test',
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addProductToQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addProductToQuoteRequest('test', anything())).once();
        done();
      });
    });

    it('should map to action of type AddProductToQuoteRequestSuccess', () => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      const completion = new quoteRequestActions.AddProductToQuoteRequestSuccess('test');
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
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      const completion = new quoteRequestActions.AddProductToQuoteRequestFail({
        message: 'invalid',
      } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess([quoteRequests[1]]));
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
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem(payload.quoteRequestId, payload.items[0])).once();
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
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem(payload.quoteRequestId, payload.items[0])).never();
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
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(
          quoteRequestServiceMock.removeItemFromQuoteRequest(payload.quoteRequestId, payload.items[0].itemId)
        ).once();

        done();
      });
    });

    it('should call the quoteService for updateQuoteRequestItems without quoteRequestId set in payload and if quantity > 0', done => {
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('test2'));

      const payload = {
        items: [
          {
            itemId: 'test',
            quantity: 2,
          },
        ],
      };
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem('test2', payload.items[0])).once();
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
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      const completion = new quoteRequestActions.UpdateQuoteRequestItemsSuccess(['test']);
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
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      const completion = new quoteRequestActions.UpdateQuoteRequestItemsFail({
        message: 'invalid',
      } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('deleteItemFromQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess(quoteRequests));
    });

    it('should call the quoteService for removeItemFromQuoteRequest', done => {
      const payload = {
        quoteRequestId: 'test',
        itemId: 'test',
      };
      const action = new quoteRequestActions.DeleteItemFromQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteItemFromQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.removeItemFromQuoteRequest(payload.quoteRequestId, payload.itemId)).once();

        done();
      });
    });

    it('should call the quoteService for removeItemFromQuoteRequest even if quoteRequestId is not set in payload', done => {
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('test2'));

      const payload = {
        itemId: 'test',
      };
      const action = new quoteRequestActions.DeleteItemFromQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteItemFromQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.removeItemFromQuoteRequest('test2', payload.itemId)).once();

        done();
      });
    });

    it('should map to action of type DeleteItemFromQuoteRequestSuccess', () => {
      const payload = {
        quoteRequestId: 'test',
        itemId: 'test',
      };
      const action = new quoteRequestActions.DeleteItemFromQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteItemFromQuoteRequestSuccess('test');
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
      const action = new quoteRequestActions.DeleteItemFromQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteItemFromQuoteRequestFail({
        message: 'invalid',
      } as HttpErrorResponse);
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
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addQuoteRequestBeforeAddProductToQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addQuoteRequest()).once();
        done();
      });
    });

    it('should map to action of type AddProductToQuoteRequest', () => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      const completion = new quoteRequestActions.AddProductToQuoteRequest({ quoteRequestId: 'test', ...payload });
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
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
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
      const action = new quoteRequestActions.AddQuoteRequestSuccess('test');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.UpdateQuoteRequestSuccess(quoteRequests[0]);
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.DeleteQuoteRequestSuccess('test');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if AddProductToQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.AddProductToQuoteRequestSuccess('test');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestItemsSuccess action triggered', () => {
      const action = new quoteRequestActions.UpdateQuoteRequestItemsSuccess(['test']);
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteItemFromQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.DeleteItemFromQuoteRequestSuccess('test');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if LoadCompanyUserSuccess action triggered', () => {
      const action = new LoadCompanyUserSuccess({} as User);
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectingQuoteRequest$', () => {
    it('should fire SelectQuoteRequest when route /quote/XXX is navigated', () => {
      const action = new RouteNavigation({
        path: 'quote/:quoteId',
        params: { quoteId: 'test' },
        queryParams: {},
      });
      const expected = new quoteRequestActions.SelectQuoteRequest('test');

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingQuote$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not fire SelectQuoteRequest when route /something is navigated', () => {
      const action = new RouteNavigation({ path: 'something', params: {}, queryParams: {} });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingQuote$).toBeObservable(cold('-'));
    });
  });

  describe('loadQuoteRequestItemsAfterSelectQuoteRequest', () => {
    it('should fire LoadQuoteRequestItems when SelectQuoteRequest and LoadQuoteRequestsSuccess action triggered.', () => {
      const selectQuoteRequestAction = new quoteRequestActions.SelectQuoteRequest('test');
      const loadQuoteRequestSuccessAction = new quoteRequestActions.LoadQuoteRequestsSuccess([]);
      const expected = new quoteRequestActions.LoadQuoteRequestItems('test');

      actions$ = hot('a--b--a', { a: selectQuoteRequestAction, b: loadQuoteRequestSuccessAction });
      expect(effects.loadQuoteRequestItemsAfterSelectQuoteRequest$).toBeObservable(cold('---a--a', { a: expected }));
    });
  });
});
