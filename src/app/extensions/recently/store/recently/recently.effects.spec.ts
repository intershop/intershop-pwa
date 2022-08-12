import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { getServerConfig } from 'ish-core/store/core/server-config';
import { getSelectedProduct } from 'ish-core/store/shopping/products';

import { addToRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';

describe('Recently Effects', () => {
  let effects: RecentlyEffects;
  let store$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), RecentlyEffects],
    });

    effects = TestBed.inject(RecentlyEffects);
    store$ = TestBed.inject(MockStore);

    // workaround: overrideSelector is not working for selectors with parameters https://github.com/ngrx/platform/issues/2717
    store$.overrideSelector(getServerConfig, {
      _config: { preferences: { ChannelPreferences: { EnableAdvancedVariationHandling: true } } },
    });
  });

  describe('viewedProduct$', () => {
    it('should fire when product is in store and selected', () => {
      store$.overrideSelector(getSelectedProduct, { sku: 'A' } as ProductView);

      expect(effects.viewedProduct$).toBeObservable(cold('a', { a: addToRecently({ sku: 'A' }) }));
    });

    it('should not fire when product failed loading', () => {
      store$.overrideSelector(getSelectedProduct, { sku: 'A', failed: true } as ProductView);

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });

    it('should not fire when product is deselected', () => {
      store$.overrideSelector(getSelectedProduct, undefined);

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });
  });
});
