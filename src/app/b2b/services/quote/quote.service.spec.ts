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
import { Quote } from '../../../models/quote/quote.model';
import { User } from '../../../models/user/user.model';
import { QuoteService } from './quote.service';

describe('Quote Service', () => {
  let quoteService: QuoteService;
  let apiService: ApiService;
  let store$: Store<CoreState>;

  const customer = { customerNo: 'CID', type: 'SMBCustomer' } as Customer;
  const user = { email: 'UID' } as User;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.icmServerURL).thenReturn('BASE');

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [QuoteService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });

    quoteService = TestBed.get(QuoteService);
    store$ = TestBed.get(Store);
  });

  describe('when not logged in', () => {
    it('should throw error for addProductToQuoteRequest', () => {
      expect(quoteService.addProductToQuoteRequest(null, { sku: undefined, quantity: undefined })).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for addQuoteRequest', () => {
      expect(quoteService.addQuoteRequest()).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for deleteQuote', () => {
      expect(quoteService.deleteQuote(null)).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for deleteQuoteRequest', () => {
      expect(quoteService.deleteQuoteRequest(null)).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for getQuoteRequestItem', () => {
      expect(quoteService.getQuoteRequestItem(null, null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for getQuoteRequests', () => {
      expect(quoteService.getQuoteRequests()).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for getQuotes', () => {
      expect(quoteService.getQuotes()).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for removeItemFromQuoteRequest', () => {
      expect(quoteService.removeItemFromQuoteRequest(null, null)).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
    });

    it('should throw error for updateQuoteRequest', () => {
      expect(quoteService.updateQuoteRequest(null)).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for updateQuoteRequestItem', () => {
      expect(quoteService.updateQuoteRequestItem(null, { itemId: undefined, quantity: undefined })).toBeObservable(
        cold('#', null, { message: 'not logged in' })
      );
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
      const subscription = quoteService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).once();

      store$.dispatch(new LoadCompanyUserSuccess({ ...user, firstName: 'test' } as User));

      verify(apiService.get(anything())).once();

      expect(subscription.closed).toBeTrue();
    });

    it('should execute for every subscription', () => {
      const subscription1 = quoteService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).once();
      expect(subscription1.closed).toBeTrue();

      const subscription2 = quoteService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).twice();
      expect(subscription2.closed).toBeTrue();

      const subscription3 = quoteService.getQuoteRequests().subscribe(expectEmptyArray);

      verify(apiService.get(anything())).thrice();
      expect(subscription3.closed).toBeTrue();

      store$.dispatch(new LogoutUser());

      const subscription4 = quoteService.getQuoteRequests().subscribe(fail);

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

      quoteService.getQuoteRequests().subscribe(data => {
        expect(data).toHaveLength(1);
        expect(data[0].id).toEqual('QRID');
        verify(apiService.get(`customers/CID/users/UID/quoterequests`)).once();
        verify(apiService.get(`BASE/customers/CID/users/UID/quoterequests/QRID`)).once();
        done();
      });
    });

    it("should get quotes data when 'getQuotes' is called", done => {
      when(apiService.get(`customers/CID/users/UID/quotes`)).thenReturn(
        of({
          elements: [{ type: 'Link', uri: 'customers/CID/users/UID/quotes/QID' }],
        })
      );
      when(apiService.get(`BASE/customers/CID/users/UID/quotes/QID`)).thenReturn(of({ id: 'QID' }));

      quoteService.getQuotes().subscribe(data => {
        expect(data).toHaveLength(1);
        expect(data[0].id).toEqual('QID');
        verify(apiService.get(`customers/CID/users/UID/quotes`)).once();
        verify(apiService.get(`BASE/customers/CID/users/UID/quotes/QID`)).once();
        done();
      });
    });

    it("should post new quote request when 'addQuoteRequest' is called", done => {
      const link = { title: 'test' } as Link;
      when(apiService.post(`customers/CID/users/UID/quoterequests`)).thenReturn(of(link));

      quoteService.addQuoteRequest().subscribe(data => {
        expect(data).toEqual('test');
        verify(apiService.post(`customers/CID/users/UID/quoterequests`)).once();
        done();
      });
    });

    it("should update quote request when 'updateQuoteRequest' is called", done => {
      when(apiService.put(`customers/CID/users/UID/quoterequests/QID`, anything())).thenReturn(
        of({ id: 'QID' } as Quote)
      );

      quoteService.updateQuoteRequest({ id: 'QID' } as Quote).subscribe(data => {
        expect(data).toHaveProperty('id', 'QID');
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QID`, anything())).once();
        done();
      });
    });

    it("should delete quote request when 'deleteQuoteRequest' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quoterequests/QRID`)).thenReturn(of(null));

      quoteService.deleteQuoteRequest('QRID').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.delete(`customers/CID/users/UID/quoterequests/QRID`)).once();
        done();
      });
    });

    it("should delete quote  when 'deleteQuote' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quotes/QID`)).thenReturn(of(null));

      quoteService.deleteQuote('QID').subscribe(id => {
        expect(id).toEqual('QID');
        verify(apiService.delete(`customers/CID/users/UID/quotes/QID`)).once();
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

      quoteService.getQuoteRequestItem('QRID', 'test').subscribe(data => {
        expect(data.singleBasePrice).toBe(quoteRequestItem.singlePrice);
        expect(data.totals.total).toBe(quoteRequestItem.totalPrice);
        verify(apiService.get(`customers/CID/users/UID/quoterequests/QRID/items/test`)).once();
        done();
      });
    });

    it("should post new item to quote request when 'addProductToQuoteRequest' is called", done => {
      when(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).thenReturn(of(null));

      quoteService.addProductToQuoteRequest('QRID', { sku: 'sku', quantity: 3 }).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.post(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).once();
        done();
      });
    });

    it("should update line item of quote request when 'updateQuoteRequestItem' is called", done => {
      when(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items/itemId`, anything())).thenReturn(of(null));

      quoteService.updateQuoteRequestItem('QRID', { itemId: 'itemId', quantity: 1 }).subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items/itemId`, anything())).once();
        done();
      });
    });

    it("should remove line item from quote request when 'deleteItemFromQuoteRequest' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quoterequests/QRID/items/itemId`)).thenReturn(of(null));

      quoteService.removeItemFromQuoteRequest('QRID', 'itemId').subscribe(id => {
        expect(id).toEqual('QRID');
        verify(apiService.delete(`customers/CID/users/UID/quoterequests/QRID/items/itemId`)).once();
        done();
      });
    });
  });
});
