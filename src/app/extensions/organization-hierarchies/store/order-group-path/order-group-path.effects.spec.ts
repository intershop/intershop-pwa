import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { OrderService } from 'ish-core/services/order/order.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadOrdersSuccess } from 'ish-core/store/customer/orders';

import { GroupPathEntry, OrderGroupPath } from '../../models/order-group-path/order-group-path.model';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContextSuccess } from '../buying-context';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadOrdersWithGroupPaths, loadOrdersWithGroupPathsSuccess } from './order-group-path.actions';
import { OrderGroupPathEffects } from './order-group-path.effects';

describe('Order Group Path Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrderGroupPathEffects;
  let orgServiceMock: OrganizationHierarchiesService;
  let orderServiceMock: OrderService;
  let store$: Store;

  const orderWithBuyingContent = { id: '1', documentNo: '00000001', lineItems: [] } as Order;
  const orderWithoutBuyingContent = { id: '2', documentNo: '00000002', lineItems: [] } as Order;
  const orders = [orderWithBuyingContent, orderWithoutBuyingContent];
  const rootGroup = { id: 'rootID', name: 'rootName' } as OrganizationGroup;
  const leafGroupGroup = { id: 'leafID', name: 'leafName', parentid: 'groupID' } as OrganizationGroup;
  const rootGroupPathEntry = { groupId: rootGroup.id, groupName: rootGroup.name } as GroupPathEntry;
  const subGroupGroupPathEntry = { groupId: 'groupID', groupName: 'groupName' } as GroupPathEntry;
  const leafGroupPathEntry = { groupId: leafGroupGroup.id, groupName: leafGroupGroup.name } as GroupPathEntry;
  const orderGroupPath = {
    organizationId: 'orgID',
    groupPath: [rootGroupPathEntry, subGroupGroupPathEntry, leafGroupPathEntry] as GroupPathEntry[],
    groupId: leafGroupPathEntry.groupId,
    groupName: leafGroupPathEntry.groupName,
    orderId: orderWithBuyingContent.id,
  } as OrderGroupPath;
  const orderGroupPaths = [orderGroupPath] as OrderGroupPath[];
  const buyingContext = orderGroupPath.groupId.concat('@', orderGroupPath.organizationId);

  beforeEach(() => {
    orgServiceMock = mock(OrganizationHierarchiesService);
    orderServiceMock = mock(OrderService);
    when(orgServiceMock.getOrders(anything(), buyingContext)).thenReturn(
      of({ orders: [orderWithBuyingContent] as Order[], paths: orderGroupPaths })
    );
    when(orderServiceMock.getOrders()).thenReturn(of(orders));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        OrganizationHierarchiesStoreModule.forTesting('buyingContext', 'orderGroupPath'),
      ],
      providers: [
        OrderGroupPathEffects,
        provideMockActions(() => actions$),
        [
          { provide: OrganizationHierarchiesService, useFactory: () => instance(orgServiceMock) },
          { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        ],
      ],
    });

    effects = TestBed.inject(OrderGroupPathEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadOrdersWithGroupPaths$', () => {
    beforeEach(() => {
      store$.dispatch(assignBuyingContextSuccess({ group: leafGroupGroup, bctx: buyingContext }));
    });

    it('should dispatch loadGroupsSuccess and loadOrdersWithGroupPathsSuccess actions when encountering LoadOrdersWithGroupPaths actions with non root group', () => {
      const action = loadOrdersWithGroupPaths();
      const completion1 = loadOrdersSuccess({ orders: [orderWithBuyingContent] as Order[] });
      const completion2 = loadOrdersWithGroupPathsSuccess({ paths: orderGroupPaths });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.loadOrdersWithGroupPaths$).toBeObservable(expected$);
    });

    it('should dispatch loadGroupsSuccess actions when encountering LoadOrdersWithGroupPaths actions with root group', () => {
      store$.dispatch(
        assignBuyingContextSuccess({ group: rootGroup, bctx: rootGroup.id.concat('@', orderGroupPath.organizationId) })
      );
      const action = loadOrdersWithGroupPaths();
      const completion = loadOrdersSuccess({ orders });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrdersWithGroupPaths$).toBeObservable(expected$);
    });
  });
});
