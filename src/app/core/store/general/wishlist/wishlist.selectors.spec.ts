import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadWishlist } from './wishlist.actions';
import { getWishlistLoading } from './wishlist.selectors';

describe('Wishlist Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('wishlist')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getWishlistLoading(store$.state)).toBeFalse();
    });
  });

  describe('loadWishlist', () => {
    const action = loadWishlist({ id: 'testId', owner: 'testOwner', secureCode: 'testSecureCode' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getWishlistLoading(store$.state)).toBeTrue();
    });
  });
});
