import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Region } from 'ish-core/models/region/region.model';

import { RegionAction, RegionActionTypes } from './regions.actions';

export const regionAdapter = createEntityAdapter<Region>({
  selectId: region => region.id,
});

export interface RegionsState extends EntityState<Region> {
  loading: boolean;
}

export const initialState: RegionsState = regionAdapter.getInitialState({
  loading: false,
});

export function regionsReducer(state = initialState, action: RegionAction): RegionsState {
  switch (action.type) {
    case RegionActionTypes.LoadRegions: {
      return {
        ...state,
        loading: true,
      };
    }

    case RegionActionTypes.LoadRegionsFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case RegionActionTypes.LoadRegionsSuccess: {
      const { regions } = action.payload;

      return {
        ...regionAdapter.upsertMany(regions, state),
        loading: false,
      };
    }
  }

  return state;
}
