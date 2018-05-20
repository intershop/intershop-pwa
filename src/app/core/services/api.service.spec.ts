import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../store/core.state';
import { ErrorActionTypes, ServerError } from '../store/error';
import { ApiService } from './api.service';
import { ApiServiceErrorHandler } from './api.service.errorhandler';
import { ICM_SERVER_URL, REST_ENDPOINT } from './state-transfer/factories';

describe('Api Service', () => {
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

  it('should create Error Action if  httpClient.get throws Error.', () => {
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
