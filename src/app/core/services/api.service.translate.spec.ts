import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../store/core.state';
import { ApiService, unpackEnvelope } from './api.service';
import { ApiServiceErrorHandler } from './api.service.errorhandler';
import { ICM_SERVER_URL, REST_ENDPOINT } from './state-transfer/factories';

describe('Api Service Translate', () => {
  let httpClient: HttpClient;
  let apiService: ApiService;
  let storeMock$: Store<CoreState>;

  const BASE_URL = 'http://www.example.org/WFS';
  const categoriesPath = `${BASE_URL}/site/categories`;
  const webcamsPath = `${categoriesPath}/Cameras-Camcorders/577`;
  const webcamResponse = {
    name: 'Webcams',
    description: 'The camera products and services catalog.',
    id: '577',
  };
  const webcamLink = {
    type: 'Link',
    uri: 'site/categories/Cameras-Camcorders/577',
  };
  const categoriesResponse = {
    elements: [webcamLink],
    id: 'Cameras-Camcorders',
  };

  // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
  function deepCopyObservable<T>(obj): Observable<T> {
    return of(JSON.parse(JSON.stringify(obj)));
  }

  beforeEach(() => {
    httpClient = mock(HttpClient);
    storeMock$ = mock(Store);
    when(storeMock$.pipe(anything())).thenReturn(EMPTY);

    when(httpClient.get(anyString(), new Object(anything()))).thenCall((path: string, obj) => {
      if (path === categoriesPath) {
        return deepCopyObservable(categoriesResponse);
      } else if (path === webcamsPath) {
        return deepCopyObservable(webcamResponse);
      } else {
        return of(`path '${path}' does not exist`);
      }
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: REST_ENDPOINT, useValue: `${BASE_URL}/site` },
        { provide: ICM_SERVER_URL, useValue: BASE_URL },
        { provide: Store, useFactory: () => instance(storeMock$) },
        ApiServiceErrorHandler,
        ApiService,
      ],
    });
    apiService = TestBed.get(ApiService);

    verify(httpClient.get(categoriesPath, new Object(anything()))).never();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should perform element translation when it is requested', () => {
    apiService
      .get('categories')
      .pipe(unpackEnvelope())
      .subscribe(data => {
        expect(data).toEqual([webcamLink]);
      });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should not perform element translation when it is not requested', () => {
    apiService.get('categories').subscribe(data => {
      expect(data).toEqual(categoriesResponse);
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should perform link translation when requested', () => {
    apiService
      .get('categories')
      .pipe(apiService.linkTranslation)
      .subscribe(data => {
        expect(data['elements']).toEqual([webcamResponse]);
        expect(data['id']).toEqual('Cameras-Camcorders');
      });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).once();
  });

  it('should not perform link translation when not requested', () => {
    apiService.get('categories').subscribe(data => {
      expect(data).toEqual(categoriesResponse);
    });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).never();
  });

  it('should perform both operations when requested', () => {
    apiService
      .get('categories')
      .pipe(unpackEnvelope(), apiService.linkTranslation)
      .subscribe(data => {
        expect(data).toEqual([webcamResponse]);
      });
    verify(httpClient.get(categoriesPath, new Object(anything()))).once();
    verify(httpClient.get(webcamsPath, new Object(anything()))).once();
  });
});
