import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

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
        MockInterceptor,
        { provide: API_MOCK_PATHS, useValue: ['.*'] },
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
});
