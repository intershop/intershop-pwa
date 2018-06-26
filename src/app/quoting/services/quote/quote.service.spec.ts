import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { CoreState } from '../../../core/store/core.state';
import { coreReducers } from '../../../core/store/core.system';
import { LoadCompanyUserSuccess, LoginUserSuccess } from '../../../core/store/user';
import { Customer } from '../../../models/customer/customer.model';
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
    it('should throw error for deleteQuote', () => {
      expect(quoteService.deleteQuote(null)).toBeObservable(cold('#', null, { message: 'not logged in' }));
    });

    it('should throw error for getQuotes', () => {
      expect(quoteService.getQuotes()).toBeObservable(cold('#', null, { message: 'not logged in' }));
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
      when(apiService.get(`BASE/customers/CID/users/UID/quotes/QID`)).thenReturn(of({ id: 'QID' }));

      quoteService.getQuotes().subscribe(data => {
        expect(data).toHaveLength(1);
        expect(data[0].id).toEqual('QID');
        verify(apiService.get(`customers/CID/users/UID/quotes`)).once();
        verify(apiService.get(`BASE/customers/CID/users/UID/quotes/QID`)).once();
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
  });
});
