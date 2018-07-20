import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Params, Router, RouterState } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { LoadBasketItemsSuccess, LoadBasketSuccess } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { checkoutReducers } from '../../../checkout/store/checkout.system';
import { CoreState } from '../../../core/store/core.state';
import { LoadCompanyUserSuccess, LoginUserSuccess } from '../../../core/store/user';
import { userReducer } from '../../../core/store/user/user.reducer';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { Customer } from '../../../models/customer/customer.model';
import { Price } from '../../../models/price/price.model';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../../models/quote-request/quote-request.interface';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { User } from '../../../models/user/user.model';
import { FeatureToggleModule } from '../../../shared/feature-toggle.module';
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
  let store$: Store<QuotingState | CheckoutState | CoreState>;

  beforeEach(() => {
    quoteRequestServiceMock = mock(QuoteRequestService);
    routerMock = mock(Router);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
          checkout: combineReducers(checkoutReducers),
          user: userReducer,
        }),
        FeatureToggleModule.testingFeatures({ quoting: true }),
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
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));

      when(quoteRequestServiceMock.getQuoteRequests()).thenReturn(of([{ id: 'QRID' } as QuoteRequestData]));
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
      const completion = new quoteRequestActions.LoadQuoteRequestsSuccess([{ id: 'QRID' } as QuoteRequestData]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestsFail', () => {
      when(quoteRequestServiceMock.getQuoteRequests()).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteRequestActions.LoadQuoteRequests();
      const completion = new quoteRequestActions.LoadQuoteRequestsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });
  });

  describe('addQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));

      when(quoteRequestServiceMock.addQuoteRequest()).thenReturn(of('QRID'));
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
      const completion = new quoteRequestActions.AddQuoteRequestSuccess('QRID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteRequestFail', () => {
      when(quoteRequestServiceMock.addQuoteRequest()).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteRequestActions.AddQuoteRequest();
      const completion = new quoteRequestActions.AddQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess([{ id: 'QRID' } as QuoteRequestData]));
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('QRID'));

      when(quoteRequestServiceMock.updateQuoteRequest(anyString(), anything())).thenCall((_, quoteRequest) =>
        of(quoteRequest)
      );
    });

    it('should call the quoteService for updateQuoteRequest', done => {
      const payload = {
        displayName: 'test',
      } as QuoteRequest;
      const action = new quoteRequestActions.UpdateQuoteRequest(payload);
      actions$ = of(action);

      effects.updateQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequest('QRID', payload)).once();
        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestSuccess', () => {
      const payload = {
        displayName: 'test',
      } as QuoteRequestData;
      const action = new quoteRequestActions.UpdateQuoteRequest(payload);
      const completion = new quoteRequestActions.UpdateQuoteRequestSuccess(payload);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestFail', () => {
      when(quoteRequestServiceMock.updateQuoteRequest(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const payload = {
        id: 'QRID',
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
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));

      when(quoteRequestServiceMock.deleteQuoteRequest(anyString())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for deleteQuoteRequest with specific quoteRequestId', done => {
      const payload = 'QRID';
      const action = new quoteRequestActions.DeleteQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.deleteQuoteRequest(payload)).once();
        done();
      });
    });

    it('should map to action of type deleteQuoteRequestSuccess', () => {
      const payload = 'QRID';
      const action = new quoteRequestActions.DeleteQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteQuoteRequestSuccess(payload);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteRequestFail', () => {
      when(quoteRequestServiceMock.deleteQuoteRequest(anyString())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const payload = 'QRID';
      const action = new quoteRequestActions.DeleteQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('submitQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('QRID'));

      when(quoteRequestServiceMock.submitQuoteRequest(anyString())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for submitQuoteRequest', done => {
      const action = new quoteRequestActions.SubmitQuoteRequest();
      actions$ = of(action);

      effects.submitQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.submitQuoteRequest('QRID')).once();
        done();
      });
    });

    it('should map to action of type SubmitQuoteRequestSuccess', () => {
      const action = new quoteRequestActions.SubmitQuoteRequest();
      const completion = new quoteRequestActions.SubmitQuoteRequestSuccess('QRID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.submitQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SubmitQuoteRequestFail', () => {
      when(quoteRequestServiceMock.submitQuoteRequest(anyString())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteRequestActions.SubmitQuoteRequest();
      const completion = new quoteRequestActions.SubmitQuoteRequestFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.submitQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestsSuccess([
          {
            id: 'QRID',
            items: [],
            submitted: true,
          } as QuoteRequestData,
        ])
      );
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestItemsSuccess([
          { productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem,
        ])
      );
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('QRID'));

      when(quoteRequestServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(
        of({ type: 'test' } as QuoteLineItemResultModel)
      );
    });

    it('should call the quoteService for createQuoteRequestFromQuote', done => {
      const action = new quoteRequestActions.CreateQuoteRequestFromQuote();
      actions$ = of(action);

      effects.createQuoteRequestFromQuote$.subscribe(() => {
        verify(quoteRequestServiceMock.createQuoteRequestFromQuote(anything())).once();
        done();
      });
    });

    it('should map to action of type CreateQuoteRequestFromQuoteSuccess', () => {
      const action = new quoteRequestActions.CreateQuoteRequestFromQuote();
      const completion = new quoteRequestActions.CreateQuoteRequestFromQuoteSuccess({
        type: 'test',
      } as QuoteLineItemResultModel);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateQuoteRequestFromQuoteFail', () => {
      when(quoteRequestServiceMock.createQuoteRequestFromQuote(anything())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteRequestActions.CreateQuoteRequestFromQuote();
      const completion = new quoteRequestActions.CreateQuoteRequestFromQuoteFail({
        message: 'invalid',
      } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuote$).toBeObservable(expected$);
    });
  });

  describe('loadQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestsSuccess([
          {
            id: 'QRID',
            editable: true,
            items: [{ title: 'IID' }],
          } as QuoteRequestData,
        ])
      );

      when(quoteRequestServiceMock.getQuoteRequestItem(anyString(), anything())).thenReturn(
        of({ productSKU: 'SKU' } as QuoteRequestItem)
      );
    });

    it('should call the quoteService for getQuoteRequestItem', done => {
      const payload = 'QRID';
      const action = new quoteRequestActions.LoadQuoteRequestItems(payload);
      actions$ = of(action);

      effects.loadQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.getQuoteRequestItem('QRID', 'IID')).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestItemsSuccess', () => {
      const payload = 'QRID';
      const action = new quoteRequestActions.LoadQuoteRequestItems(payload);
      const completion = new quoteRequestActions.LoadQuoteRequestItemsSuccess([
        { productSKU: 'SKU' } as QuoteRequestItem,
      ]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestItemsFail', () => {
      when(quoteRequestServiceMock.getQuoteRequestItem(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const payload = 'QRID';
      const action = new quoteRequestActions.LoadQuoteRequestItems(payload);
      const completion = new quoteRequestActions.LoadQuoteRequestItemsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForQuoteRequest$', () => {
    it('should trigger LoadProduct actions for line items if LoadQuoteRequestItemsSuccess action triggered', () => {
      const action = new quoteRequestActions.LoadQuoteRequestItemsSuccess([{ productSKU: 'SKU' } as QuoteRequestItem]);
      const completion = new LoadProduct('SKU');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('addProductToQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestsSuccess([
          {
            id: 'QRID',
            type: 'QuoteRequest',
            displayName: 'DNAME',
            number: 'NUM',
            editable: true,
            creationDate: 1,
            total: {} as Price,
            items: [],
          } as QuoteRequestData,
        ])
      );

      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for addProductToQuoteRequest', done => {
      const payload = {
        sku: 'SKU',
        quantity: 1,
      };
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.addProductToQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addProductToQuoteRequest('SKU', 1)).once();
        done();
      });
    });

    it('should map to action of type AddProductToQuoteRequestSuccess', () => {
      const payload = {
        sku: 'SKU',
        quantity: 1,
      };
      const action = new quoteRequestActions.AddProductToQuoteRequest(payload);
      const completion = new quoteRequestActions.AddProductToQuoteRequestSuccess('QRID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddProductToQuoteRequestFail', () => {
      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const payload = {
        sku: 'SKU',
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

  describe('addBasketToQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestsSuccess([
          {
            id: 'QRID',
            type: 'QuoteRequest',
            displayName: 'DNAME',
            number: 'NUM',
            editable: true,
            creationDate: 1,
            total: {} as Price,
            items: [],
          } as QuoteRequestData,
        ])
      );
      store$.dispatch(
        new LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
          paymentMethod: null,
        } as Basket)
      );
      store$.dispatch(
        new LoadBasketItemsSuccess([
          {
            id: 'BIID',
            name: 'NAME',
            position: 1,
            quantity: { value: 1 },
            productSKU: 'SKU',
          } as BasketItem,
        ])
      );

      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for addProductToQuoteRequest', done => {
      const action = new quoteRequestActions.AddBasketToQuoteRequest();
      actions$ = of(action);

      effects.addBasketToQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addProductToQuoteRequest('SKU', 1)).once();
        done();
      });
    });

    it('should map to action of type AddBasketToQuoteRequestSuccess', () => {
      const action = new quoteRequestActions.AddBasketToQuoteRequest();
      const completion = new quoteRequestActions.AddBasketToQuoteRequestSuccess('QRID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addBasketToQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddBasketToQuoteRequestFail', () => {
      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const action = new quoteRequestActions.AddBasketToQuoteRequest();
      const completion = new quoteRequestActions.AddBasketToQuoteRequestFail({
        message: 'invalid',
      } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addBasketToQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestsSuccess([
          {
            id: 'QRID',
            editable: true,
            items: [],
          } as QuoteRequestData,
        ])
      );
      store$.dispatch(
        new quoteRequestActions.LoadQuoteRequestItemsSuccess([
          {
            id: 'IID',
            quantity: {
              value: 1,
            },
          } as QuoteRequestItem,
        ])
      );
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('QRID'));

      when(quoteRequestServiceMock.updateQuoteRequestItem(anyString(), anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for updateQuoteRequestItems if quantity > 0', done => {
      const payload = [
        {
          itemId: 'IID',
          quantity: 2,
        },
      ];
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem('QRID', payload[0])).once();
        done();
      });
    });

    it('should not call the quoteService for updateQuoteRequestItems if quantity is identical', done => {
      const payload = [
        {
          itemId: 'IID',
          quantity: 1,
        },
      ];
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem('QRID', payload[0])).never();
        done();
      });
    });

    it('should call the quoteService for removeItemFromQuoteRequest if quantity is 0', done => {
      when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenReturn(of('QRID'));

      const payload = [
        {
          itemId: 'IID',
          quantity: 0,
        },
      ];
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.removeItemFromQuoteRequest('QRID', payload[0].itemId)).once();

        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestItemsSuccess', () => {
      const payload = [
        {
          itemId: 'IID',
          quantity: 2,
        },
      ];
      const action = new quoteRequestActions.UpdateQuoteRequestItems(payload);
      const completion = new quoteRequestActions.UpdateQuoteRequestItemsSuccess(['QRID']);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestItemsFail', () => {
      when(quoteRequestServiceMock.updateQuoteRequestItem(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const payload = [
        {
          itemId: 'IID',
          quantity: 2,
        },
      ];
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
      store$.dispatch(new LoginUserSuccess({ customerNo: 'test', type: 'SMBCustomer' } as Customer));
      store$.dispatch(new LoadCompanyUserSuccess({ email: 'test' } as User));
      store$.dispatch(new quoteRequestActions.LoadQuoteRequestsSuccess([{ id: 'QRID' } as QuoteRequestData]));
      store$.dispatch(new quoteRequestActions.SelectQuoteRequest('QRID'));

      when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for removeItemFromQuoteRequest', done => {
      const payload = {
        itemId: 'IID',
      };
      const action = new quoteRequestActions.DeleteItemFromQuoteRequest(payload);
      actions$ = of(action);

      effects.deleteItemFromQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.removeItemFromQuoteRequest('QRID', payload.itemId)).once();

        done();
      });
    });

    it('should map to action of type DeleteItemFromQuoteRequestSuccess', () => {
      const payload = {
        itemId: 'IID',
      };
      const action = new quoteRequestActions.DeleteItemFromQuoteRequest(payload);
      const completion = new quoteRequestActions.DeleteItemFromQuoteRequestSuccess('QRID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteItemFromQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteItemFromQuoteRequestFail', () => {
      when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' } as HttpErrorResponse)
      );

      const payload = {
        itemId: 'IID',
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
        sku: 'SKU',
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

  describe('goToQuoteRequestDetail$', () => {
    it('should navigate to /account/quote-request/QRID if AddBasketToQuoteRequestSuccess called.', done => {
      const payload = 'QRID';
      const action = new quoteRequestActions.AddBasketToQuoteRequestSuccess(payload);
      actions$ = of(action);

      effects.goToQuoteRequestDetail$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/account/quote-request/QRID']);
        done();
      });
    });
  });

  describe('loadQuoteRequestsAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuoteRequests if AddQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.AddQuoteRequestSuccess('QRID');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.UpdateQuoteRequestSuccess({ id: 'QRID' } as QuoteRequestData);
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.DeleteQuoteRequestSuccess('QRID');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if SubmitQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.SubmitQuoteRequestSuccess('QRID');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if CreateQuoteRequestFromQuoteSuccess action triggered', () => {
      const action = new quoteRequestActions.CreateQuoteRequestFromQuoteSuccess({} as QuoteLineItemResultModel);
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if AddProductToQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.AddProductToQuoteRequestSuccess('QRID');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if AddBasketToQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.AddBasketToQuoteRequestSuccess('QRID');
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestItemsSuccess action triggered', () => {
      const action = new quoteRequestActions.UpdateQuoteRequestItemsSuccess(['QRID']);
      const completion = new quoteRequestActions.LoadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteItemFromQuoteRequestSuccess action triggered', () => {
      const action = new quoteRequestActions.DeleteItemFromQuoteRequestSuccess('QRID');
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
    it('should fire SelectQuoteRequest when route /quote-request/XXX is navigated', () => {
      const action = new RouteNavigation({
        path: 'quote-request/:quoteRequestId',
        params: { quoteRequestId: 'QRID' },
        queryParams: {},
      });
      const expected = new quoteRequestActions.SelectQuoteRequest('QRID');

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
      const selectQuoteRequestAction = new quoteRequestActions.SelectQuoteRequest('QRID');
      const loadQuoteRequestSuccessAction = new quoteRequestActions.LoadQuoteRequestsSuccess([]);
      const expected = new quoteRequestActions.LoadQuoteRequestItems('QRID');

      actions$ = hot('a--b--a', { a: selectQuoteRequestAction, b: loadQuoteRequestSuccessAction });
      expect(effects.loadQuoteRequestItemsAfterSelectQuoteRequest$).toBeObservable(cold('---a--a', { a: expected }));
    });
  });
});
