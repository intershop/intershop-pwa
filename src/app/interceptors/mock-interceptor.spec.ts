import { HttpHandler, HttpRequest } from '@angular/common/http';
import * as using from 'jasmine-data-provider';
import { anything, instance, mock, verify } from 'ts-mockito';
import { environment } from './../../environments/environment';
import { JwtService } from './../services/jwt.service';
import { MockInterceptor } from './mock-interceptor';

describe('Mock Interceptor', () => {

  describe('REST Path Extraction', () => {

    let mockInterceptor: MockInterceptor;

    beforeEach(() => {
      mockInterceptor = new MockInterceptor(instance(mock(JwtService)));
    });

    it('should extract the correct path when rest URL is given', () => {
      expect(mockInterceptor.getRestPath(environment.rest_url + '/categories/Cameras')).toBe('categories/Cameras');
    });

    it('should extract the correct path when rest URL is given with currency and locale', () => {
      expect(mockInterceptor.getRestPath(environment.rest_url + ';loc=en_US;cur=USD/categories/Cameras')).toBe('categories/Cameras');
    });
  });

  describe('Request URL Modification', () => {

    let mockInterceptor: MockInterceptor;
    const request: HttpRequest<any> = new HttpRequest('GET', '');

    beforeEach(() => {
      mockInterceptor = new MockInterceptor(instance(mock(JwtService)));
    });

    function dataProvider() {
      return [
        { url: environment.rest_url + '/categories', willBeMocked: true },
        { url: environment.rest_url + ';loc=en_US;cur=USD/categories', willBeMocked: true },
        { url: './assets/picture.png', willBeMocked: false }
      ];
    }

    using(dataProvider, (dataSlice) => {
      it('should ' + (dataSlice.willBeMocked ? '' : 'not ') + 'mock request to ' + dataSlice.url, () => {
        expect(mockInterceptor.requestHasToBeMocked(request.clone({ url: dataSlice.url }))).toBe(dataSlice.willBeMocked);
      });

      it('should ' + (dataSlice.willBeMocked ? '' : 'not ') + 'change url for ' + dataSlice.url, () => {
        if (dataSlice.willBeMocked) {
          expect(mockInterceptor.getMockUrl(dataSlice.url)).not.toBe(dataSlice.url);
        } else {
          expect(mockInterceptor.getMockUrl(dataSlice.url)).toBe(dataSlice.url);
        }
      });
    });
  });

  describe('matchPath Method', () => {

    function dataProvider() {
      return [
        { item: 'categories', in: ['categories'], expect: true },
        { item: 'catego', in: ['categories'], expect: false },
        { item: 'categories', in: ['cat.*'], expect: true },
        { item: 'categories/Computers', in: ['categories'], expect: false },
        { item: 'categories/Computers', in: ['categories.*'], expect: true },
        { item: 'categories/Computers', in: ['categories/.*'], expect: true },
        { item: 'categories/Computers', in: ['categories/Computers'], expect: true },
        { item: 'categories/Computers', in: ['categories/Audio'], expect: false },
        { item: 'categories/Computers', in: ['categories/'], expect: false },
        { item: 'categories/Computers', in: ['categories/(Audio|Computers|HiFi)'], expect: true },
        { item: 'categories/Computers', in: ['categories/(Audio|Computers|HiFi)/'], expect: false },
      ];
    }

    using(dataProvider, (dataSlice) => {
      it(`should${dataSlice.expect ? '' : ' not'} find \'${dataSlice.item}\' in ${dataSlice.in}`, () => {
        const mockInterceptor = new MockInterceptor(instance(mock(JwtService)));
        expect(mockInterceptor.matchPath(dataSlice.item, dataSlice.in)).toBe(dataSlice.expect);
      });
    });
  });

  describe('Intercepting', () => {

    let jwtServiceMock: JwtService;
    let mockInterceptor: MockInterceptor;
    let request: HttpRequest<any>;
    let handler: HttpHandler;

    beforeEach(() => {
      jwtServiceMock = mock(JwtService);
      mockInterceptor = new MockInterceptor(instance(jwtServiceMock));
      request = new HttpRequest('GET', `${environment.rest_url}/some`);
      handler = instance(mock(HttpHandler));
    });

    it('should attach token when patricia is logged in correctly', () => {
      verify(jwtServiceMock.saveToken(anything())).never();

      mockInterceptor.intercept(request.clone({headers: request.headers.append('Authorization', 'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==')}), handler);

      verify(jwtServiceMock.saveToken(anything())).once();
    });

    it('should not attach token when patricia is not logged in correctly', () => {
      verify(jwtServiceMock.saveToken(anything())).never();

      mockInterceptor.intercept(request.clone({headers: request.headers.append('Authorization', 'invalid')}), handler);

      verify(jwtServiceMock.saveToken(anything())).never();
    });
  });
});
