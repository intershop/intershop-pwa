import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { Customer } from 'ish-core/models/customer/customer.model';
import { getRestEndpoint } from 'ish-core/store/core/configuration';
import { getLoggedInCustomer } from 'ish-core/store/customer/user/user.selectors';

import { OrganizationGroup } from '../models/organization-group/organization-group.model';
import { getSelectedGroupDetails } from '../store/group';

import { TxSelectedGroupInterceptor } from './tx-selected-group.interceptor';

describe('Tx Selected Group Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  const selectedGroup: OrganizationGroup = { id: 'single', name: 'Single Name' };
  const customer: Customer = { customerNo: 'TestCompany' };
  const BASE_URL = 'http://example.org/WFS/site/REST';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TxSelectedGroupInterceptor, multi: true },
        provideMockStore({
          initialState: { organizationHierarchies: {} },
          selectors: [
            { selector: getRestEndpoint, value: BASE_URL },
            { selector: getLoggedInCustomer, value: customer },
            { selector: getSelectedGroupDetails, value: selectedGroup },
          ],
        }),
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should include the BuyingGroupID value in the url for a singular group', done => {
    http.get(BASE_URL + '/some').subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );
    const requests = httpController.match({ method: 'get' });
    requests[0].flush('All good');
    expect(requests[0].request.url).toContain(
      ';'.concat(
        TxSelectedGroupInterceptor.matrixparam,
        '=',
        selectedGroup.id,
        TxSelectedGroupInterceptor.seperator,
        customer.customerNo
      )
    );
  });

  it('should NOT include a BuyingGroupID value in the url if request already has one', done => {
    http.get(BASE_URL.concat(';', TxSelectedGroupInterceptor.matrixparam, '=existing/some')).subscribe(
      response => {
        expect(response).toBeTruthy();
      },
      error => {
        expect(error).toBeFalsy();
      },
      done
    );

    const requests = httpController.match({ method: 'get' });
    requests[0].flush('All good');
    expect(requests[0].request.url).toContain(';'.concat(TxSelectedGroupInterceptor.matrixparam, '=existing'));
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

  it('should include a BuyingGroupID in the url for a singular group', done => {
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

  it('should NOT include a BuyingGroupID in the url if organizationHierarchies store is not yet created', done => {
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
