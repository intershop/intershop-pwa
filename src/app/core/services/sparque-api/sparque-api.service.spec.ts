import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { TokenService } from 'ish-core/services/token/token.service';
import {
  getCurrentCurrency,
  getCurrentLocale,
  getICMServerURL,
  getRestEndpoint,
  getSparqueConfig,
} from 'ish-core/store/core/configuration';
import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config';
import { getPGID } from 'ish-core/store/customer/user';
import { sparqueSuggestServerError } from 'ish-core/store/shopping/search';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { SparqueApiService } from './sparque-api.service';

const sparqueConfig = {
  serverUrl: 'http://fancy:0815',
  wrapperApi: 'infinity',
  apiName: 'foo',
  workspaceName: 'bar',
  channelId: 'aura',
} as SparqueConfig;

function getRestURL(endpoint: string): string {
  return sparqueConfig.serverUrl
    .concat('/api/', sparqueConfig.wrapperApi)
    .concat(endpoint)
    .concat('?apiName=')
    .concat(sparqueConfig.apiName)
    .concat('&workspaceName=')
    .concat(sparqueConfig.workspaceName)
    .concat('&channelId=')
    .concat(sparqueConfig.channelId)
    .concat('&Locale=en-US');
}

// testing here is handled by http testing controller
/* eslint-disable ish-custom-rules/use-async-synchronization-in-tests */

describe('Sparque Api Service', () => {
  describe('Sparque API Service Methods', () => {
    let sparqueApiService: SparqueApiService;
    let store: Store;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);
    const tokenServiceMock = mock(TokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          { provide: TokenService, useFactory: () => instance(tokenServiceMock) },
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

    it('should call the httpClient.get method when sparqueApiService.get method is called.', done => {
      sparqueApiService.get('data').subscribe({
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
      sparqueApiService.get('data').subscribe({
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
  });

  describe('Sparque API Service URL construction', () => {
    let sparqueApiService: SparqueApiService;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);
    const tokenServiceMock = mock(TokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          { provide: TokenService, useFactory: () => instance(tokenServiceMock) },
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
      sparqueApiService.get('http://google.de').subscribe({ next: fail, error: fail, complete: fail });

      httpTestingController.expectOne('http://google.de');
    });

    it('should bypass URL construction when path is an external secure link', () => {
      sparqueApiService.get('https://google.de').subscribe({ next: fail, error: fail, complete: fail });

      httpTestingController.expectOne('https://google.de');
    });
  });

  describe('SPARQUE API Service Headers', () => {
    let sparqueApiService: SparqueApiService;
    let httpTestingController: HttpTestingController;
    const apiTokenServiceMock = mock(ApiTokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          { provide: TokenService, useFactory: () => instance(mock(TokenService)) },
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
      sparqueApiService.get('dummy').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always append additional headers', () => {
      sparqueApiService
        .get('dummy', {
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
        .get('dummy', {
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
      sparqueApiService.get('dummy').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(getRestURL('/dummy'));
      expect(req.request.responseType).toEqual('json');
    });

    it('should append specific response type of "text" if provided', () => {
      sparqueApiService.get('dummy', { responseType: 'text' }).subscribe({ next: fail, error: fail, complete: fail });

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
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          { provide: TokenService, useFactory: () => instance(mock(TokenService)) },
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

    it('should dispatch communication timeout errors when getting status 0', done => {
      sparqueApiService.get('data').subscribe({
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
          status: 0,
          statusText: 'Error',
        });

      verify(store.dispatch(anything())).once();
      const dispatchedAction = capture(store.dispatch).last()?.[0] as { payload: { error: HttpError }; type: string };
      expect(dispatchedAction.type).toBe(sparqueSuggestServerError.type);
    });

    it('should dispatch general errors when getting status 500', done => {
      sparqueApiService.get('data').subscribe({
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
          status: 500,
          statusText: 'Error',
        });

      verify(store.dispatch(anything())).once();
      const dispatchedAction = capture(store.dispatch).last()?.[0] as { payload: { error: HttpError }; type: string };
      expect(dispatchedAction.type).toBe(sparqueSuggestServerError.type);
    });

    it('should not dispatch errors when getting status 404', done => {
      sparqueApiService.get('route').subscribe({
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
  });
});
