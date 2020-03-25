import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { getFeatures } from 'ish-core/store/configuration';
import { getSelectedProduct } from 'ish-core/store/shopping/products';

import { AddToRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';

describe('Recently Effects', () => {
  let effects: RecentlyEffects;
  let store$: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule],
      providers: [RecentlyEffects, provideMockStore({ selectors: [{ selector: getFeatures, value: [] }] })],
    });

    effects = TestBed.get(RecentlyEffects);
    store$ = TestBed.get(MockStore);
  });

  describe('viewedProduct$', () => {
    it('should fire when product is in store and selected', () => {
      store$.overrideSelector(getSelectedProduct, { sku: 'A' } as ProductView);

      expect(effects.viewedProduct$).toBeObservable(cold('a', { a: new AddToRecently({ sku: 'A' }) }));
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
