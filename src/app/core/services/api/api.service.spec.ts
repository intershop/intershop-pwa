import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../../store/core.state';
import { ErrorActionTypes, ServerError } from '../../store/error';
import { ICM_SERVER_URL, REST_ENDPOINT } from '../state-transfer/factories';
import { ApiService, resolveLinks, unpackEnvelope } from './api.service';
import { ApiServiceErrorHandler } from './api.service.errorhandler';

describe('Api Service', () => {
  describe('API Service Methods', () => {
    const BASE_URL = 'http://www.example.org';
    let apiService: ApiService;
    let storeMock$: Store<CoreState>;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      storeMock$ = mock(Store);
      when(storeMock$.pipe(anything())).thenReturn(EMPTY);

      TestBed.configureTestingModule({
        imports: [
          // https://angular.io/guide/http#testing-http-requests
          HttpClientTestingModule,
        ],
        providers: [
          { provide: REST_ENDPOINT, useValue: BASE_URL },
          { provide: ICM_SERVER_URL, useValue: BASE_URL },
          { provide: Store, useFactory: () => instance(storeMock$) },
          ApiServiceErrorHandler,
          ApiService,
        ],
      });

      apiService = TestBed.get(ApiService);
      httpTestingController = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should call the httpClient.get method when apiService.get method is called.', () => {
      apiService.get('data').subscribe(data => expect(data).toBeTruthy());

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      expect(req.request.method).toEqual('GET');
    });

    it('should create Error Action if httpClient.get throws Error.', () => {
      const statusText = 'ERROAAR';
      apiService.get('data').subscribe(data => expect(data).toBeTruthy());
      const req = httpTestingController.expectOne(`${BASE_URL}/data`);

      req.flush('err', { status: 500, statusText });

      verify(storeMock$.dispatch(anything())).once();
      const [action] = capture(storeMock$.dispatch).last();
      expect((<Action>action).type).toEqual(ErrorActionTypes.ServerError);
      expect((<ServerError>action).error.statusText).toEqual(statusText);
    });

    it('should call the httpClient.put method when apiService.put method is called.', () => {
      apiService.put('data').subscribe(data => expect(data).toBeTruthy());

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      expect(req.request.method).toEqual('PUT');
    });

    it('should call the httpClient.post method when apiService.post method is called.', () => {
      apiService.post('data').subscribe(data => expect(data).toBeTruthy());

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      expect(req.request.method).toEqual('POST');
    });

    it('should call the httpClient.delete method when apiService.delete method is called.', () => {
      apiService.delete('data').subscribe(data => expect(data).toBeTruthy());

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('API Service Pipable Operators', () => {
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
        .pipe(unpackEnvelope(), resolveLinks(apiService))
        .subscribe(data => {
          expect(data).toEqual([webcamResponse]);
        });
      verify(httpClient.get(categoriesPath, new Object(anything()))).once();
      verify(httpClient.get(webcamsPath, new Object(anything()))).once();
    });
  });
});
