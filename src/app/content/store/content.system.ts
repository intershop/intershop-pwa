import { ActionReducerMap } from '@ngrx/store';

import { ContentState } from './content.state';
import { IncludesEffects } from './includes/includes.effects';
import { includesReducer } from './includes/includes.reducer';

export const contentReducers: ActionReducerMap<ContentState> = {
  includes: includesReducer,
};

export const contentEffects = [IncludesEffects];
