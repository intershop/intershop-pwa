import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Region } from 'ish-core/models/region/region.model';

import { LoadRegions, LoadRegionsFail, LoadRegionsSuccess, RegionAction } from './regions.actions';
import { initialState, regionsReducer } from './regions.reducer';

describe('Regions Reducer', () => {
  const countryCode = 'US';

  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as RegionAction;
      const state = regionsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadRegions actions', () => {
    describe('LoadRegion action', () => {
      it('should set loading to true', () => {
        const action = new LoadRegions({ countryCode });
        const state = regionsReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadRegionFail action', () => {
      it('should set loading to false', () => {
        const action = new LoadRegionsFail({ error: {} as HttpError });
        const state = regionsReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadRegionsSuccess action', () => {
      let region: Region;

      beforeEach(() => {
        region = {
          countryCode,
          regionCode: 'Al',
          name: 'Alabama',
          id: 'Al' + countryCode,
        } as Region;
      });

      it('should insert region if not exist', () => {
        const action = new LoadRegionsSuccess({ regions: [region] });
        const state = regionsReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[region.id]).toEqual(region);
      });
    });
  });
});
