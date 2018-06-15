import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { Link } from '../../../models/link/link.model';
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

    it('should call the httpClient.get method when apiService.get method is called.', done => {
      apiService.get('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('GET');
    });

    it('should create Error Action if httpClient.get throws Error.', () => {
      const statusText = 'ERROAAR';

      // tslint:disable-next-line:use-async-synchronisation-in-tests
      apiService.get('data').subscribe(data => fail(), data => fail());
      const req = httpTestingController.expectOne(`${BASE_URL}/data`);

      req.flush('err', { status: 500, statusText });

      verify(storeMock$.dispatch(anything())).once();
      const [action] = capture(storeMock$.dispatch).last();
      expect((action as Action).type).toEqual(ErrorActionTypes.ServerError);
      expect((action as ServerError).error.statusText).toEqual(statusText);
    });

    it('should call the httpClient.put method when apiService.put method is called.', done => {
      apiService.put('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PUT');
    });

    it('should call the httpClient.post method when apiService.post method is called.', done => {
      apiService.post('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('POST');
    });

    it('should call the httpClient.delete method when apiService.delete method is called.', done => {
      apiService.delete('data').subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne(`${BASE_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('API Service Pipable Operators', () => {
    let httpTestingController: HttpTestingController;
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

    beforeEach(() => {
      storeMock$ = mock(Store);
      when(storeMock$.pipe(anything())).thenReturn(EMPTY);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: REST_ENDPOINT, useValue: `${BASE_URL}/site` },
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

    it('should perform element translation when it is requested', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope())
        .subscribe(data => {
          expect(data).toEqual([webcamLink]);
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush(categoriesResponse);

      httpTestingController.expectNone(webcamsPath);
    });

    it('should return empty array on element translation when no elements are found', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope())
        .subscribe(data => {
          expect(data).toBeEmpty();
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush({});

      httpTestingController.expectNone(webcamsPath);
    });

    it('should not perform element or link translation when it is not requested', done => {
      apiService.get('categories').subscribe(data => {
        expect(data).toEqual(categoriesResponse);
        done();
      });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush(categoriesResponse);

      httpTestingController.expectNone(webcamsPath);
    });

    it('should perform both operations when requested', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope(), resolveLinks(apiService))
        .subscribe(data => {
          expect(data).toEqual([webcamResponse]);
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush(categoriesResponse);

      const req2 = httpTestingController.expectOne(webcamsPath);
      req2.flush(webcamResponse);
    });

    it('should filter out elements that are not links when doing link translation', done => {
      apiService
        .get('something')
        .pipe(resolveLinks(apiService))
        .subscribe(data => {
          expect(data).toHaveLength(1);
          done();
        });

      const req = httpTestingController.expectOne(`${BASE_URL}/site/something`);
      req.flush([{ uri: 'site/dummy1' }, { type: 'Link', uri: 'site/dummy2' }, { type: 'Link' }] as Link[]);

      httpTestingController.expectNone(`${BASE_URL}/site/dummy1`);
      httpTestingController.expectOne(`${BASE_URL}/site/dummy2`).flush({});
      httpTestingController.expectNone(`${BASE_URL}/site/dummy3`);
    });

    it('should return empty array on link translation when no links are available', done => {
      apiService
        .get('something')
        .pipe(resolveLinks(apiService))
        .subscribe(data => {
          expect(data).toBeEmpty();
          done();
        });

      const req = httpTestingController.expectOne(`${BASE_URL}/site/something`);
      req.flush([]);
    });

    it('should return empty array on element and link translation when source is empty', done => {
      apiService
        .get('categories')
        .pipe(unpackEnvelope(), resolveLinks(apiService))
        .subscribe(data => {
          expect(data).toBeEmpty();
          done();
        });

      const req = httpTestingController.expectOne(categoriesPath);
      req.flush({});
    });
  });
});
