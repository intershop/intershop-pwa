import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Product } from 'ish-core/models/product/product.model';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { LoadProductFail, LoadProductSuccess, SelectProduct } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AddToRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';

describe('Recently Effects', () => {
  let actions$: Observable<Action>;
  let effects: RecentlyEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        ngrxTesting({
          reducers: {
            configuration: configurationReducer,
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      providers: [RecentlyEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(RecentlyEffects);
    store$ = TestBed.get(Store);

    store$.dispatch(new ApplyConfiguration({ features: [] }));
  });

  describe('viewedProduct$', () => {
    it('should not fire when product is not yet loaded', () => {
      actions$ = hot('a', { a: new SelectProduct({ sku: 'A' }) });

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });

    it('should fire when product is in store and selected', () => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'A' } as Product }));
      store$.dispatch(new SelectProduct({ sku: 'A' }));

      expect(effects.viewedProduct$).toBeObservable(cold('a', { a: new AddToRecently({ sku: 'A' }) }));
    });

    it('should not fire when product failed loading', () => {
      store$.dispatch(new LoadProductFail({ error: {} as HttpError, sku: 'A' }));
      store$.dispatch(new SelectProduct({ sku: 'A' }));

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });

    it('should not fire when product is deselected', () => {
      store$.dispatch(new SelectProduct({ sku: undefined }));

      expect(effects.viewedProduct$).toBeObservable(cold('------'));
    });
  });
});
