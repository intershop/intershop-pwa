// tslint:disable:no-any
import { HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CoreState } from '../store/core.state';
import { coreReducers } from '../store/core.system';
import { SetAPIToken } from '../store/user';
import { AuthInterceptor } from './auth.interceptor';

describe('Auth Interceptor', () => {
  const responseData = `{"name":"test","age":"34"}`;
  let getRequest: HttpRequest<any>;
  let mockRequest: HttpRequest<any>;
  let authInterceptor: AuthInterceptor;
  let mockInterceptor: any;
  let store$: Store<CoreState>;

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
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [AuthInterceptor],
    });
    authInterceptor = TestBed.get(AuthInterceptor);
    store$ = TestBed.get(Store);
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
    store$.dispatch(new SetAPIToken(TOKEN));

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
    store$.dispatch(new SetAPIToken(undefined));

    authInterceptor.intercept(getRequest, mockInterceptor).subscribe(data => {
      expect(mockRequest.headers.has('authentication-token')).toBeFalsy();
      done();
    });
  });
});
