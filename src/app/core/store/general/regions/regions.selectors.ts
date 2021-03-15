import { createSelector } from '@ngrx/store';

import { Region } from 'ish-core/models/region/region.model';
import { getGeneralState } from 'ish-core/store/general/general-store';

import { regionAdapter } from './regions.reducer';

const getRegionsState = createSelector(getGeneralState, state => state.regions);

export const { selectAll: getAllRegions } = regionAdapter.getSelectors(getRegionsState);

export const getRegionsLoading = createSelector(getRegionsState, regions => regions.loading);

export const getRegionsByCountryCode = (countryCode: string) =>
  createSelector(getAllRegions, getRegionsLoading, (entities, loading): Region[] => {
    const regionsForCountry = entities.filter(e => e.countryCode === countryCode);
    // when still loading, do not return empty array because we can't be sure there are no regions
    if (loading && !regionsForCountry.length) {
      return;
    }

    return regionsForCountry;
  });
