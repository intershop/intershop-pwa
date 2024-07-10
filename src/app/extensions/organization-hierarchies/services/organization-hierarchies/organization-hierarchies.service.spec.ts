import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { OrganizationHierarchiesService } from './organization-hierarchies.service';

describe('Organization Hierarchies Service', () => {
  let apiServiceMock: ApiService;
  let organizationHierarchiesService: OrganizationHierarchiesService;

  const customer = { customerNo: 'testNumber' } as Customer;
  const buyingContext = 'testGroup';

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration'])],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [{ selector: getLoggedInCustomer, value: customer }],
        }),
      ],
    });
    organizationHierarchiesService = TestBed.inject(OrganizationHierarchiesService);
    TestBed.inject(Store);
  });

  describe('getOrders', () => {
    it("should get orders when 'getOrders' is called with amount", done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(of([]));

      organizationHierarchiesService.getOrders({ limit: 30 }, buyingContext).subscribe(() => {
        verify(
          apiServiceMock.get(
            'orders'.concat('?include=buyingContext&filter[buyingContext]=').concat(buyingContext),
            anything()
          )
        ).once();
        const options: AvailableOptions = capture(apiServiceMock.get).last()[1];
        expect(options.params?.toString()).toMatchInlineSnapshot(`"limit=30&page%5Blimit%5D=30"`);
        done();
      });
    });
  });

  describe('getGroups', () => {
    const customer = { customerNo: 'testNumber' } as Customer;

    it("should get groups when 'getGroups' is called", done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: [] }));
      const url = 'organizations/'.concat(customer.customerNo).concat('/groups');
      organizationHierarchiesService.getGroups(customer).subscribe(() => {
        verify(apiServiceMock.get(url, anything())).once();
        done();
      });
    });
  });

  describe('createGroup', () => {
    const customer = { customerNo: 'testNumber' } as Customer;
    const root = { displayName: 'root', id: 'rootID' };
    const newGroup = { displayName: 'newGroup', id: 'newGroupId' };

    it("should create group when 'createGroup' is called", done => {
      when(apiServiceMock.post(anything(), anything(), anything())).thenReturn(
        of({ data: { id: anyString(), attributes: { name: anyString(), description: anyString() } } })
      );
      const url = 'organizations/'.concat(customer.customerNo).concat('/groups');
      organizationHierarchiesService.createGroup(root.id, newGroup).subscribe(() => {
        verify(apiServiceMock.post(url, anything(), anything())).once();
        done();
      });
    });
  });

  describe('deleteGroup', () => {
    const customer = { customerNo: 'testNumber' } as Customer;
    const group = { displayName: 'group', id: 'groupID' };

    it("should delete group when 'deleteGroup' is called", done => {
      when(apiServiceMock.delete(anything(), anything())).thenReturn(of({}));
      const url = 'organizations/'.concat(customer.customerNo).concat('/groups/').concat(group.id);
      organizationHierarchiesService.deleteGroup(group.id).subscribe(() => {
        verify(apiServiceMock.delete(url, anything())).once();
        done();
      });
    });
  });
});
