// tslint:disable:no-any
import { HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anything, spy, verify } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { coreReducers } from '../store/core-store.module';

import { AuthInterceptor } from './auth.interceptor';

describe('Auth Interceptor', () => {
  const responseData = `{"name":"test","age":"34"}`;
  let responseHeaders: HttpHeaders;
  let getRequest: HttpRequest<any>;
  let authInterceptor: AuthInterceptor;
  let mockInterceptor: any;
  let store$: Store<{}>;

  beforeEach(() => {
    getRequest = new HttpRequest<any>('GET', ' ');
    responseHeaders = new HttpHeaders();
    mockInterceptor = {
      handle(_: HttpRequest<any>): Observable<HttpEvent<any>> {
        const headers = responseHeaders;
        const res = new HttpResponse<any>({ body: JSON.parse(responseData), headers: headers });
        return of(res);
      },
    };
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [AuthInterceptor],
    });
    authInterceptor = TestBed.get(AuthInterceptor);
    store$ = spy(TestBed.get(Store));
  });

  it('should return mocked body in response when requested', done => {
    authInterceptor.intercept(getRequest, mockInterceptor).subscribe((data: HttpResponse<any>) => {
      const response = data;
      expect(response.body).toEqual(JSON.parse(responseData));
      done();
    });
  });

  it('should set api token from response when found', done => {
    responseHeaders = responseHeaders.set(ApiService.TOKEN_HEADER_KEY, 'dummy');

    authInterceptor.intercept(getRequest, mockInterceptor).subscribe(() => {
      verify(store$.dispatch(anything())).once();
      done();
    });
  });
});
