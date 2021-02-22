import { TestBed } from '@angular/core/testing';

import { Country } from 'ish-core/models/country/country.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadCountriesSuccess } from './countries.actions';
import { getAllCountries } from './countries.selectors';

describe('Countries Selectors', () => {
  let store$: StoreWithSnapshots;

  const countries = [
    { countryCode: 'BG', name: 'Bulgaria' },
    { countryCode: 'DE', name: 'Germany' },
  ] as Country[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('countries')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any countries when used', () => {
      expect(getAllCountries(store$.state)).toBeEmpty();
    });
  });

  describe('after successful loading', () => {
    beforeEach(() => {
      store$.dispatch(loadCountriesSuccess({ countries }));
    });

    it('should return countries after load', () => {
      expect(getAllCountries(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "countryCode": "BG",
            "name": "Bulgaria",
          },
          Object {
            "countryCode": "DE",
            "name": "Germany",
          },
        ]
      `);
    });
  });
});
