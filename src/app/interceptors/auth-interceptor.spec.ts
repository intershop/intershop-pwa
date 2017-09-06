import { Observable } from 'rxjs/Rx';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor';
import { JwtService } from '../services/jwt.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { mock, instance, when } from 'ts-mockito';

describe('Auth Interceptor Service', () => {
  const responseData = `{"name":"test","age":"34"}`;
  let getRequest: HttpRequest<any>;

  let mockRequest: HttpRequest<any>;

  let authInterceptor: AuthInterceptor;

  class MockInterceptor implements HttpHandler {
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders();
    const res = new HttpResponse<any>({ body: JSON.parse(responseData), headers: headers });
      mockRequest = req;
      return Observable.of(res);
    }
  }

  let jwtServiceMock: JwtService;

  beforeEach(() => {
    getRequest = new HttpRequest<any>('GET', ' ');
    mockRequest = null;
    jwtServiceMock = mock(JwtService);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: JwtService, useFactory: () => instance(jwtServiceMock) }
      ]
    });
    authInterceptor = TestBed.get(AuthInterceptor);
  });

  it('should return mocked body in response', () => {
    authInterceptor.intercept(getRequest, new MockInterceptor()).subscribe((data: HttpResponse<any>) => {
      const response = data;
      expect(response.body).toEqual(JSON.parse(responseData));
    });
  });

  it('should use mocked test token', () => {
    when(jwtServiceMock.getToken()).thenReturn('testtoken');
    authInterceptor.intercept(getRequest, new MockInterceptor()).subscribe((data) => {
      expect(mockRequest.headers.get('authentication-token')).toEqual('testtoken');
    });
  });

  it('should not set token for Authorization request', () => {
    const headers = new HttpHeaders().set('Authorization', 'Basic');
    const request = new HttpRequest<any>('GET', ' ', { headers: headers });
    authInterceptor.intercept(request, new MockInterceptor()).subscribe((data) => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
    });
  });

  it('should not set token when token is empty', () => {
    when(jwtServiceMock.getToken()).thenReturn('');
    authInterceptor.intercept(getRequest, new MockInterceptor()).subscribe((data) => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
    });
  });
});
