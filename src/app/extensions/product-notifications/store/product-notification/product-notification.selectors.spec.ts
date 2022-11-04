import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { ProductNotificationsStoreModule } from '../product-notifications-store.module';

import { loadProductNotifications } from './product-notification.actions';
import { getProductNotificationsLoading } from './product-notification.selectors';

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
  });

  describe('loadProductNotification', () => {
    const action = loadProductNotifications();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getProductNotificationsLoading(store$.state)).toBeTrue();
    });
  });
});
