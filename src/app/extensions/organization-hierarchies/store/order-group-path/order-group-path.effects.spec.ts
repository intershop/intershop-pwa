import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadOrdersSuccess } from 'ish-core/store/customer/orders';

import { GroupPathEntry, OrderGroupPath } from '../../models/order-group-path/order-group-path.model';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContextSuccess } from '../buying-context';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadOrdersWithGroupPaths, loadOrdersWithGroupPathsSuccess } from './order-group-path.actions';
import { OrderGroupPathEffects } from './order-group-path.effects';

describe('Order Group Path Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrderGroupPathEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let store$: Store;

  const order = { id: '1', documentNo: '00000001', lineItems: [] } as Order;
  const orders = [order, { id: '2', documentNo: '00000002' }] as Order[];
  const rootGroupPathEntry = { groupId: 'rootID', groupName: 'rootName' } as GroupPathEntry;
  const subGroupGroupPathEntry = { groupId: 'groupID', groupName: 'groupName' } as GroupPathEntry;
  const leafGroupPathEntry = { groupId: 'leafID', groupName: 'leafName' } as GroupPathEntry;
  const orderGroupPath = {
    organizationId: 'orgID',
    groupPath: [rootGroupPathEntry, subGroupGroupPathEntry, leafGroupPathEntry] as GroupPathEntry[],
    groupId: leafGroupPathEntry.groupId,
    groupName: leafGroupPathEntry.groupName,
    orderId: order.id,
  } as OrderGroupPath;
  const orderGroupPaths = [orderGroupPath] as OrderGroupPath[];
  const buyingContext = orderGroupPath.groupId.concat('@', orderGroupPath.organizationId);

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    when(orgServiceMock.getOrders(anything(), buyingContext)).thenReturn(of({ orders, paths: orderGroupPaths }));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        OrganizationHierarchiesStoreModule.forTesting('buyingContext', 'orderGroupPath'),
      ],
      providers: [
        OrderGroupPathEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
      ],
    });

    effects = TestBed.inject(OrderGroupPathEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadOrdersWithGroupPaths$', () => {
    beforeEach(() => {
      store$.dispatch(assignBuyingContextSuccess({ bctx: buyingContext }));
    });

    it('should dispatch loadGroupsSuccess and loadOrdersWithGroupPathsSuccess actions when encountering LoadOrdersWithGroupPaths actions', () => {
      const action = loadOrdersWithGroupPaths();
      const completion1 = loadOrdersSuccess({ orders });
      const completion2 = loadOrdersWithGroupPathsSuccess({ paths: orderGroupPaths });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.loadOrdersWithGroupPaths$).toBeObservable(expected$);
    });
  });
});
