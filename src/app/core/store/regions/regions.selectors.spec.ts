import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Region } from 'ish-core/models/region/region.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { LoadRegions, LoadRegionsFail, LoadRegionsSuccess } from './regions.actions';
import { getAllRegions, getRegionsByCountryCode, getRegionsLoading } from './regions.selectors';

describe('Regions Selectors', () => {
  let store$: TestStore;

  const countryCode = 'US';

  const allRegions = [
    { name: 'Iowa', regionCode: 'Io', countryCode, id: 'Io' + countryCode },
    { name: 'Alabama', regionCode: 'Al', countryCode: 'US', id: 'Al' + countryCode },
    { name: 'Sofia', regionCode: 'S', countryCode: 'BG,', id: 'SBG' },
  ] as Region[];

  const countryRegions = allRegions.filter(region => region.countryCode === countryCode);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ reducers: coreReducers }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any regions when used', () => {
      expect(getAllRegions(store$.state)).toBeEmpty();
      expect(getRegionsLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading regions', () => {
    beforeEach(() => {
      store$.dispatch(new LoadRegions({ countryCode }));
    });
    it('should set the state to loading', () => {
      expect(getRegionsLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadRegionsSuccess({ regions: allRegions }));
      });

      it('should set loading to false', () => {
        expect(getRegionsLoading(store$.state)).toBeFalse();
        expect(getRegionsByCountryCode(store$.state, { countryCode })).toEqual(countryRegions);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadRegionsFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded category on error', () => {
        expect(getRegionsLoading(store$.state)).toBeFalse();
        expect(getAllRegions(store$.state)).toBeEmpty();
      });
    });
  });
});
