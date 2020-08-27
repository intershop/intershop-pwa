import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jest-marbles';
import { noop, of, throwError } from 'rxjs';
import { anyString, anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadBasketSuccess } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadCompanyUserSuccess, loginUserSuccess } from 'ish-core/store/customer/user';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';
import { QuoteRequest } from '../../models/quote-request/quote-request.model';
import { QuoteRequestService } from '../../services/quote-request/quote-request.service';
import { QuotingStoreModule } from '../quoting-store.module';

import {
  addBasketToQuoteRequest,
  addBasketToQuoteRequestFail,
  addBasketToQuoteRequestSuccess,
  addProductToQuoteRequest,
  addProductToQuoteRequestFail,
  addProductToQuoteRequestSuccess,
  addQuoteRequest,
  addQuoteRequestFail,
  addQuoteRequestSuccess,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestFail,
  createQuoteRequestFromQuoteRequestSuccess,
  deleteItemFromQuoteRequest,
  deleteItemFromQuoteRequestFail,
  deleteItemFromQuoteRequestSuccess,
  deleteQuoteRequest,
  deleteQuoteRequestFail,
  deleteQuoteRequestSuccess,
  loadQuoteRequestItems,
  loadQuoteRequestItemsFail,
  loadQuoteRequestItemsSuccess,
  loadQuoteRequests,
  loadQuoteRequestsFail,
  loadQuoteRequestsSuccess,
  selectQuoteRequest,
  submitQuoteRequest,
  submitQuoteRequestFail,
  submitQuoteRequestSuccess,
  updateQuoteRequest,
  updateQuoteRequestFail,
  updateQuoteRequestItems,
  updateQuoteRequestItemsFail,
  updateQuoteRequestItemsSuccess,
  updateQuoteRequestSuccess,
  updateSubmitQuoteRequest,
} from './quote-request.actions';
import { QuoteRequestEffects } from './quote-request.effects';

