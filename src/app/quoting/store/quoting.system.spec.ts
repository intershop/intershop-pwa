import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { QuoteRequestData } from 'ish-core/models/quote-request/quote-request.interface';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { coreEffects, coreReducers } from 'ish-core/store/core.system';
import {
  LoadCompanyUserSuccess,
  LoginUserSuccess,
  LogoutUser,
  getLoggedInCustomer,
  getLoggedInUser,
} from 'ish-core/store/user';
import { checkoutReducers } from '../../checkout/store/checkout.system';
import { FeatureToggleModule } from '../../shared/feature-toggle.module';
import { shoppingReducers } from '../../shopping/store/shopping.system';
import {
  TestStore,
  containsActionWithType,
  containsActionWithTypeAndPayload,
  ngrxTesting,
} from '../../utils/dev/ngrx-testing';
import { QuoteRequestService } from '../services/quote-request/quote-request.service';
import { QuoteService } from '../services/quote/quote.service';

import { QuoteActionTypes, getCurrentQuotes } from './quote';
import {
  AddProductToQuoteRequest,
  QuoteRequestActionTypes,
  getActiveQuoteRequest,
  getCurrentQuoteRequests,
} from './quote-request';
import { quotingEffects, quotingReducers } from './quoting.system';

describe('Quoting System', () => {
  let store$: TestStore;
  let apiServiceMock: ApiService;
  let quoteServiceMock: QuoteService;
  let locales: Locale[];
  const user = { email: 'UID', customerNo: 'CID' } as User;

  beforeEach(() => {
    jest.useRealTimers();

    // tslint:disable-next-line:use-component-change-detection
    @Component({ template: 'dummy' })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
    ] as Locale[];

    apiServiceMock = mock(ApiService);
    when(apiServiceMock.icmServerURL).thenReturn('http://example.org');

    quoteServiceMock = mock(QuoteService);
    when(quoteServiceMock.getQuotes()).thenReturn(of([]));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ...ngrxTesting(
          {
            ...coreReducers,
            quoting: combineReducers(quotingReducers),
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
          [...coreEffects, ...quotingEffects]
        ),
        FeatureToggleModule.testingFeatures({ quoting: true }),
        RouterTestingModule.withRoutes([
          { path: 'account', component: DummyComponent },
          { path: 'home', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
      ],
      providers: [
        QuoteRequestService,
        { provide: QuoteService, useFactory: () => instance(quoteServiceMock) },
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: AVAILABLE_LOCALES, useValue: locales },
      ],
    });

    store$ = TestBed.get(TestStore);
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

      store$.dispatch(new LoginUserSuccess(user as Customer));
      store$.dispatch(new LoadCompanyUserSuccess(user));
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
        containsActionWithTypeAndPayload(QuoteRequestActionTypes.LoadQuoteRequestsSuccess, p => !!p.length)
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
            store$.dispatch(new LoginUserSuccess(user as Customer));
            store$.dispatch(new LoadCompanyUserSuccess(user));
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
