import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { noop } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Link } from 'ish-core/models/link/link.model';
import {
  applyConfiguration,
  getCurrentCurrency,
  getCurrentLocale,
  getICMServerURL,
  getRestEndpoint,
} from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { serverError } from 'ish-core/store/core/error';
import { isServerConfigurationLoaded, loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { getPGID } from 'ish-core/store/customer/user';

import { ApiService, unpackEnvelope } from './api.service';

// testing here is handled by http testing controller
/* eslint-disable ish-custom-rules/use-async-synchronization-in-tests */

describe('Api Service', () => {
  describe('API Service Methods', () => {
    const REST_URL = 'http://www.example.org/WFS/site/-;loc=en;cur=USD';
    let apiService: ApiService;
    let store: Store;
    let httpTestingController: HttpTestingController;
    const featureToggleServiceMock = mock(FeatureToggleService);

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          { provide: FeatureToggleService, useFactory: () => instance(featureToggleServiceMock) },
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: undefined },
              { selector: getCurrentCurrency, value: 'USD' },
              { selector: getCurrentLocale, value: 'en' },
              { selector: getPGID, value: undefined },
            ],
          }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store = spy(TestBed.inject(Store));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should call the httpClient.options method when apiService.options method is called.', done => {
      // eslint-disable-next-line etc/no-deprecated
      apiService.options('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('OPTIONS');
    });

    it('should create Error Action if httpClient.options throws Error.', () => {
      const statusText = 'ERROR';

      // eslint-disable-next-line etc/no-deprecated
      apiService.options('data').subscribe({ next: fail, error: fail });
      const req = httpTestingController.expectOne(`${REST_URL}/data`);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(store.dispatch(anything())).once();
      const [action] = capture<Action & { payload: { error: HttpError } }>(store.dispatch).last();
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.get method when apiService.get method is called.', done => {
      apiService.get('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('GET');
    });

    it('should create Error Action if httpClient.get throws Error.', () => {
      const statusText = 'ERROR';

      apiService.get('data').subscribe({ next: fail, error: fail });
      const req = httpTestingController.expectOne(`${REST_URL}/data`);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(store.dispatch(anything())).once();
      const [action] = capture<Action & { payload: { error: HttpError } }>(store.dispatch).last();
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.put method when apiService.put method is called.', done => {
      apiService.put('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PUT');
    });

    it('should call the httpClient.patch method when apiService.patch method is called.', done => {
      apiService.patch('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PATCH');
    });

    it('should call the httpClient.post method when apiService.post method is called.', done => {
      apiService.post('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('POST');
    });

    it('should call the httpClient.delete method when apiService.delete method is called.', done => {
      apiService.delete('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('DELETE');
    });

    describe('Encode Resource ID', () => {
      it('should return a double encoded string if legacyEncoding is on', () => {
        when(featureToggleServiceMock.enabled('legacyEncoding')).thenReturn(true);

        expect(apiService.encodeResourceId('123456abc')).toEqual(`123456abc`);
        expect(apiService.encodeResourceId('d.ori+6@test.intershop.de')).toEqual(`d.ori%252B6%2540test.intershop.de`);
        expect(apiService.encodeResourceId('pmiller@test.intershop.de')).toEqual(`pmiller%2540test.intershop.de`);
      });

      it('should  return a single encoded string if legacyEncoding is off', () => {
        when(featureToggleServiceMock.enabled('legacyEncoding')).thenReturn(false);

        expect(apiService.encodeResourceId('123456abc')).toEqual(`123456abc`);
        expect(apiService.encodeResourceId('d.ori+6@test.intershop.de')).toEqual(`d.ori+6%40test.intershop.de`);
        expect(apiService.encodeResourceId('pmiller@test.intershop.de')).toEqual(`pmiller%40test.intershop.de`);
      });
    });
  });

  describe('API Service Pipeable Operators', () => {
    let httpTestingController: HttpTestingController;
    let apiService: ApiService;

    const REST_URL = 'http://www.example.org/WFS/site/-;loc=en;cur=USD';
    const REST_URL_PART = REST_URL.replace(/.*\/site/, 'site');
    const categoriesPath = `${REST_URL}/categories`;
    const webcamsPath = `${categoriesPath}/Cameras-Camcorders/577`;
    const webcamResponse = {
      name: 'Webcams',
      description: 'The camera products and services catalog.',
      id: '577',
    };
    const webcamLink = {
      type: 'Link',
      uri: webcamsPath.replace(/.*\/site/, 'site'),
    };
    const categoriesResponse = {
      elements: [webcamLink],
      id: 'Cameras-Camcorders',
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: 'http://www.example.org/WFS' },
              { selector: getCurrentCurrency, value: 'USD' },
              { selector: getCurrentLocale, value: 'en' },
              { selector: getPGID, value: undefined },
            ],
          }),
        ],
      });
      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should perform element translation when it is requested', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope())
        .subscribe(data => {
          expect(data).toEqual([webcamLink]);
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush(categoriesResponse);

      httpTestingController.expectNone(webcamsPath);
    });

    it('should return empty array on element translation when no elements are found', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope())
        .subscribe(data => {
          expect(data).toBeEmpty();
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush({});

      httpTestingController.expectNone(webcamsPath);
    });

    it('should not perform element or link translation when it is not requested', done => {
      apiService.get('categories').subscribe(data => {
        expect(data).toEqual(categoriesResponse);
        done();
      });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush(categoriesResponse);

      httpTestingController.expectNone(webcamsPath);
    });

    it('should perform both operations when requested', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope(), apiService.resolveLinks())
        .subscribe(data => {
          expect(data).toEqual([webcamResponse]);
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush(categoriesResponse);

      const req2 = httpTestingController.expectOne(webcamsPath);
      req2.flush(webcamResponse);
    });

    it('should filter out elements that are not links when doing link translation', done => {
      apiService
        .get('something')
        .pipe(apiService.resolveLinks())
        .subscribe(data => {
          expect(data).toHaveLength(1);
          done();
        });

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      req.flush([
        { uri: `${REST_URL_PART}/dummy1` },
        { type: 'Link', uri: `${REST_URL_PART}/dummy2` },
        { type: 'Link' },
      ] as Link[]);

      httpTestingController.expectNone(`${REST_URL}/dummy1`);
      httpTestingController.expectOne(`${REST_URL}/dummy2`).flush({});
      httpTestingController.expectNone(`${REST_URL}/dummy3`);
    });

    it('should return empty array on link translation when no links are available', done => {
      apiService
        .get('something')
        .pipe(apiService.resolveLinks())
        .subscribe(data => {
          expect(data).toBeEmpty();
          done();
        });

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      req.flush([]);
    });

    it('should return empty array on element and link translation when source is empty', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope(), apiService.resolveLinks())
        .subscribe(data => {
          expect(data).toBeEmpty();
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush({});
    });

    it('should resolve data when resolveLink is used', done => {
      apiService
        .get('something')
        .pipe(apiService.resolveLink())
        .subscribe(data => {
          expect(data).toHaveProperty('data', 'dummy');
          done();
        });

      httpTestingController.expectOne(`${REST_URL}/something`).flush({ type: 'Link', uri: `${REST_URL_PART}/dummy` });

      httpTestingController.expectOne(`${REST_URL}/dummy`).flush({ data: 'dummy' });
    });

    it('should not resolve data when resolveLink is used and an invalid link is supplied', done => {
      apiService
        .get('something')
        .pipe(apiService.resolveLink())
        .subscribe({
          next: fail,
          error: err => {
            expect(err).toBeTruthy();
            done();
          },
          complete: fail,
        });

      httpTestingController.expectOne(`${REST_URL}/something`).flush({ uri: `${REST_URL_PART}/dummy` });

      httpTestingController.expectNone(`${REST_URL}/dummy`);
    });

    it('should append additional headers when resolveLink is used with header options', () => {
      const someHeader = { headers: new HttpHeaders({ dummy: 'linkHeaderTest' }) };

      apiService
        .get('something', someHeader)
        .pipe(apiService.resolveLink(someHeader))
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      expect(req.request.headers.get('dummy')).toEqual('linkHeaderTest');
      req.flush({ type: 'Link', uri: `${REST_URL_PART}/dummy` });

      const req2 = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req2.request.headers.get('dummy')).toEqual('linkHeaderTest');
    });

    it('should append additional headers to all link requests when resolveLinks is used with header options', () => {
      const someHeader = { headers: new HttpHeaders({ dummy: 'linkHeaderTest' }) };

      apiService
        .get('something', someHeader)
        .pipe(apiService.resolveLinks(someHeader))
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      expect(req.request.headers.get('dummy')).toEqual('linkHeaderTest');
      req.flush([
        { type: 'Link', uri: `${REST_URL_PART}/dummy1` },
        { type: 'Link', uri: `${REST_URL_PART}/dummy2` },
      ] as Link[]);

      const req2 = httpTestingController.expectOne(`${REST_URL}/dummy1`);
      expect(req2.request.headers.get('dummy')).toEqual('linkHeaderTest');
      const req3 = httpTestingController.expectOne(`${REST_URL}/dummy2`);
      expect(req3.request.headers.get('dummy')).toEqual('linkHeaderTest');
    });
  });

  describe('API Service URL construction', () => {
    let apiService: ApiService;
    let store: MockStore;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: undefined },
              { selector: getCurrentLocale, value: undefined },
              { selector: getCurrentCurrency, value: undefined },
              { selector: getPGID, value: undefined },
            ],
          }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store = TestBed.inject(MockStore);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should bypass URL construction when path is an external link', () => {
      apiService.get('http://google.de').subscribe({ next: fail, error: fail, complete: fail });

      httpTestingController.expectOne('http://google.de');
    });

    it('should bypass URL construction when path is an external secure link', () => {
      apiService.get('https://google.de').subscribe({ next: fail, error: fail, complete: fail });

      httpTestingController.expectOne('https://google.de');
    });

    it('should construct a URL based on ICM REST API when supplying a relative URL without sending locale or currency', () => {
      apiService
        .get('relative', { sendLocale: false, sendCurrency: false })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(`"http://www.example.org/WFS/site/-/relative"`);
    });

    it('should include query params when supplied', () => {
      apiService
        .get('relative', {
          params: new HttpParams().set('view', 'grid').set('depth', '3'),
          sendLocale: false,
          sendCurrency: false,
        })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/relative?view=grid&depth=3"`
      );
    });

    it('should construct a URL based on ICM REST API when supplying a deep relative URL', () => {
      apiService
        .get('very/deep/relative/url', { sendLocale: false, sendCurrency: false })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/very/deep/relative/url"`
      );
    });

    it('should include locale and currency when available in store', () => {
      store.overrideSelector(getCurrentLocale, 'en_US');
      store.overrideSelector(getCurrentCurrency, 'USD');

      apiService.get('relative').subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-;loc=en_US;cur=USD/relative"`
      );
    });

    it('should include pgid when available in store and requested', () => {
      store.overrideSelector(getPGID, 'ASDF');

      apiService
        .get('relative', { sendPGID: true, sendLocale: false, sendCurrency: false })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/relative;pgid=ASDF"`
      );
    });

    it('should include spgid when available in store and requested', () => {
      store.overrideSelector(getPGID, 'ASDF');

      apiService
        .get('relative', { sendSPGID: true, sendLocale: false, sendCurrency: false })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/relative;spgid=ASDF"`
      );
    });

    it('should include pgid on first path element when available in store and requested', () => {
      store.overrideSelector(getPGID, 'ASDF');

      apiService
        .get('very/deep/relative', { sendPGID: true, sendLocale: false, sendCurrency: false })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/very;pgid=ASDF/deep/relative"`
      );
    });

    it('should include params, pgid and locale for complex example', () => {
      store.overrideSelector(getPGID, 'ASDF');
      store.overrideSelector(getCurrentLocale, 'en_US');
      store.overrideSelector(getCurrentCurrency, 'USD');

      apiService
        .get('very/deep/relative', { sendPGID: true, params: new HttpParams().set('view', 'grid').set('depth', '3') })
        .subscribe({ next: fail, error: fail, complete: fail });

      const requests = httpTestingController.match(x => !!x);
      expect(requests).toHaveLength(1);
      expect(requests[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-;loc=en_US;cur=USD/very;pgid=ASDF/deep/relative?view=grid&depth=3"`
      );
    });
  });

  describe('API Service Headers', () => {
    const REST_URL = 'http://www.example.org/WFS/site/-;loc=en_US;cur=USD';
    let apiService: ApiService;
    let store: Store;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [CoreStoreModule.forTesting(['configuration', 'serverConfig']), HttpClientTestingModule],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store = TestBed.inject(Store);

      store.dispatch(
        applyConfiguration({
          baseURL: 'http://www.example.org',
          server: 'WFS',
          channel: 'site',
          defaultLocale: 'en_US',
        })
      );
      store.dispatch(
        loadServerConfigSuccess({
          config: {
            general: {
              locales: ['en_US'],
              currencies: ['USD'],
            },
          },
        })
      );
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should always have default headers', () => {
      apiService.get('dummy').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always append additional headers', () => {
      apiService
        .get('dummy', {
          headers: new HttpHeaders({
            dummy: 'test',
          }),
        })
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.has('dummy')).toBeTrue();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always have overridable default headers', () => {
      apiService
        .get('dummy', {
          headers: new HttpHeaders({
            Accept: 'application/xml',
            'content-type': 'application/xml',
          }),
        })
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/xml');
      expect(req.request.headers.get('Accept')).toEqual('application/xml');
    });

    it('should set Captcha V2 authorization header key when captcha is supplied without captchaAction', () => {
      apiService.get('dummy', { captcha: { captcha: 'token' } }).subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.get(ApiService.AUTHORIZATION_HEADER_KEY)).toMatchInlineSnapshot(
        `"CAPTCHA g-recaptcha-response=token foo=bar"`
      );
    });

    it('should set Captcha V3 authorization header key when captcha is supplied', () => {
      apiService
        .get('dummy', { captcha: { captcha: 'token', captchaAction: 'create_account' } })
        .subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.get(ApiService.AUTHORIZATION_HEADER_KEY)).toMatchInlineSnapshot(
        `"CAPTCHA recaptcha_token=token action=create_account"`
      );
    });

    it('should not set header when captcha config object is empty', () => {
      apiService.get('dummy', { captcha: {} }).subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.get(ApiService.AUTHORIZATION_HEADER_KEY)).toBeFalsy();
    });

    it('should have default response type of "json" if no other is provided', () => {
      apiService.get('dummy').subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.responseType).toEqual('json');
    });

    it('should append specific response type of "text" if provided', () => {
      apiService.get('dummy', { responseType: 'text' }).subscribe({ next: fail, error: fail, complete: fail });

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.responseType).toEqual('text');
    });
  });

  describe('API Service general error handling', () => {
    let apiService: ApiService;
    let httpTestingController: HttpTestingController;
    let store: Store;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({
            selectors: [
              { selector: isServerConfigurationLoaded, value: true },
              { selector: getICMServerURL, value: undefined },
              { selector: getRestEndpoint, value: 'http://www.example.org' },
              { selector: getCurrentLocale, value: 'en' },
              { selector: getCurrentCurrency, value: 'USD' },
              { selector: getPGID, value: undefined },
            ],
          }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store = spy(TestBed.inject(Store));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should dispatch communication timeout errors when getting status 0', done => {
      apiService.get('route').subscribe({ next: fail, error: fail, complete: done });

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
      apiService.get('route').subscribe({ next: fail, error: fail, complete: done });

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
      apiService.get('route').subscribe({
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
