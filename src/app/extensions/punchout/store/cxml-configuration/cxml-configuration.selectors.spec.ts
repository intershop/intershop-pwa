import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { PunchoutStoreModule } from '../punchout-store.module';

import { cxmlConfigurationActions, cxmlConfigurationApiActions } from './cxml-configuration.actions';
import { getCxmlConfiguration } from './cxml-configuration.selectors';

describe('Cxml Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), PunchoutStoreModule.forTesting('cxmlConfiguration')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have entities when in initial state', () => {
      expect(getCxmlConfiguration(store$.state)).toBeEmpty();
    });
  });

  describe('loadCxmlConfiguration', () => {
    const action = cxmlConfigurationActions.loadCXMLConfiguration(undefined);

    beforeEach(() => {
      store$.dispatch(action);
    });

    describe('loadCXMLConfigurationSuccess', () => {
      const successAction = cxmlConfigurationApiActions.loadCXMLConfigurationSuccess({
        configuration: [{ name: 'unitmapping', value: '' }],
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should have data when successfully loading', () => {
        expect(getCxmlConfiguration(store$.state)).toMatchInlineSnapshot(`
          [
            {
              "name": "unitmapping",
              "value": "",
            },
          ]
        `);
      });
    });

    describe('loadCXMLConfigurationFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = cxmlConfigurationApiActions.loadCXMLConfigurationFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });
    });
  });
});