describe('Quote Request Effects', () => {
  let actions$;
  let quoteRequestServiceMock: QuoteRequestService;
  let effects: QuoteRequestEffects;
  let store$: Store;
  let location: Location;
  let router: Router;

  const customer = { customerNo: 'CID', isBusinessCustomer: true } as Customer;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    quoteRequestServiceMock = mock(QuoteRequestService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user', 'basket'),
        FeatureToggleModule.forTesting('quoting'),
        QuotingStoreModule.forTesting('quoteRequest'),
        RouterTestingModule.withRoutes([
          { path: 'account/quotes/request/:quoteRequestId', component: DummyComponent },
          { path: 'login', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('products', 'categories'),
        TranslateModule.forRoot(),
      ],
      providers: [
        QuoteRequestEffects,
        provideMockActions(() => actions$),
        { provide: QuoteRequestService, useFactory: () => instance(quoteRequestServiceMock) },
      ],
    });

    effects = TestBed.inject(QuoteRequestEffects);
    store$ = TestBed.inject(Store);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(store$).toBeTruthy();
  });

  describe('loadQuoteRequests$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));

      when(quoteRequestServiceMock.getQuoteRequests()).thenReturn(of([{ id: 'QRID' } as QuoteRequestData]));
    });

    it('should call the quoteService for getQuoteRequests', done => {
      const action = loadQuoteRequests();
      actions$ = of(action);

      effects.loadQuoteRequests$.subscribe(() => {
        verify(quoteRequestServiceMock.getQuoteRequests()).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestsSuccess', () => {
      const action = loadQuoteRequests();
      const completion = loadQuoteRequestsSuccess({
        quoteRequests: [{ id: 'QRID' } as QuoteRequestData],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestsFail', () => {
      when(quoteRequestServiceMock.getQuoteRequests()).thenReturn(throwError(makeHttpError({ message: 'invalid' })));

      const action = loadQuoteRequests();
      const completion = loadQuoteRequestsFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequests$).toBeObservable(expected$);
    });
  });

  describe('addQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));

      when(quoteRequestServiceMock.addQuoteRequest()).thenReturn(of('QRID'));
    });

    it('should call the quoteService for addQuoteRequest', done => {
      const action = addQuoteRequest();
      actions$ = of(action);

      effects.addQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addQuoteRequest()).once();
        done();
      });
    });

    it('should map to action of type AddQuoteRequestSuccess', () => {
      const action = addQuoteRequest();
      const completion = addQuoteRequestSuccess({ id: 'QRID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteRequestFail', () => {
      when(quoteRequestServiceMock.addQuoteRequest()).thenReturn(throwError(makeHttpError({ message: 'invalid' })));

      const action = addQuoteRequest();
      const completion = addQuoteRequestFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(loadQuoteRequestsSuccess({ quoteRequests: [{ id: 'QRID' } as QuoteRequestData] }));
      store$.dispatch(selectQuoteRequest({ id: 'QRID' }));

      when(quoteRequestServiceMock.updateQuoteRequest(anyString(), anything())).thenCall((_, quoteRequest) =>
        of(quoteRequest)
      );
    });

    it('should call the quoteService for updateQuoteRequest', done => {
      const payload = {
        displayName: 'test',
      } as QuoteRequest;
      const action = updateQuoteRequest(payload);
      actions$ = of(action);

      effects.updateQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequest('QRID', deepEqual(payload))).once();
        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestSuccess', () => {
      const payload = {
        quoteRequest: {
          displayName: 'test',
        } as QuoteRequestData,
      };
      const action = updateQuoteRequest(payload.quoteRequest);
      const completion = updateQuoteRequestSuccess(payload);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestFail', () => {
      when(quoteRequestServiceMock.updateQuoteRequest(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const payload = {
        id: 'QRID',
      } as QuoteRequest;
      const action = updateQuoteRequest(payload);
      const completion = updateQuoteRequestFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('deleteQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));

      when(quoteRequestServiceMock.deleteQuoteRequest(anyString())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for deleteQuoteRequest with specific quoteRequestId', done => {
      const id = 'QRID';
      const action = deleteQuoteRequest({ id });
      actions$ = of(action);

      effects.deleteQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.deleteQuoteRequest(id)).once();
        done();
      });
    });

    it('should map to action of type deleteQuoteRequestSuccess', () => {
      const id = 'QRID';
      const action = deleteQuoteRequest({ id });
      const completion = deleteQuoteRequestSuccess({ id });
      const completion2 = displaySuccessMessage({
        message: 'quote.delete.message',
      });
      actions$ = hot('-a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion, d: completion2 });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteQuoteRequestFail', () => {
      when(quoteRequestServiceMock.deleteQuoteRequest(anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const id = 'QRID';
      const action = deleteQuoteRequest({ id });
      const completion = deleteQuoteRequestFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('submitQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(selectQuoteRequest({ id: 'QRID' }));

      when(quoteRequestServiceMock.submitQuoteRequest(anyString())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for submitQuoteRequest', done => {
      const action = submitQuoteRequest();
      actions$ = of(action);

      effects.submitQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.submitQuoteRequest('QRID')).once();
        done();
      });
    });

    it('should map to action of type SubmitQuoteRequestSuccess', () => {
      const action = submitQuoteRequest();
      const completion = submitQuoteRequestSuccess({ id: 'QRID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.submitQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SubmitQuoteRequestFail', () => {
      when(quoteRequestServiceMock.submitQuoteRequest(anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = submitQuoteRequest();
      const completion = submitQuoteRequestFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.submitQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateSubmitQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(selectQuoteRequest({ id: 'QRID' }));

      when(quoteRequestServiceMock.updateQuoteRequest(anyString(), anything())).thenReturn(
        of({ id: 'QRID' } as QuoteRequestData)
      );
      when(quoteRequestServiceMock.submitQuoteRequest(anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for updateQuoteRequest and for submitQuoteRequest', done => {
      actions$ = of(updateSubmitQuoteRequest({ displayName: 'edited' }));
      effects.updateSubmitQuoteRequest$.subscribe(action => {
        verify(quoteRequestServiceMock.updateQuoteRequest('QRID', deepEqual({ displayName: 'edited' }))).once();
        verify(quoteRequestServiceMock.submitQuoteRequest('QRID')).once();
        expect(action).toMatchInlineSnapshot(`
          [Quote API] Submit Quote Request Success:
            id: "QRID"
        `);
        done();
      });
    });

    it('should call the quoteService for updateQuoteRequest and send an UpdateQuoteRequestFail action on error', done => {
      when(quoteRequestServiceMock.updateQuoteRequest(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'something went wrong' }))
      );

      actions$ = of(updateSubmitQuoteRequest({ displayName: 'edited' }));
      effects.updateSubmitQuoteRequest$.subscribe(action => {
        verify(quoteRequestServiceMock.updateQuoteRequest('QRID', deepEqual({ displayName: 'edited' }))).once();
        expect(action).toMatchInlineSnapshot(`
          [Quote API] Update Quote Request Fail:
            error: {"name":"HttpErrorResponse","message":"something went wrong"}
        `);
        done();
      });
    });

    it('should call the quoteService for updateQuoteRequest and for submitQuoteRequest and send an SubmitQuoteRequestFail action on error', done => {
      when(quoteRequestServiceMock.submitQuoteRequest(anything())).thenReturn(
        throwError(makeHttpError({ message: 'something went wrong' }))
      );

      actions$ = of(updateSubmitQuoteRequest({ displayName: 'edited' }));
      effects.updateSubmitQuoteRequest$.subscribe(action => {
        verify(quoteRequestServiceMock.updateQuoteRequest('QRID', deepEqual({ displayName: 'edited' }))).once();
        verify(quoteRequestServiceMock.submitQuoteRequest('QRID')).once();
        expect(action).toMatchInlineSnapshot(`
          [Quote API] Submit Quote Request Fail:
            error: {"name":"HttpErrorResponse","message":"something went wrong"}
        `);
        done();
      });
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        loadQuoteRequestsSuccess({
          quoteRequests: [
            {
              id: 'QRID',
              items: [],
              submitted: true,
            } as QuoteRequestData,
          ],
        })
      );
      store$.dispatch(
        loadQuoteRequestItemsSuccess({
          quoteRequestItems: [{ productSKU: 'SKU', quantity: { value: 1 } } as QuoteRequestItem],
        })
      );
      store$.dispatch(selectQuoteRequest({ id: 'QRID' }));

      when(quoteRequestServiceMock.createQuoteRequestFromQuoteRequest(anything())).thenReturn(
        of({ type: 'test' } as QuoteLineItemResult)
      );
    });

    it('should call the quoteService for createQuoteRequestFromQuoteRequest', done => {
      const action = createQuoteRequestFromQuoteRequest({});
      actions$ = of(action);

      effects.createQuoteRequestFromQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.createQuoteRequestFromQuoteRequest(anything())).once();
        done();
      });
    });

    it('should map to action of type CreateQuoteRequestFromQuoteRequestSuccess', () => {
      const action = createQuoteRequestFromQuoteRequest({});
      const completion = createQuoteRequestFromQuoteRequestSuccess({
        quoteLineItemResult: {
          type: 'test',
        } as QuoteLineItemResult,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateQuoteRequestFromQuoteRequestFail', () => {
      when(quoteRequestServiceMock.createQuoteRequestFromQuoteRequest(anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = createQuoteRequestFromQuoteRequest({});
      const completion = createQuoteRequestFromQuoteRequestFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createQuoteRequestFromQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('loadQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        loadQuoteRequestsSuccess({
          quoteRequests: [
            {
              id: 'QRID',
              editable: true,
              items: [{ title: 'IID' }],
            } as QuoteRequestData,
          ],
        })
      );

      when(quoteRequestServiceMock.getQuoteRequestItem(anyString(), anything())).thenReturn(
        of({ productSKU: 'SKU' } as QuoteRequestItem)
      );
    });

    it('should call the quoteService for getQuoteRequestItem', done => {
      const id = 'QRID';
      const action = loadQuoteRequestItems({ id });
      actions$ = of(action);

      effects.loadQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.getQuoteRequestItem('QRID', 'IID')).once();
        done();
      });
    });

    it('should map to action of type LoadQuoteRequestItemsSuccess', () => {
      const id = 'QRID';
      const action = loadQuoteRequestItems({ id });

      const completionLoadProductIfNotLoaded = loadProductIfNotLoaded({
        sku: 'SKU',
        level: ProductCompletenessLevel.List,
      });

      const completionLoadQuoteRequestItemsSuccess = loadQuoteRequestItemsSuccess({
        quoteRequestItems: [{ productSKU: 'SKU' } as QuoteRequestItem],
      });

      actions$ = hot('-a----a----a----|', { a: action });
      const expected$ = cold('-(dc)-(dc)-(dc)-|', {
        c: completionLoadQuoteRequestItemsSuccess,
        d: completionLoadProductIfNotLoaded,
      });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadQuoteRequestItemsFail', () => {
      when(quoteRequestServiceMock.getQuoteRequestItem(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const id = 'QRID';
      const action = loadQuoteRequestItems({ id });
      const completion = loadQuoteRequestItemsFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForQuoteRequest$', () => {
    it('should trigger LoadProduct actions for line items if LoadQuoteRequestItemsSuccess action triggered', () => {
      const action = loadQuoteRequestItemsSuccess({
        quoteRequestItems: [{ productSKU: 'SKU' } as QuoteRequestItem],
      });
      const completion = loadProductIfNotLoaded({ sku: 'SKU', level: ProductCompletenessLevel.List });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('addProductToQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        loadQuoteRequestsSuccess({
          quoteRequests: [
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
          ],
        })
      );

      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for addProductToQuoteRequest', done => {
      const payload = {
        sku: 'SKU',
        quantity: 1,
      };
      const action = addProductToQuoteRequest(payload);
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
      const action = addProductToQuoteRequest(payload);
      const completion = addProductToQuoteRequestSuccess({ id: 'QRID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddProductToQuoteRequestFail', () => {
      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const payload = {
        sku: 'SKU',
        quantity: 1,
      };
      const action = addProductToQuoteRequest(payload);
      const completion = addProductToQuoteRequestFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('addBasketToQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        loadQuoteRequestsSuccess({
          quoteRequests: [
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
          ],
        })
      );
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [
              {
                id: 'BIID',
                name: 'NAME',
                position: 1,
                quantity: { value: 1 },
                productSKU: 'SKU',
              } as LineItem,
            ],
            payment: undefined,
          } as Basket,
        })
      );
      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for addProductToQuoteRequest', done => {
      const action = addBasketToQuoteRequest();
      actions$ = of(action);

      effects.addBasketToQuoteRequest$.subscribe(() => {
        verify(quoteRequestServiceMock.addProductToQuoteRequest('SKU', 1)).once();
        done();
      });
    });

    it('should map to action of type AddBasketToQuoteRequestSuccess', () => {
      const action = addBasketToQuoteRequest();
      const completion = addBasketToQuoteRequestSuccess({ id: 'QRID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addBasketToQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddBasketToQuoteRequestFail', () => {
      when(quoteRequestServiceMock.addProductToQuoteRequest(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = addBasketToQuoteRequest();
      const completion = addBasketToQuoteRequestFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addBasketToQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('updateQuoteRequestItems$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(
        loadQuoteRequestsSuccess({
          quoteRequests: [
            {
              id: 'QRID',
              editable: true,
              items: [],
            } as QuoteRequestData,
          ],
        })
      );
      store$.dispatch(
        loadQuoteRequestItemsSuccess({
          quoteRequestItems: [
            {
              id: 'IID',
              quantity: {
                value: 1,
              },
            } as QuoteRequestItem,
          ],
        })
      );
      store$.dispatch(selectQuoteRequest({ id: 'QRID' }));

      when(quoteRequestServiceMock.updateQuoteRequestItem(anyString(), anything())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for updateQuoteRequestItems if quantity > 0', done => {
      const payload = {
        lineItemUpdates: [
          {
            itemId: 'IID',
            quantity: 2,
          },
        ],
      };
      const action = updateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem('QRID', payload.lineItemUpdates[0])).once();
        done();
      });
    });

    it('should not call the quoteService for updateQuoteRequestItems if quantity is identical', done => {
      const payload = {
        lineItemUpdates: [
          {
            itemId: 'IID',
            quantity: 1,
          },
        ],
      };
      const action = updateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.updateQuoteRequestItem('QRID', payload.lineItemUpdates[0])).never();
        done();
      });
    });

    it('should call the quoteService for removeItemFromQuoteRequest if quantity is 0', done => {
      when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenReturn(of('QRID'));

      const payload = {
        lineItemUpdates: [
          {
            itemId: 'IID',
            quantity: 0,
          },
        ],
      };
      const action = updateQuoteRequestItems(payload);
      actions$ = of(action);

      effects.updateQuoteRequestItems$.subscribe(() => {
        verify(quoteRequestServiceMock.removeItemFromQuoteRequest('QRID', 'IID')).once();

        done();
      });
    });

    it('should map to action of type UpdateQuoteRequestItemsSuccess', () => {
      const payload = {
        lineItemUpdates: [
          {
            itemId: 'IID',
            quantity: 2,
          },
        ],
      };
      const action = updateQuoteRequestItems(payload);
      const completion = updateQuoteRequestItemsSuccess({ itemIds: ['QRID'] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequestItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateQuoteRequestItemsFail', () => {
      when(quoteRequestServiceMock.updateQuoteRequestItem(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const payload = {
        lineItemUpdates: [
          {
            itemId: 'IID',
            quantity: 2,
          },
        ],
      };
      const action = updateQuoteRequestItems(payload);
      const completion = updateQuoteRequestItemsFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateQuoteRequestItems$).toBeObservable(expected$);
    });
  });

  describe('deleteItemFromQuoteRequest$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(loadCompanyUserSuccess({ user: { email: 'test' } as User }));
      store$.dispatch(loadQuoteRequestsSuccess({ quoteRequests: [{ id: 'QRID' } as QuoteRequestData] }));
      store$.dispatch(selectQuoteRequest({ id: 'QRID' }));

      when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenReturn(of('QRID'));
    });

    it('should call the quoteService for removeItemFromQuoteRequest', done => {
      const payload = {
        itemId: 'IID',
      };
      const action = deleteItemFromQuoteRequest(payload);
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
      const action = deleteItemFromQuoteRequest(payload);
      const completion = deleteItemFromQuoteRequestSuccess({ id: 'QRID' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteItemFromQuoteRequest$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteItemFromQuoteRequestFail', () => {
      when(quoteRequestServiceMock.removeItemFromQuoteRequest(anyString(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const payload = {
        itemId: 'IID',
      };
      const action = deleteItemFromQuoteRequest(payload);
      const completion = deleteItemFromQuoteRequestFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteItemFromQuoteRequest$).toBeObservable(expected$);
    });
  });

  describe('goToLoginOnAddQuoteRequest$', () => {
    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/foobar');
      tick(500);
      expect(location.path()).toEqual('/foobar');
    }));

    it('should navigate to login with returnUrl set if AddProductToQuoteRequest called without proper login.', fakeAsync(() => {
      const payload = {
        sku: 'SKU',
        quantity: 1,
      };
      const action = addProductToQuoteRequest(payload);
      actions$ = of(action);

      effects.goToLoginOnAddQuoteRequest$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/login?returnUrl=%2Ffoobar&messageKey=quotes');
    }));

    it('should navigate to /login with returnUrl set if AddBasketToQuoteRequest called without proper login.', fakeAsync(() => {
      const action = addBasketToQuoteRequest();
      actions$ = of(action);

      effects.goToLoginOnAddQuoteRequest$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/login?returnUrl=%2Ffoobar&messageKey=quotes');
    }));
  });

  describe('goToQuoteRequestDetail$', () => {
    it('should navigate to /account/quotes/request/QRID if AddBasketToQuoteRequestSuccess called.', fakeAsync(() => {
      const id = 'QRID';
      const action = addBasketToQuoteRequestSuccess({ id });
      actions$ = of(action);

      effects.goToQuoteRequestDetail$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/account/quotes/request/QRID');
    }));
  });

  describe('loadQuoteRequestsAfterChangeSuccess$', () => {
    it('should map to action of type LoadQuoteRequests if AddQuoteRequestSuccess action triggered', () => {
      const action = addQuoteRequestSuccess({ id: 'QRID' });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestSuccess action triggered', () => {
      const action = updateQuoteRequestSuccess({
        quoteRequest: { id: 'QRID' } as QuoteRequestData,
      });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteQuoteRequestSuccess action triggered', () => {
      const action = deleteQuoteRequestSuccess({ id: 'QRID' });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if SubmitQuoteRequestSuccess action triggered', () => {
      const action = submitQuoteRequestSuccess({ id: 'QRID' });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if CreateQuoteRequestFromQuoteSuccess action triggered', () => {
      const action = createQuoteRequestFromQuoteRequestSuccess({
        quoteLineItemResult: {} as QuoteLineItemResult,
      });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if AddProductToQuoteRequestSuccess action triggered', () => {
      const action = addProductToQuoteRequestSuccess({ id: 'QRID' });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if AddBasketToQuoteRequestSuccess action triggered', () => {
      const action = addBasketToQuoteRequestSuccess({ id: 'QRID' });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if UpdateQuoteRequestItemsSuccess action triggered', () => {
      const action = updateQuoteRequestItemsSuccess({ itemIds: ['QRID'] });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if DeleteItemFromQuoteRequestSuccess action triggered', () => {
      const action = deleteItemFromQuoteRequestSuccess({ id: 'QRID' });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });

    it('should map to action of type LoadQuoteRequests if LoadCompanyUserSuccess action triggered', () => {
      const action = loadCompanyUserSuccess({ user: {} as User });
      const completion = loadQuoteRequests();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadQuoteRequestsAfterChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectingQuoteRequest$', () => {
    it('should fire SelectQuoteRequest when route /quote-request/XXX is navigated', done => {
      router.navigateByUrl('/account/quotes/request/QRID');

      effects.routeListenerForSelectingQuote$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Quote] Select QuoteRequest:
            id: "QRID"
        `);
        done();
      });
    });

    it('should not fire SelectQuoteRequest when route /something is navigated', done => {
      router.navigateByUrl('/something');

      effects.routeListenerForSelectingQuote$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });

  describe('loadQuoteRequestItemsAfterSelectQuoteRequest', () => {
    it('should fire LoadQuoteRequestItems when SelectQuoteRequest and LoadQuoteRequestsSuccess action triggered.', () => {
      const selectQuoteRequestAction = selectQuoteRequest({ id: 'QRID' });
      const loadQuoteRequestSuccessAction = loadQuoteRequestsSuccess({ quoteRequests: [] });
      const expected = loadQuoteRequestItems({ id: 'QRID' });

      actions$ = hot('a--b--a', { a: selectQuoteRequestAction, b: loadQuoteRequestSuccessAction });
      expect(effects.loadQuoteRequestItemsAfterSelectQuoteRequest$).toBeObservable(cold('---a--a', { a: expected }));
    });
  });

  describe('loadQuoteRequestsOnLogin', () => {
    it('should fire LoadQuoteRequests if getLoggedInCustomer selector streams true.', done => {
      store$.dispatch(
        loginUserSuccess({
          customer: {} as Customer,
          user: {} as User,
        })
      );

      effects.loadQuoteRequestsOnLogin$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Quote Internal] Load QuoteRequests`);
        done();
      });
    });
  });
});
