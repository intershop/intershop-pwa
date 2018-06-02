// tslint:disable:no-any
import { HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { _setToken, AuthInterceptor } from './auth.interceptor';

describe('Auth Interceptor', () => {
  const responseData = `{"name":"test","age":"34"}`;
  let getRequest: HttpRequest<any>;

  let mockRequest: HttpRequest<any>;

  let authInterceptor: AuthInterceptor;

  let mockInterceptor: any;
  beforeEach(() => {
    getRequest = new HttpRequest<any>('GET', ' ');
    mockRequest = null;
    mockInterceptor = {
      handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        const headers = new HttpHeaders();
        const res = new HttpResponse<any>({ body: JSON.parse(responseData), headers: headers });
        mockRequest = req;
        return of(res);
      },
    };
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    });
    authInterceptor = TestBed.get(AuthInterceptor);
  });

  it('should return mocked body in response when requested', done => {
    authInterceptor.intercept(getRequest, mockInterceptor).subscribe((data: HttpResponse<any>) => {
      const response = data;
      expect(response.body).toEqual(JSON.parse(responseData));
      done();
    });
  });

  it(`should set request's header token on receiving from jwt service`, done => {
    const TOKEN = 'testtoken';
    _setToken(TOKEN);

    authInterceptor.intercept(getRequest, mockInterceptor).subscribe(data => {
      expect(mockRequest.headers.get('authentication-token')).toEqual(TOKEN);
      done();
    });
  });

  it(`should not set token when request's header contains 'Authorization'`, done => {
    const headers = new HttpHeaders().set('Authorization', 'Basic');
    const request = new HttpRequest<any>('GET', ' ', { headers: headers });
    authInterceptor.intercept(request, mockInterceptor).subscribe(data => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
      done();
    });
  });

  it('should not set token when token is empty', done => {
    _setToken('');

    authInterceptor.intercept(getRequest, mockInterceptor).subscribe(data => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
      done();
    });
  });
});
