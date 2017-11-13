import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { CustomErrorHandler } from './custom-error-handler';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';

describe('ApiService Translation', () => {
  let customErrorHandler: CustomErrorHandler;
  let httpClient: HttpClient;
  let apiService: ApiService;
  const mockLoalizeRouterService: any = mock(LocalizeRouterService);
  const loalizeRouterServiceMock = instance(mockLoalizeRouterService);
  loalizeRouterServiceMock.parser = {
    currentLocale: { lang: 'en', currency: 'USD' }
  };

  const categoriesPath = `${environment.rest_url};loc=en;cur=USD/categories`;
  const webcamsPath = `${categoriesPath}/Cameras-Camcorders/577`;
  const webcamResponse = {
    'name': 'Webcams',
    'description': 'The camera products and services catalog.',
    'id': '577'
  };
  const webcamLink = {
    'type': 'Link',
    'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/577'
  };
  const categoriesResponse = {
    'elements': [webcamLink],
    'id': 'Cameras-Camcorders'
  };

  // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
  function deepCopyObservable(obj): Observable<any> {
    return Observable.of(JSON.parse(JSON.stringify(obj)));
  }

  beforeEach(() => {
    customErrorHandler = mock(CustomErrorHandler);
    httpClient = mock(HttpClient);

    when(httpClient.get(categoriesPath, new Object(anything()))).thenReturn(deepCopyObservable(categoriesResponse));
    when(httpClient.get(webcamsPath, new Object(anything()))).thenReturn(deepCopyObservable(webcamResponse));

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: CustomErrorHandler, useFactory: () => instance(customErrorHandler) },
        { provide: LocalizeRouterService, useValue: loalizeRouterServiceMock },
        ApiService
      ]
    });
    apiService = TestBed.get(ApiService);

    verify(httpClient.get(categoriesPath, new Object(anything()))).never();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should perform element translation when it is requested', () => {
    apiService.get('categories', null, null, true, false).subscribe((data) => {
      expect(data).toEqual([webcamLink]);
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should not perform element translation when it is not requested', () => {
    apiService.get('categories', null, null, false, false).subscribe((data) => {
      expect(data).toEqual(categoriesResponse);
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should perform link translation when requested', () => {
    apiService.get('categories', null, null, false, true).subscribe((data) => {
      expect(data['elements']).toEqual([webcamResponse]);
      expect(data['id']).toEqual('Cameras-Camcorders');
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).once();
  });

  it('should not perform link translation when not requested', () => {
    apiService.get('categories', null, null, false, false).subscribe((data) => {
      expect(data).toEqual(categoriesResponse);
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should perform both operations when requested', () => {
    apiService.get('categories', null, null, true, true).subscribe((data) => {
      expect(data).toEqual([webcamResponse]);
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).once();
  });
});
