import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  ProductNotification,
  ProductNotificationType,
} from '../../models/product-notification/product-notification.model';
import { ProductNotificationsStoreModule } from '../product-notifications-store.module';

import { productNotificationsActions, productNotificationsApiActions } from './product-notification.actions';
import {
  getAllProductNotifications,
  getProductNotificationsError,
  getProductNotificationsLoading,
} from './product-notification.selectors';

describe('Product Notification Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ProductNotificationsStoreModule.forTesting('productNotifications')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getProductNotificationsLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getProductNotificationsError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getAllProductNotifications(store$.state)).toBeEmpty();
    });
  });

  describe('LoadProductNotifications', () => {
    const action = productNotificationsActions.loadProductNotifications({ type: 'price' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getProductNotificationsLoading(store$.state)).toBeTrue();
    });
  });

  describe('productNotificationsActions.loadProductNotificationsSuccess', () => {
    const productNotifications = [
      {
        id: '1_price',
        type: 'price',
        sku: '1',
        notificationMailAddress: 'a.b@c.de',
      },
      {
        id: '2_stock',
        type: 'stock',
        sku: '2',
        notificationMailAddress: 'a.b@c.de',
      },
    ] as ProductNotification[];

    const type: ProductNotificationType = 'price';

    beforeEach(() => {
      store$.dispatch(productNotificationsApiActions.loadProductNotificationsSuccess({ productNotifications, type }));
    });

    it('should set loading to false', () => {
      expect(getProductNotificationsLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when successfully loaded entities', () => {
      expect(getProductNotificationsError(store$.state)).toBeUndefined();
    });

    it('should add product notifications to state', () => {
      expect(getAllProductNotifications(store$.state)).toEqual(productNotifications);
    });
  });

  describe('loadProductNotificationsFail', () => {
    beforeEach(() => {
      store$.dispatch(
        productNotificationsApiActions.loadProductNotificationsFail({ error: makeHttpError({ message: 'error' }) })
      );
    });

    it('should set loading to false', () => {
      expect(getProductNotificationsLoading(store$.state)).toBeFalse();
    });

    it('should have an error when reducing', () => {
      expect(getProductNotificationsError(store$.state)).toBeTruthy();
    });
  });
});
