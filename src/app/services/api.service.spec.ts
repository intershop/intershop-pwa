import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { CustomErrorHandler } from './custom-error-handler';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';

class LocalizeRouterServiceMock {
  parser = {
    currentLocale: { lang: 'en', currency: 'USD' }
  };
}

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

  it('should test if the Element traslation is working as expected', inject([ApiService], (apiService: ApiService) => {
    when(httpClient.get(anyString(), new Object(anything()))).thenReturn(
      Observable.of({
        'elements': [
          {
            'type': 'Link',
            'uri': 'inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD/customers/-/wishlists/vVKsEQACPHcAAAFe0EwBRaB5',
            'title': 'For Christmas'
          }
        ],
        'type': 'ResourceCollection',
        'name': 'wishlists'
      })
    );
    apiService.get('customers/-/wishlists/', null, null, true).subscribe((data) => {
      expect(data).toEqual([
        {
          'type': 'Link',
          'uri': 'inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD/customers/-/wishlists/vVKsEQACPHcAAAFe0EwBRaB5',
          'title': 'For Christmas'
        }
      ]);
    });
  }));

  it('should test if the Link traslation is working as expected', inject([ApiService], (apiService: ApiService) => {
    const locale = 'loc=en;cur=USD';
    when(httpClient.get(`${environment.rest_url};${locale}/categories/`, new Object(anything()))).thenReturn(
      Observable.of(
        {
          'elements': [
            {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/577'
            }]
        }
      )
    );

    when(httpClient.get(`${environment.rest_url};${locale}/categories/Cameras-Camcorders/577`, new Object(anything()))).thenReturn(
      Observable.of(
        {
          'name': 'Webcams',
          'description': 'The camera products and services catalog.',
          'id': '577'
        }
      )
    );

    apiService.get('categories/', null, null, false, true).subscribe((data) => {
      verify(httpClient.get(`${environment.rest_url};${locale}/categories/`, new Object(anything()))).once();
      verify(httpClient.get(`${environment.rest_url};${locale}/categories/Cameras-Camcorders/577`, new Object(anything()))).once();
      expect(data[0]).toEqual({
        'description': 'The camera products and services catalog.',
        'id': '577',
        'name': 'Webcams'
      });
    });
  }));
});
