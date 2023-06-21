import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  getOciConfiguration,
  getOciConfigurationError,
  getOciConfigurationLoading,
  getOciFormatters,
  getOciPlaceholders,
  ociConfigurationActions,
  ociConfigurationApiActions,
} from '../oci-configuration';
import { PunchoutStoreModule } from '../punchout-store.module';

describe('Oci Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), PunchoutStoreModule.forTesting('ociConfiguration')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getOciConfigurationLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getOciConfigurationError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getOciConfiguration(store$.state)).toBeEmpty();
    });

    it('should not have available formatters when in initial state', () => {
      expect(getOciFormatters(store$.state)).toBeUndefined();
    });

    it('should not have available placeholders when in initial state', () => {
      expect(getOciPlaceholders(store$.state)).toBeUndefined();
    });
  });

  describe('loadOciConfigurationOptions', () => {
    const action = ociConfigurationActions.loadOciConfigurationOptions();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOciConfigurationLoading(store$.state)).toBeTrue();
    });

    describe('loadOciConfigurationOptionsSuccess', () => {
      const availableFormatters = ['Lowercase', 'Uppercase'];
      const availablePlaceholders = ['Currency', 'Price'];
      const successAction = ociConfigurationApiActions.loadOciConfigurationOptionsSuccess({
        options: { availableFormatters, availablePlaceholders },
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getOciConfigurationLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getOciConfigurationError(store$.state)).toBeUndefined();
      });

      it('should have data when successfully loading', () => {
        expect(getOciFormatters(store$.state)).toMatchInlineSnapshot(`
          [
            "Lowercase",
            "Uppercase",
          ]
        `);
        expect(getOciPlaceholders(store$.state)).toMatchInlineSnapshot(`
          [
            "Currency",
            "Price",
          ]
        `);
      });
    });

    describe('loadOciConfigurationOptionsFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = ociConfigurationApiActions.loadOciConfigurationOptionsFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getOciConfigurationLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getOciConfigurationError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getOciFormatters(store$.state)).toBeUndefined();
        expect(getOciPlaceholders(store$.state)).toBeUndefined();
      });
    });
  });

  describe('loadOciConfiguration', () => {
    const action = ociConfigurationActions.loadOciConfiguration();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOciConfigurationLoading(store$.state)).toBeTrue();
    });

    describe('loadOciConfigurationSuccess', () => {
      const configuration = [
        {
          field: 'NEW_ITEM-UNIT',
          transform: '',
          formatter: '',
        },
      ];
      const successAction = ociConfigurationApiActions.loadOciConfigurationSuccess({
        configuration,
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getOciConfigurationLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getOciConfigurationError(store$.state)).toBeUndefined();
      });

      it('should have data when successfully loading', () => {
        expect(getOciConfiguration(store$.state)).toMatchInlineSnapshot(`
          [
            {
              "field": "NEW_ITEM-UNIT",
              "formatter": "",
              "transform": "",
            },
          ]
        `);
      });
    });

    describe('loadOciConfigurationFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = ociConfigurationApiActions.loadOciConfigurationFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getOciConfigurationLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getOciConfigurationError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getOciConfiguration(store$.state)).toBeEmpty();
      });
    });
  });

  describe('loadOciConfiguration', () => {
    const configuration = [
      {
        field: 'NEW_ITEM-UNIT',
        transform: 'xxx',
        formatter: 'lowerCase',
      },
    ];

    const action = ociConfigurationActions.updateOciConfiguration({ configuration });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOciConfigurationLoading(store$.state)).toBeTrue();
    });

    describe('updateOciConfigurationSuccess', () => {
      const successAction = ociConfigurationApiActions.updateOciConfigurationSuccess({
        configuration,
      });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getOciConfigurationLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getOciConfigurationError(store$.state)).toBeUndefined();
      });

      it('should have data when successfully updated', () => {
        expect(getOciConfiguration(store$.state)).toMatchInlineSnapshot(`
          [
            {
              "field": "NEW_ITEM-UNIT",
              "formatter": "lowerCase",
              "transform": "xxx",
            },
          ]
        `);
      });
    });

    describe('updateOciConfigurationFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = ociConfigurationApiActions.updateOciConfigurationFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getOciConfigurationLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getOciConfigurationError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getOciConfiguration(store$.state)).toBeEmpty();
      });
    });
  });
});
