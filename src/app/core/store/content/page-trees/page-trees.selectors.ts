import { createSelector } from '@ngrx/store';

import { getContentState } from 'ish-core/store/content/content-store';

const getPageTreesState = createSelector(getContentState, state => state.trees);

export const getContentPageTreesLoading = createSelector(getPageTreesState, state => state.loading);
