import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { CoreState } from '../../../core/store/core.state';
import { coreReducers } from '../../../core/store/core.system';
import { LoadCompanyUserSuccess, LoginUserSuccess } from '../../../core/store/user';
import { Customer } from '../../../models/customer/customer.model';
import { QuoteRequestItemData } from '../../../models/quote-request-item/quote-request-item.interface';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { User } from '../../../models/user/user.model';
import { QuoteRequestService } from '../quote-request/quote-request.service';
import { QuoteService } from './quote.service';

describe('Quote Service', () => {
  let quoteService: QuoteService;
  let apiService: ApiService;
  let quoteRequestService: QuoteRequestService;
  let store$: Store<CoreState>;

  const customer = { customerNo: 'CID', type: 'SMBCustomer' } as Customer;
  const user = { email: 'UID' } as User;

  beforeEach(() => {
    apiService = mock(ApiService);
    quoteRequestService = mock(QuoteRequestService);
    when(apiService.icmServerURL).thenReturn('BASE');

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [
        QuoteService,
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: QuoteRequestService, useFactory: () => instance(quoteRequestService) },
      ],
    });

    quoteService = TestBed.get(QuoteService);
    store$ = TestBed.get(Store);
  });

  describe('when not logged in', () => {
    it('should throw error for getQuotes', () => {
      expect(quoteService.getQuotes()).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });

    it('should throw error for deleteQuote', () => {
      expect(quoteService.deleteQuote(undefined)).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });

    it('should throw error for rejectQuote', () => {
      expect(quoteService.rejectQuote(undefined)).toBeObservable(cold('#', undefined, { message: 'not logged in' }));
    });

    it('should throw error for createQuoteRequestFromQuote', () => {
      expect(quoteService.createQuoteRequestFromQuote({ items: [] } as Quote)).toBeObservable(
        cold('#', undefined, { message: 'not logged in' })
      );
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess(customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
    });

    it("should get quotes data when 'getQuotes' is called", done => {
      when(apiService.get(`customers/CID/users/UID/quotes`)).thenReturn(
        of({
          elements: [{ type: 'Link', uri: 'customers/CID/users/UID/quotes/QID' }],
        })
      );
      when(apiService.get(`BASE/customers/CID/users/UID/quotes/QID`)).thenReturn(
        of({
          id: 'QID',
          items: [
            {
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
            } as QuoteRequestItemData,
          ],
        })
      );

      quoteService.getQuotes().subscribe(data => {
        expect(data).toHaveLength(1);
        expect(data[0].id).toEqual('QID');

        const quoteRequestItem = data[0].items[0] as QuoteRequestItem;
        expect(quoteRequestItem.singleBasePrice.value).toBe(1);
        expect(quoteRequestItem.totals.total.value).toBe(1);

        verify(apiService.get(`customers/CID/users/UID/quotes`)).once();
        verify(apiService.get(`BASE/customers/CID/users/UID/quotes/QID`)).once();
        done();
      });
    });

    it("should delete quote when 'deleteQuote' is called", done => {
      when(apiService.delete(`customers/CID/users/UID/quotes/QID`)).thenReturn(of(undefined));

      quoteService.deleteQuote('QID').subscribe(id => {
        expect(id).toEqual('QID');
        verify(apiService.delete(`customers/CID/users/UID/quotes/QID`)).once();
        done();
      });
    });

    it("should reject quote when 'rejectQuote' is called", done => {
      when(apiService.put(`customers/CID/users/UID/quotes/QID`, anything())).thenReturn(of(undefined));

      quoteService.rejectQuote('QID').subscribe(id => {
        expect(id).toEqual('QID');
        verify(apiService.put(`customers/CID/users/UID/quotes/QID`, anything())).once();
        done();
      });
    });

    it("should create quote request and add list of items when 'createQuoteRequestFromQuote' is called", done => {
      when(quoteRequestService.addQuoteRequest()).thenReturn(of('QRID'));
      when(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).thenReturn(of(undefined));

      quoteService.createQuoteRequestFromQuote({ items: [] } as Quote).subscribe(() => {
        verify(quoteRequestService.addQuoteRequest()).once();
        verify(apiService.put(`customers/CID/users/UID/quoterequests/QRID/items`, anything())).once();
        done();
      });
    });
  });
});
