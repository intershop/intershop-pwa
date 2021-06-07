import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContextSuccess } from '../buying-context/buying-context.actions';
import {
  loadOrdersWithGroupPaths,
  loadOrdersWithGroupPathsFail,
  loadOrdersWithGroupPathsSuccess,
} from '../order-group-path';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';
import { OrderGroupPathEffects } from './order-group-path.effects';

describe('Order Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrderGroupPathEffects;
  let organizationHierarchiesServiceMock: OrganizationHierarchiesService;
  let store$: Store;

  const bctx = 'Anna@Aaron';
  const order = { id: '1', documentNo: '00000001', lineItems: [] } as Order;
  const orders = [order, { id: '2', documentNo: '00000002' }] as Order[];
  const paths = [
    {
      organizationId: 'orgID',
      groupPath: [{ groupId: 'gID', groupName: 'groupName' }],
      groupId: 'gID',
      groupName: 'groupName',
      orderId: '00000001',
    },
  ];

  beforeEach(() => {
    organizationHierarchiesServiceMock = mock(OrganizationHierarchiesService);
    when(organizationHierarchiesServiceMock.getOrders(anyNumber(), anyString())).thenReturn(of({ orders, paths }));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), OrganizationHierarchiesStoreModule.forTesting('buyingContext')],
      providers: [
        OrderGroupPathEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(organizationHierarchiesServiceMock) },
      ],
    });

    effects = TestBed.inject(OrderGroupPathEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadOrdersWithGroupPaths$', () => {
    beforeEach(() => {
      store$.dispatch(assignBuyingContextSuccess({ bctx }));
    });

    it('should call the organizationHierarchiesService for loadOrders', done => {
      const action = loadOrdersWithGroupPaths();
      actions$ = of(action);

      effects.loadOrdersWithGroupPaths$.subscribe(() => {
        verify(organizationHierarchiesServiceMock.getOrders(30, OrderGroupPathEffects.include.concat(bctx))).once();
        done();
      });
    });

    it('should load all orders of a buyingContext and dispatch a LoadOrdersSuccess action', () => {
      const action = loadOrdersWithGroupPaths();
      const completion1 = loadOrdersSuccess({ orders });
      const completion2 = loadOrdersWithGroupPathsSuccess({ paths });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.loadOrdersWithGroupPaths$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrdersWithGroupPathsFail action if a load order group path error occurs', () => {
      when(organizationHierarchiesServiceMock.getOrders(anyNumber(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = loadOrdersWithGroupPaths();
      const error = makeHttpError({ message: 'invalid' });
      const completion = loadOrdersWithGroupPathsFail({ error });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadOrdersWithGroupPaths$).toBeObservable(expected$);
    });
  });
});
