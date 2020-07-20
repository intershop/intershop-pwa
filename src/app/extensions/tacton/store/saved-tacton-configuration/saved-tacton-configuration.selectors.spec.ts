import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonStoreModule } from '../tacton-store.module';

import { saveTactonConfigurationReference } from './saved-tacton-configuration.actions';
import { getSavedTactonConfigurationEntities } from './saved-tacton-configuration.selectors';

describe('Saved Tacton Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), TactonStoreModule.forTesting('_savedTactonConfiguration')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be empty when in initial state', () => {
      expect(getSavedTactonConfigurationEntities(store$.state)).toBeEmpty();
    });
  });

  describe('after saving reference', () => {
    const action = saveTactonConfigurationReference({
      tactonProduct: 'tab/product',
      configuration: { configId: 'ABC', externalId: 'some' } as TactonProductConfiguration,
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should save entity to state', () => {
      expect(getSavedTactonConfigurationEntities(store$.state)).not.toBeEmpty();
      expect(getSavedTactonConfigurationEntities(store$.state)['tab/product']).toMatchInlineSnapshot(`
        Object {
          "configId": "ABC",
          "externalId": "some",
          "id": "tab/product",
        }
      `);
    });
  });
});
