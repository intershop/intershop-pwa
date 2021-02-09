import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { OrganizationGroup } from '../models/organization-group/organization-group.model';
import { getSelectedGroupPath } from '../store/group';

import { TxSelectedGroupInterceptor } from './tx-selected-group.interceptor';

describe('Tx Selected Group Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  const selectedGroups: OrganizationGroup[] = [{ id: 'single', name: 'Single Name' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TxSelectedGroupInterceptor, multi: true },
        provideMockStore({
          initialState: { organizationHierarchies: {} },
          selectors: [{ selector: getSelectedGroupPath, value: selectedGroups }],
        }),
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should include a BuyingGroupID header value for a singular group', done => {
    http.get('some').subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );

    const request = httpController.expectOne('some');
    request.flush('All good');
    expect(request.request.headers.get('BuyingGroupID')).toEqual('single');
  });

  it('should NOT include a BuyingGroupID header value if request already has one', done => {
    http.get('some', { headers: { BuyingGroupID: 'existing' } }).subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );

    const request = httpController.expectOne('some');
    request.flush('All good');
    expect(request.request.headers.get('BuyingGroupID')).toEqual('existing');
  });
});

describe('Tx Selected Group Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should include a BuyingGroupID header value for a singular group', done => {
    http.get('some').subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );

    const request = httpController.expectOne('some');
    request.flush('All good');
    expect(request.request.headers.get('BuyingGroupID')).toBeFalsy();
  });
});

describe('Tx Selected Group Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should NOT include a BuyingGroupID header value if organizationHierarchies store is not yet created', done => {
    http.get('some').subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );

    const request = httpController.expectOne('some');
    request.flush('All good');
    expect(request.request.headers.get('BuyingGroupID')).toBeFalsy();
  });
});
