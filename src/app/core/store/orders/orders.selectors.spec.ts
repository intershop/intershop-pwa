import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { HttpError } from '../../models/http-error/http-error.model';
import { LineItem } from '../../models/line-item/line-item.model';
import { OrderView } from '../../models/order/order.model';
import { Product } from '../../models/product/product.model';
import { coreReducers } from '../core-store.module';
import { LoadProductSuccess } from '../shopping/products';
import { shoppingReducers } from '../shopping/shopping-store.module';

import { LoadOrders, LoadOrdersFail, LoadOrdersSuccess, SelectOrder } from './orders.actions';
import { getOrders, getOrdersLoading, getSelectedOrder, getSelectedOrderId } from './orders.selectors';

describe('Orders Selectors', () => {
  let store$: TestStore;

  const orders = [
    {
      id: '1',
      documentNo: '00000001',
      lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } }] as LineItem[],
    },
    {
      id: '2',
      documentNo: '00000002',
      lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } }] as LineItem[],
    },
  ] as OrderView[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        ...coreReducers,
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
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

  describe('loading orders', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrders());
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'sku' } as Product }));
    });

    it('should set the state to loading', () => {
      expect(getOrdersLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadOrdersSuccess({ orders }));
      });

      it('should set loading to false', () => {
        expect(getOrdersLoading(store$.state)).toBeFalse();

        const loadedOrders = getOrders(store$.state);
        expect(loadedOrders[1].documentNo).toEqual(orders[1].documentNo);
        expect(loadedOrders[1].lineItems).toHaveLength(1);
        expect(loadedOrders[1].lineItems[0].id).toEqual('test');
        expect(loadedOrders[1].lineItems[0].product).toEqual({ sku: 'sku' });
        expect(loadedOrders[1].itemsCount).toEqual(5);
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
});
