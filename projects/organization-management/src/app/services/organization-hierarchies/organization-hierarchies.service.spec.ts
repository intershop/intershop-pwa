import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { OrganizationHierarchiesService } from './organization-hierarchies.service';

describe('Organization Hierarchies Service', () => {
  let apiServiceMock: ApiService;
  let organizationHierarchiesService: OrganizationHierarchiesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    organizationHierarchiesService = TestBed.inject(OrganizationHierarchiesService);
  });

  it('should be created', () => {
    expect(organizationHierarchiesService).toBeTruthy();
  });
});
