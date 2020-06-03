import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { OrderView } from 'ish-core/models/order/order.model';
import { Product } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core-store.module';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  LoadOrder,
  LoadOrderSuccess,
  LoadOrders,
  LoadOrdersFail,
  LoadOrdersSuccess,
  SelectOrder,
} from './orders.actions';
import {
  getOrder,
  getOrders,
  getOrdersError,
  getOrdersLoading,
  getSelectedOrder,
  getSelectedOrderId,
} from './orders.selectors';

describe('Orders Selectors', () => {
  let store$: StoreWithSnapshots;

  const orders = [
    {
      id: '1',
      documentNo: '00000001',
      lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 3 } }] as LineItem[],
    },
    {
      id: '2',
      documentNo: '00000002',
      lineItems: [{ id: 'test2', productSKU: 'sku', quantity: { value: 5 } }] as LineItem[],
    },
  ] as OrderView[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['orders']), ShoppingStoreModule.forTesting('products', 'categories')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any orders if no data are loaded', () => {
      expect(getOrders(store$.state)).toBeEmpty();
      expect(getOrdersLoading(store$.state)).toBeFalse();
    });

    it('should not select a current order if no data are loaded', () => {
      expect(getSelectedOrder(store$.state)).toBeUndefined();
      expect(getSelectedOrderId(store$.state)).toBeUndefined();
    });
  });

  describe('select order', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrdersSuccess({ orders }));
      store$.dispatch(new SelectOrder({ orderId: orders[1].id }));
    });
    it('should get a certain order if they are loaded orders', () => {
      expect(getSelectedOrder(store$.state).id).toEqual(orders[1].id);
    });

    it('should not get any order if the previously selected order was not found', () => {
      store$.dispatch(new SelectOrder({ orderId: 'invalid' }));
      expect(getSelectedOrder(store$.state)).toBeUndefined();
    });
  });

  describe('loading orders', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrders());
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'sku' } as Product }));
    });

    it('should set the state to loading', () => {
      expect(getOrdersLoading(store$.state)).toBeTrue();
      expect(getOrdersError(store$.state)).toBeUndefined();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadOrdersSuccess({ orders }));
      });

      it('should set loading to false', () => {
        expect(getOrdersLoading(store$.state)).toBeFalse();
        expect(getOrdersError(store$.state)).toBeUndefined();

        const loadedOrders = getOrders(store$.state);
        expect(loadedOrders[1].documentNo).toEqual(orders[1].documentNo);
        expect(loadedOrders[1].lineItems).toHaveLength(1);
        expect(loadedOrders[1].lineItems[0].id).toEqual('test2');
        expect(loadedOrders[1].lineItems[0].product).toHaveProperty('sku', 'sku');
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadOrdersFail({ error: { message: 'error', error: 'errorMessage' } as HttpError }));
      });

      it('should not have loaded orders on error', () => {
        expect(getOrdersLoading(store$.state)).toBeFalse();
        expect(getOrdersError(store$.state).error).toBe('errorMessage');
        expect(getOrders(store$.state)).toBeEmpty();
      });
    });
  });

  describe('loading order', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrder({ orderId: orders[0].id }));
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'sku' } as Product }));
    });

    it('should set the state to loading', () => {
      expect(getOrdersLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadOrderSuccess({ order: orders[0] }));
      });

      it('should set loading to false', () => {
        expect(getOrdersLoading(store$.state)).toBeFalse();

        const loadedOrder = getOrder(store$.state, { orderId: orders[0].id });
        expect(loadedOrder.documentNo).toEqual(orders[0].documentNo);
        expect(loadedOrder.lineItems).toHaveLength(1);
        expect(loadedOrder.lineItems[0].id).toEqual('test');
        expect(loadedOrder.lineItems[0].product).toHaveProperty('sku', 'sku');
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadOrdersFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded orders on error', () => {
        expect(getOrdersLoading(store$.state)).toBeFalse();
        expect(getOrders(store$.state)).toBeEmpty();
      });
    });
  });
});
