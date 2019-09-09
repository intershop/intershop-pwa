import { createSelector } from '@ngrx/store';

import { Region } from 'ish-core/models/region/region.model';
import { getCoreState } from 'ish-core/store/core-store';

import { regionAdapter } from './regions.reducer';

const getRegionsState = createSelector(
  getCoreState,
  state => state.regions
);

export const { selectAll: getAllRegions } = regionAdapter.getSelectors(getRegionsState);

export const getRegionsLoading = createSelector(
  getRegionsState,
  regions => regions.loading
);

export const getRegionsByCountryCode = createSelector(
  getAllRegions,
  getRegionsLoading,
  (entities, loading, props: { countryCode: string }): Region[] => {
    const regionsForCountry = entities.filter(e => e.countryCode === props.countryCode);
    // when still loading, do not return empty array because we can't be sure there are no regions
    if (loading && !regionsForCountry.length) {
      return;
    }

    return regionsForCountry;
  }
);
