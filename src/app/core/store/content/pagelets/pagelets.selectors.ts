import { createSelector } from '@ngrx/store';

import { getContentState } from 'ish-core/store/content/content-store';

import { pageletsAdapter } from './pagelets.reducer';

const getPageletsState = createSelector(
  getContentState,
  state => state.pagelets
);

export const { selectEntities: getContentPageletEntities } = pageletsAdapter.getSelectors(getPageletsState);
