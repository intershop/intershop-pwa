import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from './api.service';
import { CustomErrorHandler } from './custom-error-handler';
import { CurrentLocaleService } from './locale/current-locale.service';

describe('ApiService', () => {
  let customErrorHandler: CustomErrorHandler;
  let httpClient: HttpClient;

  beforeEach(() => {
    customErrorHandler = mock(CustomErrorHandler);
    httpClient = mock(HttpClient);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: CustomErrorHandler, useFactory: () => instance(customErrorHandler) },
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) },
        ApiService
      ]
    });

    when(httpClient.get(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    when(httpClient.put(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    when(httpClient.post(anything(), anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
    when(httpClient.delete(anything())).thenReturn(Observable.of(new ArrayBuffer(3)));
  });

  it('should call the httpClient.get method when apiService.get method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.get(anything())).never();
    apiService.get('', null);
    verify(httpClient.get(anything())).once();
  }));

  it('should call the httpClient.put method when apiService.put method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.put(anything(), anything())).never();
    apiService.put('', null);
    verify(httpClient.put(anything(), anything())).once();
  }));


  it('should call the httpClient.post method when apiService.post method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.post(anything(), anything())).never();
    apiService.post('', null);
    verify(httpClient.post(anything(), anything())).once();
  }));

  it('should call the httpClient.delete method when apiService.delete method is called.', inject([ApiService], (apiService: ApiService) => {
    verify(httpClient.delete(anything())).never();
    apiService.delete('');
    verify(httpClient.delete(anything())).once();
  }));
});
