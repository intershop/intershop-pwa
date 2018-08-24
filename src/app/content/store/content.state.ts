import { createFeatureSelector } from '@ngrx/store';

import { IncludesState } from './includes/includes.reducer';

export interface ContentState {
  includes: IncludesState;
}

export const getContentState = createFeatureSelector<ContentState>('content');
