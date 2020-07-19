import { TestBed } from '@angular/core/testing';

import { Region } from 'ish-core/models/region/region.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadRegions, loadRegionsFail, loadRegionsSuccess } from './regions.actions';
import { getAllRegions, getRegionsByCountryCode, getRegionsLoading } from './regions.selectors';

describe('Regions Selectors', () => {
  let store$: StoreWithSnapshots;

  const countryCode = 'US';

  const allRegions = [
    { name: 'Iowa', regionCode: 'Io', countryCode, id: 'Io' + countryCode },
    { name: 'Alabama', regionCode: 'Al', countryCode: 'US', id: 'Al' + countryCode },
    { name: 'Sofia', regionCode: 'S', countryCode: 'BG,', id: 'SBG' },
  ] as Region[];

  const countryRegions = allRegions.filter(region => region.countryCode === countryCode);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('regions')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any regions when used', () => {
      expect(getAllRegions(store$.state)).toBeEmpty();
      expect(getRegionsLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading regions', () => {
    beforeEach(() => {
      store$.dispatch(loadRegions({ countryCode }));
    });
    it('should set the state to loading', () => {
      expect(getRegionsLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadRegionsSuccess({ regions: allRegions }));
      });

      it('should set loading to false', () => {
        expect(getRegionsLoading(store$.state)).toBeFalse();
        expect(getRegionsByCountryCode(store$.state, { countryCode })).toEqual(countryRegions);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadRegionsFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded category on error', () => {
        expect(getRegionsLoading(store$.state)).toBeFalse();
        expect(getAllRegions(store$.state)).toBeEmpty();
      });
    });
  });
});
