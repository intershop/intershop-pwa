import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, combineReducers } from '@ngrx/store';

import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { OrderView } from '../../../models/order/order.model';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { LogEffects } from '../../../utils/dev/log.effects';
import { coreReducers } from '../core.system';

import { LoadOrders, LoadOrdersFail, LoadOrdersSuccess, SelectOrder } from './orders.actions';
import { getOrders, getOrdersLoading, getSelectedOrder, getSelectedOrderId } from './orders.selectors';

describe('Orders Selectors', () => {
  let store$: LogEffects;

  const orders = [
    {
      id: '1',
      documentNo: '00000001',
      lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } }] as BasketItem[],
    },
    {
      id: '2',
      documentNo: '00000002',
      lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } }] as BasketItem[],
    },
  ] as OrderView[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
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
      store$.dispatch(new LoadProductSuccess({ sku: 'sku' } as Product));
    });

    it('should set the state to loading', () => {
      expect(getOrdersLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadOrdersSuccess(orders));
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
        store$.dispatch(new LoadOrdersFail({ message: 'error' } as HttpError));
      });

      it('should not have loaded orders on error', () => {
        expect(getOrdersLoading(store$.state)).toBeFalse();
        expect(getOrders(store$.state)).toBeEmpty();
      });
    });
  });
  describe('select order', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrdersSuccess(orders));
      store$.dispatch(new SelectOrder(orders[1].id));
    });
    it('should get a certain order if they are loaded orders', () => {
      expect(getSelectedOrder(store$.state).id).toEqual(orders[1].id);
    });

    it('should not get any order if the previously selected order was not found', () => {
      store$.dispatch(new SelectOrder('invalid'));
      expect(getSelectedOrder(store$.state)).toBeUndefined();
    });
  });
});
