import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, noop } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
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
import { serverError } from 'ish-core/store/core/error';
import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config';
import { getPGID } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { SparqueApiService } from './sparque-api.service';

const sparqueConfig = {
  server_url: 'http://fancy:0815',
  ApiName: 'dopeShit',
  WorkspaceName: 'OttoKartoffel',
  wrapperAPI: 'infinity',
  ChannelId: 'aura',
} as SparqueConfig;

function getRestURL(endpoint: string): string {
  return sparqueConfig.server_url
    .concat('/api/', sparqueConfig.wrapperAPI)
    .concat(endpoint)
    .concat('?ApiName=')
    .concat(sparqueConfig.ApiName)
    .concat('&WorkspaceName=')
    .concat(sparqueConfig.WorkspaceName)
    .concat('&ChannelId=')
    .concat(sparqueConfig.ChannelId)
    .concat('&Locale=en-US');
}

// testing here is handled by http testing controller
/* eslint-disable ish-custom-rules/use-async-synchronization-in-tests */

describe('Sparque Api Service', () => {
  describe('Sparque API Service Methods', () => {
    let sparqueApiService: SparqueApiService;
    let store: Store;
    let httpTestingController: HttpTestingController;
    const featureToggleServiceMock = mock(FeatureToggleService);
    const apiTokenServiceMock = mock(ApiTokenService);
    const tokenServiceMock = mock(TokenService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
          { provide: FeatureToggleService, useFactory: () => instance(featureToggleServiceMock) },
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

    it('should call the httpClient.options method when sparqueApiService.options method is called.', done => {
      sparqueApiService.options('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/data'));
      req.flush({});
      expect(req.request.method).toEqual('OPTIONS');
    });

    it('should create Error Action if httpClient.options throws Error.', () => {
      const statusText = 'ERROR';

      sparqueApiService.options('data').subscribe({ next: fail, error: fail });
      const req = httpTestingController.expectOne(getRestURL('/data'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(store.dispatch(anything())).once();
      const [action] = capture<Action & { payload: { error: HttpError } }>(store.dispatch).last();
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
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

    it('should create Error Action if httpClient.get throws Error.', () => {
      const statusText = 'ERROR';

      sparqueApiService.get('data').subscribe({ next: fail, error: fail });
      const req = httpTestingController.expectOne(getRestURL('/data'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(store.dispatch(anything())).once();
      const [action] = capture<Action & { payload: { error: HttpError } }>(store.dispatch).last();
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.put method when sparqueApiService.put method is called.', done => {
      sparqueApiService.put('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/data'));
      req.flush({});
      expect(req.request.method).toEqual('PUT');
    });

    it('should call the httpClient.patch method when sparqueApiService.patch method is called.', done => {
      sparqueApiService.patch('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/data'));
      req.flush({});
      expect(req.request.method).toEqual('PATCH');
    });

    it('should call the httpClient.post method when sparqueApiService.post method is called.', done => {
      sparqueApiService.post('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/data'));
      req.flush({});
      expect(req.request.method).toEqual('POST');
    });

    it('should call the httpClient.delete method when sparqueApiService.delete method is called.', done => {
      sparqueApiService.delete('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(getRestURL('/data'));
      req.flush({});
      expect(req.request.method).toEqual('DELETE');
    });

    describe('Encode Resource ID', () => {
      it('should return a double encoded string if legacyEncoding is on', () => {
        when(featureToggleServiceMock.enabled('legacyEncoding')).thenReturn(true);

        expect(sparqueApiService.encodeResourceId('123456abc')).toEqual(`123456abc`);
        expect(sparqueApiService.encodeResourceId('d.ori+6@test.intershop.de')).toEqual(
          `d.ori%252B6%2540test.intershop.de`
        );
        expect(sparqueApiService.encodeResourceId('pmiller@test.intershop.de')).toEqual(
          `pmiller%2540test.intershop.de`
        );
      });

      it('should  return a single encoded string if legacyEncoding is off', () => {
        when(featureToggleServiceMock.enabled('legacyEncoding')).thenReturn(false);

        expect(sparqueApiService.encodeResourceId('123456abc')).toEqual(`123456abc`);
        expect(sparqueApiService.encodeResourceId('d.ori+6@test.intershop.de')).toEqual(`d.ori+6%40test.intershop.de`);
        expect(sparqueApiService.encodeResourceId('pmiller@test.intershop.de')).toEqual(`pmiller%40test.intershop.de`);
      });
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
      sparqueApiService.get('route').subscribe({ next: fail, error: fail, complete: done });

      httpTestingController
        .expectOne(() => true)
        .flush('', {
          status: 0,
          statusText: 'Error',
        });

      verify(store.dispatch(anything())).once();
      expect(capture(store.dispatch).last()?.[0]).toMatchInlineSnapshot(`
        [Error Internal] Communication Timeout Error:
          error: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers"...
      `);
    });

    it('should dispatch general errors when getting status 500', done => {
      sparqueApiService.get('route').subscribe({ next: fail, error: fail, complete: done });

      httpTestingController
        .expectOne(() => true)
        .flush('', {
          status: 500,
          statusText: 'Error',
        });

      verify(store.dispatch(anything())).once();
      expect(capture(store.dispatch).last()?.[0]).toMatchInlineSnapshot(`
        [Error Internal] Server Error (5xx):
          error: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers"...
      `);
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
