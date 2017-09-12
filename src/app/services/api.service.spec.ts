import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CustomErrorHandler } from './custom-error-handler';

class DummyCustomErrorHandler {
}

class DummyTraslateService {
  parser = {
    currentLocale: { lang: 'en', currency: 'USD' }
  };
}

class DummyHttpClient {
  get(url: string, options: {}): Observable<any> {
    return Observable.of({ 'type': 'get' });
  }

  put(path: string, body: {}): Observable<any> {
    return Observable.of({ 'type': 'put' });
  }

  post(path: string, body: {}): Observable<any> {
    return Observable.of({ 'type': 'post' });
  }

  delete(path: string): Observable<any> {
    return Observable.of({ 'type': 'delete' });
  }
}

describe('test', () => {
  let injector: Injector;
  let localizeRouterService: LocalizeRouterService;
  let apiService: ApiService;
  let customErrorHandler: CustomErrorHandler;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useClass: DummyHttpClient },
        { provide: CustomErrorHandler, useClass: DummyCustomErrorHandler },
        { provide: LocalizeRouterService, useClass: DummyTraslateService }
      ]
    });

    injector = getTestBed();
    localizeRouterService = injector.get(LocalizeRouterService);
    customErrorHandler = injector.get(CustomErrorHandler);
    httpClient = injector.get(HttpClient);
  });

  afterEach(() => {
    injector = void 0;
    localizeRouterService = void 0;
    apiService = void 0;
  });

  it('should return an observable on calling of GET().', () => {
    apiService = new ApiService(httpClient, customErrorHandler, localizeRouterService);

    let returnVal;
    apiService.get('', null).subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toBeTruthy();
  });

  it('should return an observable on calling of PUT().', () => {
    apiService = new ApiService(httpClient, customErrorHandler, localizeRouterService);

    let returnVal;
    apiService.put('', null).subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toEqual('put');
  });

  it('should return an observable on calling of POST().', () => {
    apiService = new ApiService(httpClient, customErrorHandler, localizeRouterService);

    let returnVal;
    apiService.post('', null).subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toEqual('post');
  });

  it('should return an observable on calling of DELETE().', () => {
    apiService = new ApiService(httpClient, customErrorHandler, localizeRouterService);

    let returnVal;
    apiService.delete('').subscribe((res) => {
      returnVal = res;
    });
    expect(returnVal.type).toEqual('delete');
  });
});

