import {
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { User } from 'ish-core/models/user/user.model';
import {
  getCurrentCurrency,
  getCurrentLocale,
  getICMServerURL,
  getRestEndpoint,
  getSparqueConfig,
} from 'ish-core/store/core/configuration';
import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config';
import { getPGID } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { SparqueApiService } from './sparque-api.service';

const sparqueConfig = {
  serverUrl: 'http://fancy:0815',
  apiName: 'foo',
  workspaceName: 'bar',
  channelId: 'aura',
} as SparqueConfig;

function getRestURL(endpoint: string): string {
  return sparqueConfig.serverUrl
    .concat('/api/v2')
    .concat(endpoint)
    .concat('?apiName=')
    .concat(sparqueConfig.apiName)
    .concat('&workspaceName=')
    .concat(sparqueConfig.workspaceName)
    .concat('&channelId=')
    .concat(sparqueConfig.channelId)
    .concat('&Locale=en-US')
    .concat('&user=test123');
}

// testing here is handled by http testing controller
/* eslint-disable ish-custom-rules/use-async-synchronization-in-tests */

describe('Sparque Api Service', () => {
  describe('Sparque API Service Methods', () => {
    let sparqueApiService: SparqueApiService;
    let store: Store;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({ email: 'test@example.com' } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'test123',
                isBusinessCustomer: false,
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: undefined },
              { selector: getCurrentCurrency, value: 'USD' },
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getPGID, value: undefined },
              {
                selector: getSparqueConfig,
                value: sparqueConfig,
              },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store = spy(TestBed.inject(Store));

      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>('apiToken'));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should be created', () => {
      expect(sparqueApiService).toBeTruthy();
    });

    it('should call the httpClient.get method when sparqueApiService.get method is called.', done => {
      sparqueApiService.get('data', 'v2').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/data'));
      req.flush({});
      expect(req.request.method).toEqual('GET');
    });

    it('should create Error Action if httpClient.get throws Error.', done => {
      sparqueApiService.get('data', 'v2').subscribe({
        next: fail,
        error: err => {
          expect(err).toBeInstanceOf(HttpErrorResponse);
          done();
        },
        complete: fail,
      });

      httpTestingController
        .expectOne(() => true)
        .flush('', {
          status: 400,
          statusText: 'Error',
        });

      verify(store.dispatch(anything())).never();
    });

    it('should include all SPARQUE configuration parameters in the request', done => {
      sparqueApiService.get('recommendations', 'v2').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/recommendations'));
      const params = req.request.params;
      expect(params.get('apiName')).toEqual('foo');
      expect(params.get('workspaceName')).toEqual('bar');
      expect(params.get('channelId')).toEqual('aura');
      expect(params.get('Locale')).toEqual('en-US');
      expect(req.request.method).toEqual('GET');

      req.flush({});
    });

    it('should handle locale formatting correctly (underscore to dash conversion)', done => {
      sparqueApiService.get('test', 'v2').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(() => true);
      const params = req.request.params;
      expect(params.get('Locale')).toEqual('en-US'); // underscore converted to dash
      req.flush({});
    });
  });

  describe('Sparque API Service URL construction', () => {
    let sparqueApiService: SparqueApiService;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: undefined },
              { selector: getCurrentLocale, value: undefined },
              { selector: getCurrentCurrency, value: undefined },
              { selector: getPGID, value: undefined },
              {
                selector: getSparqueConfig,
                value: sparqueConfig,
              },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      TestBed.inject(MockStore);

      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>('apiToken'));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should bypass URL construction when path is an external link', () => {
      sparqueApiService.get('http://google.de', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      httpTestingController.expectOne('http://google.de');
    });

    it('should bypass URL construction when path is an external secure link', () => {
      sparqueApiService.get('https://google.de', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      httpTestingController.expectOne('https://google.de');
    });
  });

  describe('SPARQUE API Service Headers', () => {
    let sparqueApiService: SparqueApiService;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({ email: 'test@example.com' } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'test123',
                isBusinessCustomer: false,
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getCurrentCurrency, value: 'USD' },
              { selector: getCurrentLocale, value: 'en_US' },
              {
                selector: getSparqueConfig,
                value: sparqueConfig,
              },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      TestBed.inject(Store);

      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>('apiToken'));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should always have default headers', () => {
      sparqueApiService.get('dummy', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always append additional headers', () => {
      sparqueApiService
        .get('dummy', 'v2', {
          headers: new HttpHeaders({
            dummy: 'test',
          }),
        })
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.has('dummy')).toBeTrue();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always have overridable default headers', () => {
      sparqueApiService
        .get('dummy', 'v2', {
          headers: new HttpHeaders({
            Accept: 'application/xml',
            'content-type': 'application/xml',
          }),
        })
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/xml');
      expect(req.request.headers.get('Accept')).toEqual('application/xml');
    });

    it('should have default response type of "json" if no other is provided', () => {
      sparqueApiService.get('dummy', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.responseType).toEqual('json');
    });

    it('should append specific response type of "text" if provided', () => {
      sparqueApiService
        .get('dummy', 'v2', { responseType: 'text' })
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.responseType).toEqual('text');
    });
  });

  describe('Sparque API Service general error handling', () => {
    let sparqueApiService: SparqueApiService;
    let store: Store;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              {
                selector: getSparqueConfig,
                value: sparqueConfig,
              },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store = spy(TestBed.inject(Store));

      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>('apiToken'));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should not dispatch errors when getting status 404', done => {
      sparqueApiService.get('route', 'v2').subscribe({
        next: fail,
        error: err => {
          expect(err).toBeInstanceOf(HttpErrorResponse);
          done();
        },
        complete: fail,
      });

      httpTestingController
        .expectOne(() => true)
        .flush('', {
          status: 404,
          statusText: 'Error',
        });

      verify(store.dispatch(anything())).never();
    });

    it('should dispatch server error action for 5xx status codes', done => {
      sparqueApiService.get('route', 'v2').subscribe({
        next: fail,
        error: () => {
          // Error should be handled, but we expect EMPTY to be returned by the error handler
          fail('Should return EMPTY, not error');
        },
        complete: () => {
          // Verify that server error action was dispatched
          verify(store.dispatch(anything())).once();
          done();
        },
      });

      httpTestingController
        .expectOne(() => true)
        .flush('', {
          status: 500,
          statusText: 'Internal Server Error',
        });
    });

    it('should dispatch communication timeout error for status 0', done => {
      sparqueApiService.get('route', 'v2').subscribe({
        next: fail,
        error: () => {
          fail('Should return EMPTY, not error');
        },
        complete: () => {
          // Verify that communication timeout error action was dispatched
          verify(store.dispatch(anything())).once();
          done();
        },
      });

      httpTestingController
        .expectOne(() => true)
        .flush('', {
          status: 0,
          statusText: 'Unknown Error',
        });
    });
  });

  describe('Sparque API Service user and Token Behavior', () => {
    let sparqueApiService: SparqueApiService;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>('test-api-token'));
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should use customer customerNo as user for regular customers', () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({ email: 'test@example.com', businessPartnerNo: 'BP123' } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'CUST456',
                isBusinessCustomer: false,
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(
        'http://fancy:0815/api/v2/test?apiName=foo&workspaceName=bar&channelId=aura&Locale=en-US&user=CUST456'
      );
      expect(req.request.params.get('user')).toEqual('CUST456');
    });

    it('should use user businessPartnerNo as user for business customers', () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({ email: 'test@example.com', businessPartnerNo: 'BP123' } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'CUST456',
                isBusinessCustomer: true,
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(
        'http://fancy:0815/api/v2/test?apiName=foo&workspaceName=bar&channelId=aura&Locale=en-US&user=BP123'
      );
      expect(req.request.params.get('user')).toEqual('BP123');
    });

    it('should include authorization header when user is identified and token is available', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(() => true);
      expect(req.request.headers.get('Authorization')).toEqual('bearer test-api-token');
    });

    it('should not include authorization header when no user is identified', () => {
      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>(undefined));

      TestBed.configureTestingModule({
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(() => true);
      expect(req.request.headers.get('Authorization')).toBeNull();
      expect(req.request.url).not.toContain('userId=');
    });

    it('should not include authorization header when token is not available', () => {
      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>(undefined));

      TestBed.configureTestingModule({
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(() => true);
      expect(req.request.headers.get('Authorization')).toBeNull();
    });

    it('should URL encode special characters in user parameter', () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({ email: 'test@example.com' } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'CUST@#456',
                isBusinessCustomer: false,
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      // The URL encoding is done by HttpParams, which double-encodes some characters
      const req = httpTestingController.expectOne(
        'http://fancy:0815/api/v2/test?apiName=foo&workspaceName=bar&channelId=aura&Locale=en-US&user=CUST@%23456'
      );
      expect(req.request.params.get('user')).toEqual('CUST@#456');
    });

    it('should handle undefined businessPartnerNo for business customers by not adding user parameter', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      // When businessPartnerNo is undefined, the service should not add a user parameter
      const req = httpTestingController.expectOne(req => !req.url.includes('user='));
      expect(req.request.url).not.toContain('user=');
    });

    it('should use customerNo when businessPartnerNo is undefined for business customers', () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({
                email: 'test@example.com',
                businessPartnerNo: undefined,
              } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'CUST456',
                isBusinessCustomer: false, // Let's test regular customer with undefined businessPartnerNo
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      // For regular customers, it should always use customerNo regardless of businessPartnerNo
      const req = httpTestingController.expectOne(
        'http://fancy:0815/api/v2/test?apiName=foo&workspaceName=bar&channelId=aura&Locale=en-US&user=CUST456'
      );
      expect(req.request.params.get('user')).toEqual('CUST456');
    });
  });

  describe('Sparque API Service Parameter Handling', () => {
    let sparqueApiService: SparqueApiService;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AccountFacade,
            useValue: {
              user$: new BehaviorSubject<User>({ email: 'test@example.com' } as User),
              customer$: new BehaviorSubject<Customer>({
                customerNo: 'test123',
                isBusinessCustomer: false,
              } as Customer),
            },
          },
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideMockStore({
            selectors: [
              { selector: getCurrentLocale, value: 'en_US' },
              { selector: getSparqueConfig, value: sparqueConfig },
            ],
          }),
        ],
      });

      sparqueApiService = TestBed.inject(SparqueApiService);
      httpTestingController = TestBed.inject(HttpTestingController);

      when(apiTokenServiceMock.apiToken$).thenReturn(new BehaviorSubject<string>('apiToken'));
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should handle selectedFacets parameter correctly by splitting comma-separated values', () => {
      const params = new HttpParams().set('selectedFacets', 'brand:nike,color:red,size:xl');

      sparqueApiService.get('search', 'v2', { params }).subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(() => true);
      const requestParams = req.request.params;

      // selectedFacets should be split and added as separate parameters
      expect(requestParams.getAll('selectedFacets')).toEqual(['brand:nike', 'color:red', 'size:xl']);
    });

    it('should handle regular parameters without splitting', () => {
      const params = new HttpParams().set('query', 'test search').set('limit', '10');

      sparqueApiService.get('search', 'v2', { params }).subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(() => true);
      const requestParams = req.request.params;

      expect(requestParams.get('query')).toEqual('test search');
      expect(requestParams.get('limit')).toEqual('10');
    });

    it('should exclude serverUrl from SPARQUE configuration parameters', () => {
      sparqueApiService.get('test', 'v2').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(() => true);
      const params = req.request.params;
      expect(params.has('serverUrl')).toBeFalse();
      expect(params.get('apiName')).toEqual('foo');
      expect(params.get('workspaceName')).toEqual('bar');
      expect(params.get('channelId')).toEqual('aura');
    });
  });
});
