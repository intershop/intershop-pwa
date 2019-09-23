import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { EMPTY, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import {
  AVAILABLE_LOCALES,
  LARGE_BREAKPOINT_WIDTH,
  MEDIUM_BREAKPOINT_WIDTH,
} from 'ish-core/configurations/injection-keys';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { CountryService } from 'ish-core/services/country/country.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { coreEffects, coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import {
  LoadCompanyUserSuccess,
  LoginUserSuccess,
  LogoutUser,
  getLoggedInCustomer,
  getLoggedInUser,
} from 'ish-core/store/user';
import {
  TestStore,
  containsActionWithType,
  containsActionWithTypeAndPayload,
  ngrxTesting,
} from 'ish-core/utils/dev/ngrx-testing';

import { QuoteRequestData } from '../models/quote-request/quote-request.interface';
import { QuoteRequestService } from '../services/quote-request/quote-request.service';
import { QuoteService } from '../services/quote/quote.service';

import { QuoteActionTypes, getCurrentQuotes } from './quote';
import {
  AddProductToQuoteRequest,
  QuoteRequestActionTypes,
  getActiveQuoteRequest,
  getCurrentQuoteRequests,
} from './quote-request';
import { quotingEffects, quotingReducers } from './quoting-store.module';

describe('Quoting Store', () => {
  let store$: TestStore;
  let apiServiceMock: ApiService;
  let quoteServiceMock: QuoteService;
  let locales: Locale[];
  const user = { email: 'UID' } as User;
  const customer = { customerNo: 'CID' } as Customer;

  beforeEach(() => {
    jest.useRealTimers();

    @Component({ template: 'dummy' })
    class DummyComponent {}

    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
    ] as Locale[];

    apiServiceMock = mock(ApiService);
    when(apiServiceMock.icmServerURL).thenReturn('http://example.org');
    when(apiServiceMock.get(anything())).thenReturn(EMPTY);

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(EMPTY);

    quoteServiceMock = mock(QuoteService);
    when(quoteServiceMock.getQuotes()).thenReturn(of([]));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        FeatureToggleModule,
        RouterTestingModule.withRoutes([
          { path: 'account', component: DummyComponent },
          { path: 'home', component: DummyComponent },
        ]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            quoting: combineReducers(quotingReducers),
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
          effects: [...coreEffects, ...quotingEffects],
        }),
      ],
      providers: [
        QuoteRequestService,
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: AVAILABLE_LOCALES, useValue: locales },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    store$ = TestBed.get(TestStore);
    store$.dispatch(new ApplyConfiguration({ features: ['quoting'] }));
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
      when(apiServiceMock.get('customers/CID/users/UID/quoterequests')).thenReturn(
        of({
          elements: [{ type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID1' }],
        })
      );
      // initial submitted quote request
      when(apiServiceMock.get('http://example.org/customers/CID/users/UID/quoterequests/QRID1')).thenReturn(
        of({ id: 'QRID1', submitted: true } as QuoteRequestData)
      );

      // quote request creator
      quoteRequestCount = 1;
      when(apiServiceMock.post('customers/CID/users/UID/quoterequests')).thenCall(() => {
        quoteRequestCount++;
        const id = 'QRID' + quoteRequestCount;
        return of({ type: 'Link', uri: 'customers/CID/users/UID/quoterequests/' + id, title: id }).pipe(delay(1000));
      });

      store$.dispatch(new LoginUserSuccess({ customer, user }));
      store$.dispatch(new LoadCompanyUserSuccess({ user }));
    });

    it('should be created', () => {
      expect(getLoggedInUser(store$.state)).toBeTruthy();
      expect(getLoggedInCustomer(store$.state)).toBeTruthy();
    });

    it('should load the quotes and quote requests after user login', () => {
      const firedActions = store$.actionsArray(['Quote']);

      expect(firedActions).toSatisfy(containsActionWithType(QuoteActionTypes.LoadQuotes));
      expect(firedActions).toSatisfy(containsActionWithType(QuoteRequestActionTypes.LoadQuoteRequests));

      expect(firedActions).toSatisfy(
        containsActionWithTypeAndPayload(QuoteActionTypes.LoadQuotesSuccess, p => !p.length)
      );
      expect(firedActions).toSatisfy(
        containsActionWithTypeAndPayload(
          QuoteRequestActionTypes.LoadQuoteRequestsSuccess,
          p => !!p.quoteRequests.length
        )
      );
    });

    it('should have the quotes and quote requests but no active quote request after user login', () => {
      expect(getActiveQuoteRequest(store$.state)).toBeUndefined();
      expect(getCurrentQuoteRequests(store$.state)).not.toBeEmpty();
      expect(getCurrentQuotes(store$.state)).toBeEmpty();
    });

    describe('adding products to quote request', () => {
      // influenced by ISREST-400: Rapidly adding items to quote request behaves unexpected
      beforeEach(() => {
        when(apiServiceMock.get('http://example.org/customers/CID/users/UID/quoterequests/QRID2')).thenReturn(
          of({ id: 'QRID2', editable: true } as QuoteRequestData).pipe(delay(100))
        );
        when(apiServiceMock.get('http://example.org/customers/CID/users/UID/quoterequests/QRID3')).thenReturn(
          of({ id: 'QRID3' } as QuoteRequestData).pipe(delay(100))
        );
        when(apiServiceMock.get('http://example.org/customers/CID/users/UID/quoterequests/QRID4')).thenReturn(
          of({ id: 'QRID4' } as QuoteRequestData).pipe(delay(100))
        );
        when(apiServiceMock.get('customers/CID/users/UID/quoterequests')).thenReturn(
          of({
            elements: [
              { type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID1' },
              { type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID2' },
              { type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID3' },
              { type: 'Link', uri: 'customers/CID/users/UID/quoterequests/QRID4' },
            ],
          }).pipe(delay(100))
        );
        when(apiServiceMock.post('customers/CID/users/UID/quoterequests/QRID2/items', anything())).thenReturn(
          of(undefined)
        );
        when(apiServiceMock.post('customers/CID/users/UID/quoterequests/QRID3/items', anything())).thenReturn(
          of(undefined)
        );
        when(apiServiceMock.post('customers/CID/users/UID/quoterequests/QRID4/items', anything())).thenReturn(
          of(undefined)
        );

        store$.reset();
        resetCalls(apiServiceMock);
        setTimeout(() => store$.dispatch(new AddProductToQuoteRequest({ sku: 'SKU', quantity: 1 })), 400);
        setTimeout(() => store$.dispatch(new AddProductToQuoteRequest({ sku: 'SKU', quantity: 1 })), 450);
        setTimeout(() => store$.dispatch(new AddProductToQuoteRequest({ sku: 'SKU', quantity: 1 })), 480);
      });

      it('should add all add requests to the same newly aquired quote request', done =>
        setTimeout(() => {
          expect(getActiveQuoteRequest(store$.state)).toBeTruthy();

          const active = getActiveQuoteRequest(store$.state);
          expect(active.editable).toBeTrue();

          verify(apiServiceMock.post('customers/CID/users/UID/quoterequests')).once();
          verify(apiServiceMock.post('customers/CID/users/UID/quoterequests/QRID2/items', anything())).times(3);

          done();
        }, 2000));

      describe('user logs out', () => {
        beforeEach(() => {
          store$.reset();
          store$.dispatch(new LogoutUser());
        });

        it('should no longer have any quoting related data after user logout', () => {
          expect(getActiveQuoteRequest(store$.state)).toBeUndefined();
          expect(getCurrentQuoteRequests(store$.state)).toBeEmpty();
          expect(getCurrentQuotes(store$.state)).toBeEmpty();
        });

        describe('user logs in again', () => {
          beforeEach(() => {
            store$.reset();
            store$.dispatch(new LoginUserSuccess({ customer, user }));
            store$.dispatch(new LoadCompanyUserSuccess({ user }));
          });

          it('should load all the quotes when logging in again', done =>
            setTimeout(() => {
              expect(getActiveQuoteRequest(store$.state)).not.toBeUndefined();
              expect(getCurrentQuoteRequests(store$.state)).toHaveLength(4);
              expect(getCurrentQuotes(store$.state)).toBeEmpty();
              done();
            }, 2000));
        });
      });
    });
  });
});
