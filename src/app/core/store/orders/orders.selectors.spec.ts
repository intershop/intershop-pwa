import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Order } from '../../../models/order/order.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { coreReducers } from '../core.system';
import { LoadOrders, LoadOrdersFail, LoadOrdersSuccess } from './orders.actions';
import { getOrders, getOrdersLoading } from './orders.selectors';

describe('Orders Selectors', () => {
  let store$: LogEffects;

  const orders = [{ id: '1', documentNo: '00000001' }, { id: '2', documentNo: '00000002' }] as Order[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers), EffectsModule.forRoot([LogEffects])],
    });

    store$ = TestBed.get(LogEffects);
  });

  describe('with empty state', () => {
    it('should not select any orders if no data are loaded', () => {
      expect(getOrders(store$.state)).toBeEmpty();
      expect(getOrdersLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading orders', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrders());
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
        expect(getOrders(store$.state)).toEqual(orders);
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
});
