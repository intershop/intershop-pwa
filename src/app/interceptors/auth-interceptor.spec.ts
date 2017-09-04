import { Observable } from 'rxjs/Rx';
import { TestBed, inject } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor';
import { JwtService } from 'app/services/jwt.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

describe('Auth Interceptor Service', () => {
  const responseData = `{"name":"test","age":"34"}`;
  let mockRequest: HttpRequest<any>;
  const getRequest = new HttpRequest<any>('GET', ' ');
  let jwtToken: string;

  class MockInterceptor implements HttpHandler {
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().set('authentication-token', 'testtoken');
    const res = new HttpResponse<any>({ body: JSON.parse(responseData), headers: headers });
      mockRequest = req;
      return Observable.of(res);
    }
  }

  class JwtServiceStub {
    saveToken(token) {
      jwtToken = token;
      return token;
    }
    getToken() {
      return jwtToken;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: JwtService, useClass: JwtServiceStub }
      ],
      imports: [
      ]
    });
  });

  it('should return expected response', inject([AuthInterceptor], (authInterceptor: AuthInterceptor) => {
    authInterceptor.intercept(getRequest, new MockInterceptor()).subscribe((data) => {
      const response = <HttpResponse<any>>data;
      expect(response.body).toEqual(JSON.parse(responseData));
    });
  }));

  it('should set token', inject([AuthInterceptor], (authInterceptor: AuthInterceptor) => {
    jwtToken = 'testtoken';
    authInterceptor.intercept(getRequest, new MockInterceptor()).subscribe((data) => {
      expect(mockRequest.headers.get('authentication-token')).toEqual('testtoken');
    });
  }));

  it('should not set token for Authorization request', inject([AuthInterceptor], (authInterceptor: AuthInterceptor) => {
    const headers = new HttpHeaders().set('Authorization', 'Basic');
    const request = new HttpRequest<any>('GET', ' ', { headers: headers });
    authInterceptor.intercept(request, new MockInterceptor()).subscribe((data) => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
    });
  }));

  it('should not set token when token is empty', inject([AuthInterceptor], (authInterceptor: AuthInterceptor) => {
    jwtToken = '';
    authInterceptor.intercept(getRequest, new MockInterceptor()).subscribe((data) => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
    });
  }));
});
