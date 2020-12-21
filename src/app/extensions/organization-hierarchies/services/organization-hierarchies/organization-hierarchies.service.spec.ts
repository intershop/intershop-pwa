import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { getICMBaseURL } from 'ish-core/store/core/configuration';

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
          selectors: [{ selector: getICMBaseURL, value: 'bla' }],
        }),
      ],
    });
    organizationHierarchiesService = TestBed.inject(OrganizationHierarchiesService);
  });

  it('should be created', () => {
    expect(organizationHierarchiesService).toBeTruthy();
  });
});
