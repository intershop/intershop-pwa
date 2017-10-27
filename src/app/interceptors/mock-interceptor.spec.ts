import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import * as using from 'jasmine-data-provider';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { environment } from '../../environments/environment';
import { MockInterceptor } from './mock-interceptor';

describe('Mock Interceptor', () => {

  describe('REST Path Extraction', () => {

    let mockInterceptor: MockInterceptor;

    beforeEach(() => {
      mockInterceptor = new MockInterceptor();
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
      mockInterceptor = new MockInterceptor();
    });

    function dataProvider() {
      return [
        { url: environment.rest_url + '/categories', willBeMocked: true, method: 'GET' },
        { url: environment.rest_url + ';loc=en_US;cur=USD/categories', willBeMocked: true, method: 'GET' },
        { url: './assets/picture.png', willBeMocked: false, method: 'GET' }
      ];
    }

    using(dataProvider, (dataSlice) => {
      it('should ' + (dataSlice.willBeMocked ? '' : 'not ') + 'mock request to ' + dataSlice.url, () => {
        expect(mockInterceptor.requestHasToBeMocked(request.clone({ url: dataSlice.url }))).toBe(dataSlice.willBeMocked);
      });

      it('should ' + (dataSlice.willBeMocked ? '' : 'not ') + 'change url for ' + dataSlice.url, () => {
        if (dataSlice.willBeMocked) {
          expect(mockInterceptor.getMockUrl(dataSlice)).not.toBe(dataSlice.url);
        } else {
          expect(mockInterceptor.getMockUrl(dataSlice)).toBe(dataSlice.url);
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
        const mockInterceptor = new MockInterceptor();
        expect(mockInterceptor.matchPath(dataSlice.item, dataSlice.in)).toBe(dataSlice.expect);
      });
    });
  });

  describe('Intercepting', () => {

    let mockInterceptor: MockInterceptor;
    let request: HttpRequest<any>;
    let handler: HttpHandler;

    beforeEach(() => {
      mockInterceptor = new MockInterceptor();
      request = new HttpRequest('GET', `${environment.rest_url}/some`);
      const handlerMock = mock(HttpHandler);
      when(handlerMock.handle(anything())).thenReturn(Observable.of(new HttpResponse<any>()));
      handler = instance(handlerMock);
    });

    it('should attach token when patricia is logged in correctly', () => {
      mockInterceptor.intercept(request.clone({ headers: request.headers.append('Authorization', 'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==') }), handler).subscribe(event => {
        expect(event.type).toBe(HttpEventType.Response);

        const response = event as HttpResponse<any>;
        expect(response.headers.get('authentication-token')).toBeTruthy();
      });
    });

    it('should not attach token when patricia is not logged in correctly', () => {
      mockInterceptor.intercept(request.clone({ headers: request.headers.append('Authorization', 'invalid') }), handler).subscribe(event => {
        expect(event.type).toBe(HttpEventType.Response);

        const response = event as HttpResponse<any>;
        expect(response.headers.get('authentication-token')).toBeFalsy();
      });
    });
  });
});
