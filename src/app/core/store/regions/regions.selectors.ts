import { createSelector } from '@ngrx/store';

import { Region } from 'ish-core/models/region/region.model';
import { getCoreState } from '../core-store';

import { regionAdapter } from './regions.reducer';

const getRegionState = createSelector(
  getCoreState,
  state => state.regions
);

export const { selectAll: getAllRegions } = regionAdapter.getSelectors(getRegionState);

export const getRegionsByCountryCode = createSelector(
  getAllRegions,
  (entities, props: { countryCode: string }): Region[] => entities.filter(e => e.countryCode === props.countryCode)
);

export const getRegionsLoading = createSelector(
  getRegionState,
  regions => regions.loading
);
