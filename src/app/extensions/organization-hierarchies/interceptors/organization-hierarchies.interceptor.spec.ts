import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { OrganizationHierarchiesInterceptor } from './organization-hierarchies.interceptor';

describe('Organization Hierarchies Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  const buyingContext = 'Testgroup@TestCompany';
  const SITE = 'site';
  const BASE_URL = 'http://example.org';
  const SERVER = 'INTERSHOP/rest/WFS';
  const OHS_BASEURL = 'http://host.docker.internal:8081';
  const SEP = '/';
  const URL = BASE_URL.concat(SEP, SERVER, SEP, SITE, SEP, '-');

  const BASKETS_ENDPOINT = '/baskets';
  const ORGANIZATIONS_ENDPOINT = '/organizations';

  describe('ICM service is available', () => {
    const initialState = {
      organizationHierarchies: {
        buyingContext: {
          bctx: buyingContext,
        },
      },
      configuration: {
        serverTranslations: {},
        channel: SITE,
        multiSiteLocaleMap: { en_US: '/en' },
        baseURL: BASE_URL,
        server: SERVER,
      },
      serverConfig: {
        _config: { services: { OrganizationHierarchyServiceDefinition: { runnable: true, Endpoint: OHS_BASEURL } } },
      },
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: OrganizationHierarchiesInterceptor, multi: true },
          provideMockStore({
            initialState,
          }),
        ],
      });

      httpController = TestBed.inject(HttpTestingController);
      http = TestBed.inject(HttpClient);
      TestBed.inject(Store);
    });

    afterEach(() => {
      httpController.verify();
    });

    it('should not insert the buyingContext => wrong REST Endpoint', done => {
      http.get(`${URL}/configurations`).subscribe(() => {
        done();
      });
      const requests = httpController.match({ method: 'get' });
      requests[0].flush('All good');
      expect(requests[0].request.url).not.toContain(';'.concat('bctx=', buyingContext));
      expect(requests[0].request.url).not.toContain(OHS_BASEURL.concat(ORGANIZATIONS_ENDPOINT));
    });

    it('should insert the buyingContext => proper REST Endpoint', done => {
      http.get(`${URL}${BASKETS_ENDPOINT}`).subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        error: fail,
        complete: done,
      });

      const requests = httpController.match({ method: 'get' });
      requests[0].flush('All good');

      expect(requests[0].request.url).toContain(';'.concat('bctx=', buyingContext));
    });

    it('should change to host url to OHS host => proper REST Endpoint', done => {
      http.get(`${URL}${ORGANIZATIONS_ENDPOINT}`).subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        error: fail,
        complete: done,
      });

      const requests = httpController.match({ method: 'get' });
      requests[0].flush('All good');

      expect(requests[0].request.url).toContain(OHS_BASEURL.concat(ORGANIZATIONS_ENDPOINT));
    });
  });

  describe('ICM service is disabled', () => {
    const initialState = {
      organizationHierarchies: {
        buyingContext: {
          bctx: buyingContext,
        },
      },
      configuration: {
        serverTranslations: {},
        channel: SITE,
        multiSiteLocaleMap: { en_US: '/en' },
        baseURL: BASE_URL,
        server: SERVER,
      },
      serverConfig: {
        _config: {},
      },
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: OrganizationHierarchiesInterceptor, multi: true },
          provideMockStore({ initialState }),
        ],
      });
      httpController = TestBed.inject(HttpTestingController);
      http = TestBed.inject(HttpClient);
    });

    it('should not change the url => service not running', done => {
      http.get(`${URL}/organizations`).subscribe(() => {
        done();
      });
      const requests = httpController.match({ method: 'get' });
      requests[0].flush('All good');
      expect(requests[0].request.url).not.toContain(OHS_BASEURL.concat(ORGANIZATIONS_ENDPOINT));
    });
  });
});
