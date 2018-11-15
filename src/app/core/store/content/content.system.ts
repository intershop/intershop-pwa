import { ActionReducerMap } from '@ngrx/store';

import { ContentState } from './content.state';
import { IncludesEffects } from './includes/includes.effects';
import { includesReducer } from './includes/includes.reducer';
import { pageletsReducer } from './pagelets/pagelets.reducer';

export const contentReducers: ActionReducerMap<ContentState> = {
  includes: includesReducer,
  pagelets: pageletsReducer,
};

export const contentEffects = [IncludesEffects];
