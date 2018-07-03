import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { CoreState } from '../../../core/store/core.state';
import { coreReducers } from '../../../core/store/core.system';
import { LoadCompanyUserSuccess, LoginUserSuccess, LogoutUser } from '../../../core/store/user';
import { Customer } from '../../../models/customer/customer.model';
import { Link } from '../../../models/link/link.model';
import { QuoteRequestItemData } from '../../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { User } from '../../../models/user/user.model';
import { QuoteRequestService } from './quote-request.service';

describe('Quote Request Service', () => {
  let quoteRequestService: QuoteRequestService;
  let apiService: ApiService;
  let store$: Store<CoreState>;

  const customer = { customerNo: 'CID', type: 'SMBCustomer' } as Customer;
  const user = { email: 'UID' } as User;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.icmServerURL).thenReturn('BASE');

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [QuoteRequestService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });

    quoteRequestService = TestBed.get(QuoteRequestService);
    store$ = TestBed.get(Store);
  });

  describe('when not logged in', () => {
    it('should throw error for addProductToQuoteRequest', () => {
      expect(
        quoteRequestService.addProductToQuoteRequest(null, { sku: undefined, quantity: undefined })
      ).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for addQuoteRequest', () => {
      expect(quoteRequestService.addQuoteRequest()).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for deleteQuoteRequest', () => {
      expect(quoteRequestService.deleteQuoteRequest(null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for submitQuoteRequest', () => {
      expect(quoteRequestService.submitQuoteRequest(null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for getQuoteRequestItem', () => {
      expect(quoteRequestService.getQuoteRequestItem(null, null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for getQuoteRequests', () => {
      expect(quoteRequestService.getQuoteRequests()).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for removeItemFromQuoteRequest', () => {
      expect(quoteRequestService.removeItemFromQuoteRequest(null, null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for updateQuoteRequest', () => {
      expect(quoteRequestService.updateQuoteRequest(null, null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for updateQuoteRequestItem', () => {
      expect(
        quoteRequestService.updateQuoteRequestItem(null, { itemId: undefined, quantity: undefined })
      ).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });
  });

  describe('completion', () => {
    const expectEmptyArray = data => expect(data).toEqual([]);

    beforeEach(() => {
      when(apiService.get(anything())).thenReturn(of({ elements: [] }));
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it('should complete after first successful result', () => {
      const subscription = quoteRequestService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).once();

      store$.dispatch(new LoadCompanyUserSuccess({ ...user, firstName: 'test' } as User));

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
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
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
        of({ id: 'QID' } as QuoteRequest)
      );

      quoteRequestService.updateQuoteRequest('QID', { displayName: 'test' }).subscribe(data => {
        expect(data).toHaveProperty('id', 'QID');
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QID`, anything())).once();
        done();
      });
    });

    it("should delete quote request when 'deleteQuoteRequest' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quoterequests/QRID`)).thenReturn(of(null));

      quoteRequestService.deleteQuoteRequest('QRID').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.delete(`customers/CID/users/UID/quoterequests/QRID`)).once();
        done();
      });
    });

    it("should submit quote request when 'submitQuoteRequest' is called", done => {
      when(apiService.post(`customers/CID/users/UID/quotes`, anything())).thenReturn(of(null));

      quoteRequestService.submitQuoteRequest('QRID').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.post(`customers/CID/users/UID/quotes`, anything())).once();
        done();
      });
    });

    it("should get line item of quote request when 'getQuoteRequestItem' is called", done => {
      const quoteRequestItem = {
        singlePrice: {
          type: 'test',
          value: 1,
          currencyMnemonic: 'EUR',
        },
        totalPrice: {
          type: 'test',
          value: 1,
          currencyMnemonic: 'EUR',
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
      when(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).thenReturn(of(null));

      quoteRequestService.addProductToQuoteRequest('QRID', { sku: 'sku', quantity: 3 }).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).once();
        done();
      });
    });

    it("should update line item of quote request when 'updateQuoteRequestItem' is called", done => {
      when(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items/itemId`, anything())).thenReturn(of(null));

      quoteRequestService.updateQuoteRequestItem('QRID', { itemId: 'itemId', quantity: 1 }).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items/itemId`, anything())).once();
        done();
      });
    });

    it("should remove line item from quote request when 'deleteItemFromQuoteRequest' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quoterequests/QRID/items/itemId`)).thenReturn(of(null));

      quoteRequestService.removeItemFromQuoteRequest('QRID', 'itemId').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.delete(`customers/CID/users/UID/quoterequests/QRID/items/itemId`)).once();
        done();
      });
    });
  });
});
