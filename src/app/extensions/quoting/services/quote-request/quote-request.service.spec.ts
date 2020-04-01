import { TestBed } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { Link } from 'ish-core/models/link/link.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoadCompanyUserSuccess, LoginUserSuccess, LogoutUser } from 'ish-core/store/user';
import { userReducer } from 'ish-core/store/user/user.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteRequestItemData } from '../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';
import { QuoteRequest } from '../../models/quote-request/quote-request.model';
import { LoadQuoteRequestsSuccess } from '../../store/quote-request';
import { quotingReducers } from '../../store/quoting-store.module';

import { QuoteRequestService } from './quote-request.service';

describe('Quote Request Service', () => {
  let quoteRequestService: QuoteRequestService;
  let apiService: ApiService;
  let store$: Store<{}>;

  const customer = { customerNo: 'CID', type: 'SMBCustomer' } as Customer;
  const user = { email: 'UID' } as User;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.icmServerURL).thenReturn('BASE');

    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            quoting: combineReducers(quotingReducers),
            shopping: combineReducers(shoppingReducers),
            user: userReducer,
          },
        }),
      ],
      providers: [QuoteRequestService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });

    quoteRequestService = TestBed.get(QuoteRequestService);
    store$ = TestBed.get(Store);
  });

  describe('when not logged in', () => {
    it('should throw error for addProductToQuoteRequest', () => {
      expect(quoteRequestService.addProductToQuoteRequest(undefined, undefined)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });

    it('should throw error for createQuoteRequestFromQuote', () => {
      expect(
        quoteRequestService.createQuoteRequestFromQuoteRequest({ submitted: true, items: [] } as QuoteRequest)
      ).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });

    it('should throw error for addQuoteRequest', () => {
      expect(quoteRequestService.addQuoteRequest()).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });

    it('should throw error for deleteQuoteRequest', () => {
      expect(quoteRequestService.deleteQuoteRequest(undefined)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });

    it('should throw error for submitQuoteRequest', () => {
      expect(quoteRequestService.submitQuoteRequest(undefined)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });

    it('should throw error for getQuoteRequestItem', () => {
      expect(quoteRequestService.getQuoteRequestItem(undefined, undefined)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });

    it('should throw error for getQuoteRequests', () => {
      expect(quoteRequestService.getQuoteRequests()).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });

    it('should throw error for removeItemFromQuoteRequest', () => {
      expect(quoteRequestService.removeItemFromQuoteRequest(undefined, undefined)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });

    it('should throw error for updateQuoteRequest', () => {
      expect(quoteRequestService.updateQuoteRequest(undefined, undefined)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });

    it('should throw error for updateQuoteRequestItem', () => {
      expect(
        quoteRequestService.updateQuoteRequestItem(undefined, { itemId: undefined, quantity: undefined })
      ).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });
  });

  describe('completion', () => {
    const expectEmptyArray = data => expect(data).toBeEmpty();

    beforeEach(() => {
      when(apiService.get(anything())).thenReturn(of({ elements: [] }));
      store$.dispatch(new LoginUserSuccess({ customer }));
      store$.dispatch(new LoadCompanyUserSuccess({ user }));
    });

    it('should complete after first successful result', () => {
      const subscription = quoteRequestService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).once();

      store$.dispatch(new LoadCompanyUserSuccess({ user: { ...user, firstName: 'test' } as User }));

      verify(apiService.get(anything())).once();

      expect(subscription.closed).toBeTrue();
    });

    it('should execute for every subscription', () => {
      const subscription1 = quoteRequestService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).once();
      expect(subscription1.closed).toBeTrue();

      const subscription2 = quoteRequestService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).twice();
      expect(subscription2.closed).toBeTrue();

      const subscription3 = quoteRequestService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).thrice();
      expect(subscription3.closed).toBeTrue();

      store$.dispatch(new LogoutUser());

      const subscription4 = quoteRequestService.getQuoteRequests().subscribe(fail);

      verify(apiService.get(anything())).thrice();
      expect(subscription4.closed).toBeTrue();
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer, user }));
      store$.dispatch(new LoadCompanyUserSuccess({ user }));
    });

    it("should get quoteRequests data when 'getQuoteRequests' is called", done => {
      when(apiService.get(`customers/CID/users/UID/quoterequests`)).thenReturn(
        of({
          elements: [{ type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID' }],
        })
      );
      when(apiService.get(`BASE/customers/CID/users/UID/quoterequests/QRID`)).thenReturn(of({ id: 'QRID' }));

      quoteRequestService.getQuoteRequests().subscribe(data => {
        expect(data).toHaveLength(1);
        expect(data[0].id).toEqual('QRID');
        verify(apiService.get(`customers/CID/users/UID/quoterequests`)).once();
        verify(apiService.get(`BASE/customers/CID/users/UID/quoterequests/QRID`)).once();
        done();
      });
    });

    it("should post new quote request when 'addQuoteRequest' is called", done => {
      const link = { title: 'test' } as Link;
      when(apiService.post(`customers/CID/users/UID/quoterequests`)).thenReturn(of(link));

      quoteRequestService.addQuoteRequest().subscribe(data => {
        expect(data).toEqual('test');
        verify(apiService.post(`customers/CID/users/UID/quoterequests`)).once();
        done();
      });
    });

    it("should update quote request when 'updateQuoteRequest' is called", done => {
      when(apiService.put(`customers/CID/users/UID/quoterequests/QID`, anything())).thenReturn(
        of({ id: 'QID' } as QuoteRequestData)
      );

      quoteRequestService.updateQuoteRequest('QID', { displayName: 'test' }).subscribe(data => {
        expect(data).toHaveProperty('id', 'QID');
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QID`, anything())).once();
        done();
      });
    });

    it("should delete quote request when 'deleteQuoteRequest' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quoterequests/QRID`)).thenReturn(of(undefined));

      quoteRequestService.deleteQuoteRequest('QRID').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.delete(`customers/CID/users/UID/quoterequests/QRID`)).once();
        done();
      });
    });

    it("should submit quote request when 'submitQuoteRequest' is called", done => {
      when(apiService.post(`customers/CID/users/UID/quotes`, anything())).thenReturn(of(undefined));

      quoteRequestService.submitQuoteRequest('QRID').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.post(`customers/CID/users/UID/quotes`, anything())).once();
        done();
      });
    });

    it("should get line item of quote request when 'getQuoteRequestItem' is called", done => {
      const quoteRequestItem = {
        singlePrice: {
          type: 'Money',
          value: 1,
          currency: 'EUR',
        },
        totalPrice: {
          type: 'Money',
          value: 1,
          currency: 'EUR',
        },
      } as QuoteRequestItemData;

      when(apiService.get(`customers/CID/users/UID/quoterequests/QRID/items/test`)).thenReturn(of(quoteRequestItem));

      quoteRequestService.getQuoteRequestItem('QRID', 'test').subscribe(data => {
        expect(data.singleBasePrice).toBe(quoteRequestItem.singlePrice);
        expect(data.totals.total).toBe(quoteRequestItem.totalPrice);
        verify(apiService.get(`customers/CID/users/UID/quoterequests/QRID/items/test`)).once();
        done();
      });
    });

    it("should post new item to quote request when 'addProductToQuoteRequest' is called", done => {
      store$.dispatch(
        new LoadQuoteRequestsSuccess({
          quoteRequests: [
            {
              id: 'QRID',
              editable: true,
            } as QuoteRequestData,
          ],
        })
      );

      when(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).thenReturn(of(undefined));

      quoteRequestService.addProductToQuoteRequest('sku', 3).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).once();
        done();
      });
    });

    it("should post new item to quote request when 'addProductToQuoteRequest' is called and no quote request is present", done => {
      const link = { title: 'QRID' } as Link;
      when(apiService.post(`customers/CID/users/UID/quoterequests`)).thenReturn(of(link));
      when(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).thenReturn(of(undefined));

      quoteRequestService.addProductToQuoteRequest('sku', 3).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).once();
        done();
      });
    });

    it("should create quote request and add list of items when 'createQuoteRequestFromQuote' is called", done => {
      when(apiService.post(`customers/CID/users/UID/quoterequests`)).thenReturn(of({ title: 'QRID' } as Link));
      when(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).thenReturn(of(undefined));

      quoteRequestService
        .createQuoteRequestFromQuoteRequest({ submitted: true, items: [] } as QuoteRequest)
        .subscribe(() => {
          verify(apiService.post(`customers/CID/users/UID/quoterequests`)).once();
          verify(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).once();
          done();
        });
    });

    it("should throw error if 'setQuoteRequestItems' is called with unsubmitted quote request", () => {
      expect(
        quoteRequestService.createQuoteRequestFromQuoteRequest({ submitted: false, items: [] } as QuoteRequest)
      ).toBeObservable(
        cold('#', undefined, { message: 'createQuoteRequestFromQuoteRequest() called with unsubmitted quote request' })
      );
    });

    it("should update line item of quote request when 'updateQuoteRequestItem' is called", done => {
      when(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items/itemId`, anything())).thenReturn(
        of(undefined)
      );

      quoteRequestService.updateQuoteRequestItem('QRID', { itemId: 'itemId', quantity: 1 }).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items/itemId`, anything())).once();
        done();
      });
    });

    it("should remove line item from quote request when 'deleteItemFromQuoteRequest' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quoterequests/QRID/items/itemId`)).thenReturn(of(undefined));

      quoteRequestService.removeItemFromQuoteRequest('QRID', 'itemId').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.delete(`customers/CID/users/UID/quoterequests/QRID/items/itemId`)).once();
        done();
      });
    });
  });
});
