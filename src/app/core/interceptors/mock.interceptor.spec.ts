import { HttpEventType, HttpHandler, HttpRequest, HttpResponse, HttpXhrBackend } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { MOCK_SERVER_API, MUST_MOCK_PATHS } from 'ish-core/configurations/injection-keys';
import { getRestEndpoint } from 'ish-core/store/core/configuration';

import { MockInterceptor } from './mock.interceptor';

describe('Mock Interceptor', () => {
  const BASE_URL = 'http://example.org/WFS/site/-';

  let mockInterceptor: MockInterceptor;
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        MockInterceptor,
        { provide: MOCK_SERVER_API, useValue: true },
        { provide: MUST_MOCK_PATHS, useValue: [] },
        provideMockStore({ selectors: [{ selector: getRestEndpoint, value: BASE_URL }] }),
      ],
    });
    mockInterceptor = TestBed.inject(MockInterceptor);
  });

  describe('REST Path Extraction', () => {
    it('should extract the correct path when rest URL is given', () => {
      expect(mockInterceptor.getRestPath(BASE_URL + '/categories/Cameras')).toBe('categories/Cameras');
    });

    it('should extract the correct path when rest URL is given with currency and locale', () => {
      expect(mockInterceptor.getRestPath(BASE_URL + ';loc=en_US;cur=USD/categories/Cameras')).toBe(
        'categories/Cameras'
      );
    });
  });

  describe('Request URL Modification', () => {
    const request = new HttpRequest('GET', '');

    describe.each([
      [true, BASE_URL + '/categories'],
      [true, BASE_URL + ';loc=en_US;cur=USD/categories'],
      [false, './assets/picture.png'],
    ])(``, (willBeMocked, url) => {
      it(`should mock request (${willBeMocked}) to ${url}`, () => {
        expect(mockInterceptor.requestHasToBeMocked(request.clone({ url }))).toBe(willBeMocked);
      });
      it(`should change url (${willBeMocked}) for ${url}`, () => {
        const http = new HttpRequest('GET', url);
        if (willBeMocked) {
          expect(mockInterceptor.getMockUrl(http)).not.toBe(url);
        } else {
          expect(mockInterceptor.getMockUrl(http)).toBe(url);
        }
      });
    });
  });

  describe('matchPath Method', () => {
    describe.each`
      item                      | within                                    | expected
      ${'categories'}           | ${undefined}                              | ${false}
      ${'categories'}           | ${[]}                                     | ${false}
      ${'categories'}           | ${['categories']}                         | ${true}
      ${'catego'}               | ${['categories']}                         | ${false}
      ${'categories'}           | ${['cat.*']}                              | ${true}
      ${'categories/Computers'} | ${['categories']}                         | ${false}
      ${'categories/Computers'} | ${['categories.*']}                       | ${true}
      ${'categories/Computers'} | ${['categories/.*']}                      | ${true}
      ${'categories/Computers'} | ${['categories/Computers']}               | ${true}
      ${'categories/Computers'} | ${['categories/Audio']}                   | ${false}
      ${'categories/Computers'} | ${['categories/']}                        | ${false}
      ${'categories/Computers'} | ${['categories/(Audio|Computers|HiFi)']}  | ${true}
      ${'categories/Computers'} | ${['categories/(Audio|Computers|HiFi)/']} | ${false}
    `(``, ({ item, within, expected }) => {
      it(`should be ${expected} when '${item}' in ${within}`, () => {
        expect(mockInterceptor.matchPath(item, within)).toBe(expected);
      });
    });
  });

  describe('Intercepting', () => {
    let request: HttpRequest<unknown>;
    let handler: HttpHandler;

    beforeEach(() => {
      request = new HttpRequest('GET', `${BASE_URL}/some`);
      const handlerMock = mock(HttpXhrBackend);
      when(handlerMock.handle(anything())).thenReturn(of(new HttpResponse<unknown>()));
      handler = instance(handlerMock);
    });

    it('should attach token when patricia is logged in correctly', done => {
      mockInterceptor
        .intercept(
          request.clone({
            headers: request.headers.append(
              'Authorization',
              'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ=='
            ),
          }),
          handler
        )
        .subscribe(event => {
          expect(event.type).toBe(HttpEventType.Response);

          const response = event as HttpResponse<unknown>;
          expect(response.headers.get('authentication-token')).toBeTruthy();
          done();
        });
    });

    it('should return error response when patricia is not logged in correctly', done => {
      mockInterceptor
        .intercept(request.clone({ headers: request.headers.append('Authorization', 'invalid') }), handler)
        .subscribe(fail, event => {
          expect(event.ok).toBeFalsy();
          expect(event.status).toBe(401);
          expect(event.headers.get('authentication-token')).toBeFalsy();
          expect(event.headers.get('error-key')).toBeTruthy();
          done();
        });
    });
  });
});
