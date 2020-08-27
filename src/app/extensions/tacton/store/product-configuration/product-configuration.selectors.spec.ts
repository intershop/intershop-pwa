import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { TactonStoreModule } from '../tacton-store.module';

import { startConfigureTactonProduct } from './product-configuration.actions';
import { getProductConfigurationLoading } from './product-configuration.selectors';

describe('Product Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), TactonStoreModule.forTesting('productConfiguration')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getProductConfigurationLoading(store$.state)).toBeFalse();
    });
  });

  describe('when starting a configuration', () => {
    const action = startConfigureTactonProduct({ productPath: 'tab/product' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getProductConfigurationLoading(store$.state)).toBeTrue();
    });
  });
});
