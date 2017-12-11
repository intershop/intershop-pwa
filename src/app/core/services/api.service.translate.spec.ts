import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from './api.service';
import { CustomErrorHandler } from './custom-error-handler';
import { CurrentLocaleService } from './locale/current-locale.service';
import { ICM_SERVER_URL, REST_ENDPOINT } from './state-transfer/factories';

describe('ApiService Translation', () => {
  let customErrorHandler: CustomErrorHandler;
  let httpClient: HttpClient;
  let apiService: ApiService;

  const BASE_URL = 'http://www.example.org/WFS';
  const categoriesPath = `${BASE_URL}/site/categories`;
  const webcamsPath = `${categoriesPath}/Cameras-Camcorders/577`;
  const webcamResponse = {
    'name': 'Webcams',
    'description': 'The camera products and services catalog.',
    'id': '577'
  };
  const webcamLink = {
    'type': 'Link',
    'uri': 'site/categories/Cameras-Camcorders/577'
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

    when(httpClient.get(anyString(), new Object(anything()))).thenCall((path: string, obj) => {
      if (path === categoriesPath) {
        return deepCopyObservable(categoriesResponse);
      } else if (path === webcamsPath) {
        return deepCopyObservable(webcamResponse);
      } else {
        return Observable.of(`path '${path}' does not exist`);
      }
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: CustomErrorHandler, useFactory: () => instance(customErrorHandler) },
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) },
        { provide: REST_ENDPOINT, useValue: `${BASE_URL}/site` },
        { provide: ICM_SERVER_URL, useValue: BASE_URL },
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
