import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadOrdersFail, loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { assignBuyingContextSuccess } from '../buying-context/buying-context.actions';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadOrderForBuyingContext } from './order.actions';
import { OrderEffects } from './order.effects';

describe('Order Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrderEffects;
  let organizationHierarchiesServiceMock: OrganizationHierarchiesService;
  let store$: Store;

  const bctx = 'Anna@Aaron';
  const order = { id: '1', documentNo: '00000001', lineItems: [] } as Order;
  const orders = [order, { id: '2', documentNo: '00000002' }] as Order[];

  beforeEach(() => {
    organizationHierarchiesServiceMock = mock(OrganizationHierarchiesService);
    when(organizationHierarchiesServiceMock.getOrders(anyNumber(), anyString())).thenReturn(of(orders));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
        OrganizationHierarchiesStoreModule.forTesting('group', 'buyingContext'),
      ],
      providers: [
        OrderEffects,
        provideMockActions(() => actions$),
        { provide: OrganizationHierarchiesService, useFactory: () => instance(organizationHierarchiesServiceMock) },
      ],
    });

    effects = TestBed.inject(OrderEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadOrderByBuyingContext$', () => {
    beforeEach(() => {
      store$.dispatch(assignBuyingContextSuccess({ bctx }));
    });

    it('should call the organizationHierarchiesService for loadOrders', done => {
      const action = loadOrderForBuyingContext();
      actions$ = of(action);

      effects.loadOrderByBuyingContext$.subscribe(() => {
        verify(organizationHierarchiesServiceMock.getOrders(30, OrderEffects.include.concat(bctx))).once();
        done();
      });
    });

    it('should load all orders of a buyingContext and dispatch a LoadOrdersSuccess action', () => {
      const action = loadOrderForBuyingContext();
      const completion = loadOrdersSuccess({ orders });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByBuyingContext$).toBeObservable(expected$);
    });

    it('should dispatch a LoadOrdersFail action if a load error occurs', () => {
      when(organizationHierarchiesServiceMock.getOrders(anyNumber(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'error' }))
      );

      const action = loadOrderForBuyingContext();
      const completion = loadOrdersFail({ error: makeHttpError({ message: 'error' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderByBuyingContext$).toBeObservable(expected$);
    });
  });
});
