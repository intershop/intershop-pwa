import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as using from 'jasmine-data-provider';
import { noop } from 'rxjs';
import { anything, capture, spy, verify } from 'ts-mockito';

import { Link } from 'ish-core/models/link/link.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { applyConfiguration, getICMServerURL, getRestEndpoint } from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { serverError } from 'ish-core/store/core/error';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { setAPIToken } from 'ish-core/store/customer/user';

import { ApiService, constructUrlForPath, resolveLink, resolveLinks, unpackEnvelope } from './api.service';
import { ApiServiceErrorHandler } from './api.service.errorhandler';

describe('Api Service', () => {
  describe('API Service Methods', () => {
    const REST_URL = 'http://www.example.org/WFS/site/-';
    let apiService: ApiService;
    let storeSpy$: Store;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          ApiServiceErrorHandler,
          ApiService,
          provideMockStore({ selectors: [{ selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' }] }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      storeSpy$ = spy(TestBed.inject(Store));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should call the httpClient.options method when apiService.options method is called.', done => {
      apiService.options('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('OPTIONS');
    });

    it('should create Error Action if httpClient.options throws Error.', () => {
      const statusText = 'ERROAAR';

      apiService.options('data').subscribe(fail, fail);
      const req = httpTestingController.expectOne(`${REST_URL}/data`);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(storeSpy$.dispatch(anything())).once();
      // tslint:disable-next-line: no-any
      const [action] = capture(storeSpy$.dispatch).last() as any;
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.get method when apiService.get method is called.', done => {
      apiService.get('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('GET');
    });

    it('should create Error Action if httpClient.get throws Error.', () => {
      const statusText = 'ERROAAR';

      apiService.get('data').subscribe(fail, fail);
      const req = httpTestingController.expectOne(`${REST_URL}/data`);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(storeSpy$.dispatch(anything())).once();
      // tslint:disable-next-line: no-any
      const [action] = capture(storeSpy$.dispatch).last() as any;
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.put method when apiService.put method is called.', done => {
      apiService.put('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PUT');
    });

    it('should call the httpClient.patch method when apiService.patch method is called.', done => {
      apiService.patch('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PATCH');
    });

    it('should call the httpClient.post method when apiService.post method is called.', done => {
      apiService.post('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('POST');
    });

    it('should call the httpClient.delete method when apiService.delete method is called.', done => {
      apiService.delete('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('API Service Helper Methods', () => {
    describe('constructUrlForPath()', () => {
      const BASE_URL = 'http://example.org/site';
      const JP = { lang: 'jp', currency: 'YEN' } as Locale;

      it('should throw when asked for an unsupported method', () => {
        // tslint:disable-next-line:no-any
        expect(() => constructUrlForPath('relative', 'HEAD' as any, BASE_URL, undefined, undefined)).toThrowError(
          'unhandled'
        );
      });

      using(
        [
          { path: 'http://google.de', method: 'GET', expected: 'http://google.de' },
          { path: 'http://google.de', method: 'OPTIONS', expected: 'http://google.de' },
          { path: 'http://google.de', method: 'POST', expected: 'http://google.de' },
          { path: 'http://google.de', method: 'PATCH', expected: 'http://google.de' },
          { path: 'http://google.de', method: 'PUT', expected: 'http://google.de' },
          { path: 'http://google.de', method: 'DELETE', expected: 'http://google.de' },
          { path: 'https://bing.de', method: 'GET', expected: 'https://bing.de' },
          { path: 'https://bing.de', method: 'OPTIONS', expected: 'https://bing.de' },
          { path: 'https://bing.de', method: 'POST', expected: 'https://bing.de' },
          { path: 'https://bing.de', method: 'PATCH', expected: 'https://bing.de' },
          { path: 'https://bing.de', method: 'PUT', expected: 'https://bing.de' },
          { path: 'https://bing.de', method: 'DELETE', expected: 'https://bing.de' },
          { path: 'relative', method: 'GET', expected: 'http://example.org/site/relative' },
          { path: 'relative', method: 'OPTIONS', expected: 'http://example.org/site/relative' },
          { path: 'relative', method: 'POST', expected: 'http://example.org/site/relative' },
          { path: 'relative', method: 'PATCH', expected: 'http://example.org/site/relative' },
          { path: 'relative', method: 'PUT', expected: 'http://example.org/site/relative' },
          { path: 'relative', method: 'DELETE', expected: 'http://example.org/site/relative' },
          { path: 'relative', method: 'GET', expected: 'http://example.org/site;loc=jp;cur=YEN/relative', lang: JP },
          {
            path: 'relative',
            method: 'OPTIONS',
            expected: 'http://example.org/site;loc=jp;cur=YEN/relative',
            lang: JP,
          },
          { path: 'relative', method: 'POST', expected: 'http://example.org/site;loc=jp;cur=YEN/relative', lang: JP },
          { path: 'relative', method: 'PATCH', expected: 'http://example.org/site;loc=jp;cur=YEN/relative', lang: JP },
          { path: 'relative', method: 'PUT', expected: 'http://example.org/site;loc=jp;cur=YEN/relative', lang: JP },
          { path: 'relative', method: 'DELETE', expected: 'http://example.org/site;loc=jp;cur=YEN/relative', lang: JP },
        ],
        slice => {
          it(`should return '${slice.expected}' when constructing ${slice.method} request from '${slice.path}' ${
            slice.lang ? `with locale '${slice.lang.lang}'` : 'with no locale'
          }`, () => {
            expect(constructUrlForPath(slice.path, slice.method, BASE_URL, slice.lang, undefined)).toEqual(
              slice.expected
            );
          });
        }
      );
    });
  });

  describe('API Service Pipable Operators', () => {
    let httpTestingController: HttpTestingController;
    let apiService: ApiService;

    const REST_URL = 'http://www.example.org/WFS/site/-';
    const categoriesPath = `${REST_URL}/categories`;
    const webcamsPath = `${categoriesPath}/Cameras-Camcorders/577`;
    const webcamResponse = {
      name: 'Webcams',
      description: 'The camera products and services catalog.',
      id: '577',
    };
    const webcamLink = {
      type: 'Link',
      uri: 'site/-/categories/Cameras-Camcorders/577',
    };
    const categoriesResponse = {
      elements: [webcamLink],
      id: 'Cameras-Camcorders',
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ApiServiceErrorHandler,
          ApiService,
          provideMockStore({
            selectors: [
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: 'http://www.example.org/WFS' },
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
        .pipe(unpackEnvelope(), resolveLinks(apiService))
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
        .pipe(resolveLinks(apiService))
        .subscribe(data => {
          expect(data).toHaveLength(1);
          done();
        });

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      req.flush([{ uri: 'site/-/dummy1' }, { type: 'Link', uri: 'site/-/dummy2' }, { type: 'Link' }] as Link[]);

      httpTestingController.expectNone(`${REST_URL}/dummy1`);
      httpTestingController.expectOne(`${REST_URL}/dummy2`).flush({});
      httpTestingController.expectNone(`${REST_URL}/dummy3`);
    });

    it('should return empty array on link translation when no links are available', done => {
      apiService
        .get('something')
        .pipe(resolveLinks(apiService))
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
        .pipe(unpackEnvelope(), resolveLinks(apiService))
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
        .pipe(resolveLink(apiService))
        .subscribe(data => {
          expect(data).toHaveProperty('data', 'dummy');
          done();
        });

      httpTestingController.expectOne(`${REST_URL}/something`).flush({ type: 'Link', uri: 'site/-/dummy' });

      httpTestingController.expectOne(`${REST_URL}/dummy`).flush({ data: 'dummy' });
    });

    it('should not resolve data when resolveLink is used and an invalid link is supplied', done => {
      apiService
        .get('something')
        .pipe(resolveLink(apiService))
        .subscribe(
          fail,
          err => {
            expect(err).toBeTruthy();
            done();
          },
          fail
        );

      httpTestingController.expectOne(`${REST_URL}/something`).flush({ uri: 'site/-/dummy' });

      httpTestingController.expectNone(`${REST_URL}/dummy`);
    });
  });

  describe('API Service Headers', () => {
    const REST_URL = 'http://www.example.org/WFS/site/-;loc=en_US;cur=USD';
    let apiService: ApiService;
    let store$: Store;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [
          CoreStoreModule.forTesting(['configuration']),
          CustomerStoreModule.forTesting('user'),
          HttpClientTestingModule,
        ],
        providers: [ApiServiceErrorHandler, ApiService],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store$ = TestBed.inject(Store);

      store$.dispatch(applyConfiguration({ baseURL: 'http://www.example.org', server: 'WFS', channel: 'site' }));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should always have default headers', () => {
      apiService.get('dummy').subscribe(fail, fail, fail);

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
        .subscribe(fail, fail, fail);

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
        .subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/xml');
      expect(req.request.headers.get('Accept')).toEqual('application/xml');
    });

    it('should not have a token, when no token is in store', () => {
      apiService.get('dummy').subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.has(ApiService.TOKEN_HEADER_KEY)).toBeFalse();
    });

    it('should have a token, when token is in store', () => {
      const apiToken = 'blubb';
      store$.dispatch(setAPIToken({ apiToken }));
      apiService.get('dummy').subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.has(ApiService.TOKEN_HEADER_KEY)).toBeTrue();
      expect(req.request.headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual(apiToken);
    });

    it('should not have a token, when request is authorization request', () => {
      const apiToken = 'blubb';
      store$.dispatch(setAPIToken({ apiToken }));
      apiService
        .get('dummy', { headers: new HttpHeaders().set(ApiService.AUTHORIZATION_HEADER_KEY, 'dummy') })
        .subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.has(ApiService.TOKEN_HEADER_KEY)).toBeFalse();
    });

    it('should set Captcha V2 authorization header key when captcha is supplied without captchaAction', () => {
      apiService.get('dummy', { captcha: { captcha: 'captchatoken' } }).subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.get(ApiService.AUTHORIZATION_HEADER_KEY)).toMatchInlineSnapshot(
        `"CAPTCHA g-recaptcha-response=captchatoken foo=bar"`
      );
    });

    it('should set Captcha V3 authorization header key when captcha is supplied', () => {
      apiService
        .get('dummy', { captcha: { captcha: 'captchatoken', captchaAction: 'create_account' } })
        .subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.get(ApiService.AUTHORIZATION_HEADER_KEY)).toMatchInlineSnapshot(
        `"CAPTCHA recaptcha_token=captchatoken action=create_account"`
      );
    });

    it('should not set header when captcha config object is empty', () => {
      apiService.get('dummy', { captcha: {} }).subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.get(ApiService.AUTHORIZATION_HEADER_KEY)).toBeFalsy();
    });
  });
});
