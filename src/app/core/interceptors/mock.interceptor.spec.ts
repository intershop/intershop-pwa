import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EMPTY } from 'rxjs';
import { capture, instance, mock } from 'ts-mockito';

import { API_MOCK_PATHS } from 'ish-core/configurations/injection-keys';
import { getRestEndpoint } from 'ish-core/store/core/configuration';

import { MockInterceptor } from './mock.interceptor';

describe('Mock Interceptor', () => {
  const BASE_URL = 'http://example.org/WFS/site/-';

  let mockInterceptor: MockInterceptor;
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: API_MOCK_PATHS, useValue: ['.*'] },
        MockInterceptor,
        provideMockStore({ selectors: [{ selector: getRestEndpoint, value: BASE_URL }] }),
      ],
    });
    mockInterceptor = TestBed.inject(MockInterceptor);
  });

  describe('Request URL Modification', () => {
    it.each([
      [`${BASE_URL}/categories/Cameras`, '/assets/mock-data/categories/Cameras/get.json'],
      [`${BASE_URL};loc=en_US;cur=USD/categories/Cameras`, '/assets/mock-data/categories/Cameras/get.json'],
      [`${BASE_URL}/categories?view=tree`, '/assets/mock-data/categories/get.json'],
      [`${BASE_URL};loc=en_US;cur=USD/categories?view=tree`, '/assets/mock-data/categories/get.json'],
      [
        `${BASE_URL};loc=en_US;cur=USD/products;spgid=PU8jvEfUmFeE5k_3Hq1EE7DuxlIMC/1005182`,
        '/assets/mock-data/products/1005182/get.json',
      ],
      ['/assets/picture.png', '/assets/picture.png'],
    ])('should replace request to "%s" with "%s"', (incoming, outgoing) => {
      const http = new HttpRequest('GET', incoming);

      class MyHandler extends HttpHandler {
        handle = () => EMPTY;
      }

      const handler = mock(MyHandler);
      mockInterceptor.intercept(http, instance(handler));

      const request = capture(handler.handle).last()?.[0] as HttpRequest<unknown>;
      expect(request?.urlWithParams).toEqual(outgoing);
    });
  });

  describe('matchPath Method', () => {
    // eslint-disable-next-line jest/valid-title
    describe.each`
      item                      | within                                    | expected
      ${'categories'}           | ${undefined}                              | ${false}
      ${'categories'}           | ${[]}                                     | ${false}
      ${'categories'}           | ${['categories']}                         | ${true}
      ${'catego'}               | ${['categories']}                         | ${false}
      ${'categories'}           | ${['cat.*']}                              | ${true}
      ${'product/cat'}          | ${['cat.*']}                              | ${true}
      ${'product/38201833'}     | ${['2018']}                               | ${true}
      ${'product/cat'}          | ${['^cat.*']}                             | ${false}
      ${'categories/Computers'} | ${['categories$']}                        | ${false}
      ${'categories/Computers'} | ${['categories.*']}                       | ${true}
      ${'categories/Computers'} | ${['categories/.*']}                      | ${true}
      ${'categories/Computers'} | ${['categories/Computers']}               | ${true}
      ${'categories/Computers'} | ${['categories/Audio']}                   | ${false}
      ${'categories/Computers'} | ${['categories/']}                        | ${true}
      ${'categories/Computers'} | ${['categories/(Audio|Computers|HiFi)']}  | ${true}
      ${'categories/Computers'} | ${['categories/(Audio|Computers|HiFi)/']} | ${false}
      ${'categories/Computers'} | ${['Computers']}                          | ${true}
    `(``, ({ item, within, expected }) => {
      it(`should be ${expected} for URL '${item}' and mock paths [${within}]`, () => {
        expect(mockInterceptor.matchPath(item, within)).toBe(expected);
      });
    });
  });
});
