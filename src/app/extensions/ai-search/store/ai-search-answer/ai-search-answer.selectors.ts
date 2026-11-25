import { createSelector } from '@ngrx/store';

import { getAiSearchState } from '../ai-search-store';

export const getAiSearchAnswerState = createSelector(getAiSearchState, state => state?.aiSearchAnswer);

export const getAiSearchKeptAnswer = createSelector(getAiSearchState, state => state?._keptAnswer);
