import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { noop } from 'rxjs';
import { anything, capture, spy, verify } from 'ts-mockito';

import { Link } from 'ish-core/models/link/link.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import {
  applyConfiguration,
  getCurrentLocale,
  getICMServerURL,
  getRestEndpoint,
} from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { serverError } from 'ish-core/store/core/error';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { getPGID } from 'ish-core/store/customer/user';

import { ApiService, unpackEnvelope } from './api.service';

// testing here is handled by http testing controller
// tslint:disable: use-async-synchronization-in-tests

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
          provideMockStore({
            selectors: [
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: undefined },
              { selector: getCurrentLocale, value: undefined },
              { selector: getPGID, value: undefined },
            ],
          }),
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
  });

  describe('API Service Pipeable Operators', () => {
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
          provideMockStore({
            selectors: [
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: 'http://www.example.org/WFS' },
              { selector: getCurrentLocale, value: undefined },
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
      req.flush([{ uri: 'site/-/dummy1' }, { type: 'Link', uri: 'site/-/dummy2' }, { type: 'Link' }] as Link[]);

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

      httpTestingController.expectOne(`${REST_URL}/something`).flush({ type: 'Link', uri: 'site/-/dummy' });

      httpTestingController.expectOne(`${REST_URL}/dummy`).flush({ data: 'dummy' });
    });

    it('should not resolve data when resolveLink is used and an invalid link is supplied', done => {
      apiService
        .get('something')
        .pipe(apiService.resolveLink())
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

    it('should append additional headers when resolveLink is used with header options', () => {
      const someHeader = { headers: new HttpHeaders({ dummy: 'linkHeaderTest' }) };

      apiService.get('something', someHeader).pipe(apiService.resolveLink(someHeader)).subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      expect(req.request.headers.get('dummy')).toEqual('linkHeaderTest');
      req.flush({ type: 'Link', uri: 'site/-/dummy' });

      const req2 = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req2.request.headers.get('dummy')).toEqual('linkHeaderTest');
    });

    it('should append additional headers to all link requests when resolveLinks is used with header options', () => {
      const someHeader = { headers: new HttpHeaders({ dummy: 'linkHeaderTest' }) };

      apiService.get('something', someHeader).pipe(apiService.resolveLinks(someHeader)).subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      expect(req.request.headers.get('dummy')).toEqual('linkHeaderTest');
      req.flush([
        { type: 'Link', uri: 'site/-/dummy1' },
        { type: 'Link', uri: 'site/-/dummy2' },
      ] as Link[]);

      const req2 = httpTestingController.expectOne(`${REST_URL}/dummy1`);
      expect(req2.request.headers.get('dummy')).toEqual('linkHeaderTest');
      const req3 = httpTestingController.expectOne(`${REST_URL}/dummy2`);
      expect(req3.request.headers.get('dummy')).toEqual('linkHeaderTest');
    });
  });

  describe('API Service URL construction', () => {
    let apiService: ApiService;
    let store$: MockStore;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({
            selectors: [
              { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
              { selector: getICMServerURL, value: undefined },
              { selector: getCurrentLocale, value: undefined },
              { selector: getPGID, value: undefined },
            ],
          }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store$ = TestBed.inject(MockStore);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should bypass URL construction when path is an external link', () => {
      apiService.get('http://google.de').subscribe(fail, fail, fail);

      httpTestingController.expectOne('http://google.de');
    });

    it('should bypass URL construction when path is an external secure link', () => {
      apiService.get('https://google.de').subscribe(fail, fail, fail);

      httpTestingController.expectOne('https://google.de');
    });

    it('should construct a URL based on ICM REST API when supplying a relative URL', () => {
      apiService.get('relative').subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(`"http://www.example.org/WFS/site/-/relative"`);
    });

    it('should include query params when supplied', () => {
      apiService
        .get('relative', { params: new HttpParams().set('view', 'grid').set('depth', '3') })
        .subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/relative?view=grid&depth=3"`
      );
    });

    it('should construct a URL based on ICM REST API when supplying a deep relative URL', () => {
      apiService.get('very/deep/relative/url').subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/very/deep/relative/url"`
      );
    });

    it('should include locale and currency when available in store', () => {
      store$.overrideSelector(getCurrentLocale, { currency: 'USD', lang: 'en_US' } as Locale);

      apiService.get('relative').subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-;loc=en_US;cur=USD/relative"`
      );
    });

    it('should include pgid when available in store and requested', () => {
      store$.overrideSelector(getPGID, 'ASDF');

      apiService.get('relative', { sendPGID: true }).subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/relative;pgid=ASDF"`
      );
    });

    it('should include spgid when available in store and requested', () => {
      store$.overrideSelector(getPGID, 'ASDF');

      apiService.get('relative', { sendSPGID: true }).subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/relative;spgid=ASDF"`
      );
    });

    it('should include pgid on first path element when available in store and requested', () => {
      store$.overrideSelector(getPGID, 'ASDF');

      apiService.get('very/deep/relative', { sendPGID: true }).subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-/very;pgid=ASDF/deep/relative"`
      );
    });

    it('should include params, pgid and locale for complex example', () => {
      store$.overrideSelector(getPGID, 'ASDF');
      store$.overrideSelector(getCurrentLocale, { currency: 'USD', lang: 'en_US' } as Locale);

      apiService
        .get('very/deep/relative', { sendPGID: true, params: new HttpParams().set('view', 'grid').set('depth', '3') })
        .subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/WFS/site/-;loc=en_US;cur=USD/very;pgid=ASDF/deep/relative?view=grid&depth=3"`
      );
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

    it('should have default response type of "json" if no other is provided', () => {
      apiService.get('dummy').subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.responseType).toEqual('json');
    });

    it('should append specific response type of "text" if provided', () => {
      apiService.get('dummy', { responseType: 'text' }).subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.responseType).toEqual('text');
    });
  });

  describe('API Service exclusive runs', () => {
    let apiService: ApiService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({
            selectors: [
              { selector: getICMServerURL, value: undefined },
              { selector: getRestEndpoint, value: 'http://www.example.org' },
              { selector: getCurrentLocale, value: undefined },
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

    it('should run call exclusively when asked for it', done => {
      let syncData: unknown;

      apiService.get('dummy1', { runExclusively: true }).subscribe(data => {
        expect(data).toBeTruthy();
        syncData = data;
      });

      const req1 = httpTestingController.expectOne(`http://www.example.org/dummy1`);

      setTimeout(() => {
        req1.flush('TEST1');
      }, 200);

      apiService.get('dummy2').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST1');
      });

      apiService.get('dummy3').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST1');
        done();
      });

      httpTestingController.verify();
      setTimeout(() => httpTestingController.verify(), 50);
      setTimeout(() => httpTestingController.verify(), 100);
      setTimeout(() => httpTestingController.verify(), 150);

      setTimeout(() => {
        const req2 = httpTestingController.expectOne(`http://www.example.org/dummy2`);
        req2.flush('TEST2');
      }, 250);
      setTimeout(() => {
        const req3 = httpTestingController.expectOne(`http://www.example.org/dummy3`);
        req3.flush('TEST3');
      }, 300);
    });

    it('should run calls in parallel if not explicitly run exclusively', done => {
      let syncData: unknown;

      apiService.get('dummy1').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST2');
        syncData = data;
      });

      const req1 = httpTestingController.expectOne(`http://www.example.org/dummy1`);

      apiService.get('dummy2').subscribe(data => {
        expect(data).toBeTruthy();
        syncData = data;
      });

      const req2 = httpTestingController.expectOne(`http://www.example.org/dummy2`);

      apiService.get('dummy3').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST1');
        done();
      });

      const req3 = httpTestingController.expectOne(`http://www.example.org/dummy3`);

      setTimeout(() => {
        req1.flush('TEST1');
      }, 200);
      setTimeout(() => {
        req2.flush('TEST2');
      }, 150);
      setTimeout(() => {
        req3.flush('TEST3');
      }, 300);
    });
  });
});
