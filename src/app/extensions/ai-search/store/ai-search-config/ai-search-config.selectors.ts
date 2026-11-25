import { createSelector } from '@ngrx/store';

import { getAiSearchState } from '../ai-search-store';

export const getAiSearchConfig = createSelector(getAiSearchState, state => state?.aiSearchConfig);
