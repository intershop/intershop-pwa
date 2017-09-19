import { Observable } from 'rxjs/Observable';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CustomErrorHandler } from './custom-error-handler';
import { MockApiService } from '../services/mock-api.service';
import { ApiService } from './api.service';
import { instance, mock, when, anything, verify } from 'ts-mockito/lib/ts-mockito';
import { environment } from '../../environments/environment';

class LocalizeRouterServiceMock {
  parser = {
    currentLocale: { lang: 'en', currency: 'USD' }
  };
}

describe('ApiService', () => {
  let customErrorHandler: CustomErrorHandler;
  let httpClient: HttpClient;
  let mockApi: MockApiService;

  beforeEach(() => {
    customErrorHandler = mock(CustomErrorHandler);
    httpClient = mock(HttpClient);
    mockApi = mock(MockApiService);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: CustomErrorHandler, useFactory: () => instance(customErrorHandler) },
        { provide: MockApiService, useFactory: () => instance(mockApi) },
        { provide: LocalizeRouterService, useClass: LocalizeRouterServiceMock },
        ApiService
      ]
    });

    when(httpClient.get(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    when(httpClient.put(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    when(httpClient.post(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    when(httpClient.delete(anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
  });

  it('should call the httpClient.get method when apiService.get method is called.', inject([ApiService], (apiService: ApiService) => {
    when(mockApi.pathHasToBeMocked(anything())).thenReturn(false);

    verify(httpClient.get(anything())).never();
    apiService.get('', null).subscribe((res) => {

    });
    verify(httpClient.get(anything())).once();
  }));

  it('should call the httpClient.put method when apiService.put method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.put(anything(), anything())).never();
    apiService.put('', null).subscribe((res) => {

    });
    verify(httpClient.put(anything(), anything())).once();
  }));


  it('should call the httpClient.post method when apiService.post method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.post(anything(), anything())).never();
    apiService.post('', null).subscribe((res) => {

    });
    verify(httpClient.post(anything(), anything())).once();
  }));

  it('should call the httpClient.delete method when apiService.delete method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.delete(anything())).never();

    apiService.delete('').subscribe((res) => {

    });
    verify(httpClient.delete(anything())).once();
  }));

  it('should confirm that mockApi.getMockPath is called when pathHasToBeMocked returns true and environment.needMock is true', inject([ApiService], (apiService: ApiService) => {
    when(mockApi.pathHasToBeMocked(anything())).thenReturn(true);
    environment.needMock = true;

    verify(mockApi.getMockPath(anything())).never();
    apiService.get('', null).subscribe((res) => {

    });
    verify(mockApi.getMockPath(anything())).once();
  }));
});
