import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { EMPTY, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, instance, mock, when } from 'ts-mockito';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { CountryService } from 'ish-core/services/country/country.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import {
  getLoggedInCustomer,
  getLoggedInUser,
  loadCompanyUserSuccess,
  loginUserSuccess,
} from 'ish-core/store/customer/user';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { QuoteRequestData } from '../models/quote-request/quote-request.interface';
import { QuoteRequestService } from '../services/quote-request/quote-request.service';
import { QuoteService } from '../services/quote/quote.service';

import { getCurrentQuotes } from './quote';
import { getActiveQuoteRequest, getCurrentQuoteRequests } from './quote-request';
import { QuotingStoreModule } from './quoting-store.module';

describe('Quoting Store', () => {
  let store$: StoreWithSnapshots;
  let apiServiceMock: ApiService;
  let quoteServiceMock: QuoteService;
  const user = { email: 'UID' } as User;
  const customer = { customerNo: 'CID' } as Customer;

  beforeEach(() => {
    jest.useRealTimers();

    @Component({ template: 'dummy' })
    class DummyComponent {}
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.get(anything())).thenReturn(EMPTY);

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(EMPTY);

    quoteServiceMock = mock(QuoteService);
    when(quoteServiceMock.getQuotes()).thenReturn(of([]));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting([], true),
        CustomerStoreModule.forTesting('user', 'basket'),
        FeatureToggleModule.forTesting('quoting'),
        QuotingStoreModule,
        RouterTestingModule.withRoutes([
          { path: 'account', component: DummyComponent },
          { path: 'home', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('products', 'categories'),
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        provideStoreSnapshots(),
        QuoteRequestService,
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  it('should be created', () => {
    expect(store$).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not have any quotes or quote requests when initialized', () => {
      expect(getActiveQuoteRequest(store$.state)).toBeUndefined();
      expect(getCurrentQuoteRequests(store$.state)).toBeEmpty();
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
    });
  });

  describe('Company User logs in', () => {
    let quoteRequestCount;

    beforeEach(() => {
      when(apiServiceMock.resolveLinks()).thenReturn(() => of([{ id: 'QRID1', submitted: true } as QuoteRequestData]));
      when(apiServiceMock.get('customers/CID/users/UID/quoterequests')).thenReturn(
        of({
          elements: [{ type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID1' }],
        })
      );

      // quote request creator
      quoteRequestCount = 1;
      when(apiServiceMock.post('customers/CID/users/UID/quoterequests')).thenCall(() => {
        quoteRequestCount++;
        const id = 'QRID' + quoteRequestCount;
        return of({ type: 'Link', uri: 'customers/CID/users/UID/quoterequests/' + id, title: id }).pipe(delay(1000));
      });

      store$.dispatch(loginUserSuccess({ customer, user }));
      store$.dispatch(loadCompanyUserSuccess({ user }));
    });

    it('should be created', () => {
      expect(getLoggedInUser(store$.state)).toBeTruthy();
      expect(getLoggedInCustomer(store$.state)).toBeTruthy();
    });

    it('should load the quotes and quote requests after user login', () => {
      expect(store$.actionsArray(/Quote/)).toMatchInlineSnapshot(`
        [Quote Internal] Load QuoteRequests
        [Quote API] Load QuoteRequests Success:
          quoteRequests: [{"id":"QRID1","submitted":true}]
        [Quote Internal] Load Quotes
        [Quote Internal] Load QuoteRequests
        [Quote API] Load Quotes Success:
          quotes: []
        [Quote API] Load QuoteRequests Success:
          quoteRequests: [{"id":"QRID1","submitted":true}]
      `);
    });

    it('should have the quotes and quote requests but no active quote request after user login', () => {
      expect(getActiveQuoteRequest(store$.state)).toBeUndefined();
      expect(getCurrentQuoteRequests(store$.state)).not.toBeEmpty();
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
    });
  });
});
