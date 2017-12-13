import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from './api.service';
import { CustomErrorHandler } from './custom-error-handler';
import { CurrentLocaleService } from './locale/current-locale.service';
import { ICM_SERVER_URL, REST_ENDPOINT } from './state-transfer/factories';

describe('ApiService', () => {
  const BASE_URL = 'http://www.example.org/';
  let customErrorHandler: CustomErrorHandler;
  let httpClientMock: HttpClient;
  let apiService: ApiService;

  beforeEach(() => {
    customErrorHandler = mock(CustomErrorHandler);
    httpClientMock = mock(HttpClient);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClientMock) },
        { provide: CustomErrorHandler, useFactory: () => instance(customErrorHandler) },
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) },
        { provide: REST_ENDPOINT, useValue: BASE_URL },
        { provide: ICM_SERVER_URL, useValue: BASE_URL },
        ApiService
      ]
    });

    apiService = TestBed.get(ApiService);
  });

  it('should call the httpClient.get method when apiService.get method is called.', () => {
    when(httpClientMock.get(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    verify(httpClientMock.get(anything(), anything())).never();
    apiService.get('');
    verify(httpClientMock.get(anything(), anything())).once();
  });

  it('should call the httpClient.put method when apiService.put method is called.', () => {
    when(httpClientMock.put(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    verify(httpClientMock.put(anything(), anything())).never();
    apiService.put('');
    verify(httpClientMock.put(anything(), anything())).once();
  });


  it('should call the httpClient.post method when apiService.post method is called.', () => {
    when(httpClientMock.post(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    verify(httpClientMock.post(anything(), anything())).never();
    apiService.post('');
    verify(httpClientMock.post(anything(), anything())).once();
  });

  it('should call the httpClient.delete method when apiService.delete method is called.', () => {
    when(httpClientMock.delete(anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    verify(httpClientMock.delete(anything())).never();
    apiService.delete('');
    verify(httpClientMock.delete(anything())).once();
  });
});
