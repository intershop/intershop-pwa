import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { anything, capture, instance, mock, spy, verify } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { AuthInterceptor } from './auth.interceptor';

describe('Auth Interceptor', () => {
  let store$: Store<{}>;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    store$ = mock(Store);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: Store, useFactory: () => instance(store$) },
      ],
    });

    store$ = spy(TestBed.get(Store));
    httpTestingController = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should not touch requests or data when involved', done => {
    httpClient.get('some/url').subscribe(data => {
      expect(data).toMatchInlineSnapshot(`"some data"`);
      done();
    });

    httpTestingController.expectOne('some/url').flush('some data');
  });

  it('should save api tokens when returned from the server', done => {
    httpClient.get('some/url').subscribe(() => {
      verify(store$.dispatch(anything())).once();
      expect(capture(store$.dispatch).last()[0]).toMatchInlineSnapshot(`
        [Account Internal] Set API Token:
          apiToken: "dummy token"
      `);
      done();
    });

    httpTestingController
      .expectOne('some/url')
      .flush('some data', { headers: { [ApiService.TOKEN_HEADER_KEY]: 'dummy token' } });
  });

  it('should reset api tokens when outdated returned from the server', done => {
    httpClient.get('some/url').subscribe(() => {
      verify(store$.dispatch(anything())).once();
      expect(capture(store$.dispatch).last()[0]).toMatchInlineSnapshot(`[Account Internal] Reset API Token`);
      done();
    });

    httpTestingController
      .expectOne('some/url')
      .flush('some data', { headers: { [ApiService.TOKEN_HEADER_KEY]: 'AuthenticationTokenOutdated|aethserthsrth' } });
  });

  it('should retry request without token when token is outdated or invalid', done => {
    httpClient.get('some/url', { headers: { [ApiService.TOKEN_HEADER_KEY]: 'some token' } }).subscribe(data => {
      verify(store$.dispatch(anything())).once();
      expect(capture(store$.dispatch).last()[0]).toMatchInlineSnapshot(`[Account Internal] Reset API Token`);
      expect(data).toMatchInlineSnapshot(`"some data"`);
      done();
    });

    const req1 = httpTestingController.expectOne('some/url');
    expect(req1.request.headers.get(ApiService.TOKEN_HEADER_KEY)).toMatchInlineSnapshot(`"some token"`);
    req1.flush('Bad Request (AuthenticationTokenInvalid)', {
      headers: { [ApiService.TOKEN_HEADER_KEY]: 'AuthenticationTokenInvalid|sethsrth' },
      status: 400,
      statusText: 'Bad Request',
    });

    setTimeout(() => {
      const req2 = httpTestingController.expectOne('some/url');
      expect(req2.request.headers.get(ApiService.TOKEN_HEADER_KEY)).toBeFalsy();
      req2.flush('some data');
    }, 100);
  });

  it('should re-throw errors unrelated to tokens', done => {
    httpClient.get('some/url').subscribe(fail, err => {
      expect(err).toBeTruthy();
      done();
    });

    httpTestingController.expectOne('some/url').flush('ERROR', { status: 500, statusText: 'Internal Server Error' });
  });
});
