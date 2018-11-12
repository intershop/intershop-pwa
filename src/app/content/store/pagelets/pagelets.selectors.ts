import { createSelector } from '@ngrx/store';

import { getContentState } from '../content.state';

import { pageletsAdapter } from './pagelets.reducer';

const getPageletsState = createSelector(getContentState, state => state.pagelets);

export const { selectEntities: getContentPageletEntities } = pageletsAdapter.getSelectors(getPageletsState);
