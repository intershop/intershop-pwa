import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { GroupPathEntry, OrderGroupPath } from '../../models/order-group-path/order-group-path.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadOrdersWithGroupPaths, loadOrdersWithGroupPathsSuccess } from './order-group-path.actions';
import { getOrderGroupPathDetails } from './order-group-path.selectors';

describe('Order Group Path Selectors', () => {
  let store$: StoreWithSnapshots;

  const entry = [
    { groupId: 'rootID', groupName: 'rootName' },
    { groupId: 'leafID', groupName: 'leafName' },
  ] as GroupPathEntry[];
  const paths = [
    { organizationId: '1', groupPath: entry, groupId: 'leafID', groupName: 'leafName', orderId: '00000001' },
  ] as OrderGroupPath[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), OrganizationHierarchiesStoreModule.forTesting('orderGroupPath')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    const action = loadOrdersWithGroupPaths();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should not have entities when in initial state', () => {
      expect(getOrderGroupPathDetails(paths[0].orderId)(store$.state)).toBeUndefined();
    });
  });

  describe('loading order group paths', () => {
    beforeEach(() => {
      store$.dispatch(loadOrdersWithGroupPathsSuccess({ paths }));
    });

    it('should get entity for valid id', () => {
      expect(getOrderGroupPathDetails(paths[0].orderId)(store$.state)).toMatchInlineSnapshot(`
      {
        "groupId": "leafID",
        "groupName": "leafName",
        "groupPath": [
          {
            "groupId": "rootID",
            "groupName": "rootName",
          },
          {
            "groupId": "leafID",
            "groupName": "leafName",
          },
        ],
        "orderId": "00000001",
        "organizationId": "1",
      }
      `);
    });
    it('should get no entity for invalid id', () => {
      expect(getOrderGroupPathDetails('invalidId')(store$.state)).toBeUndefined();
    });
  });
});
