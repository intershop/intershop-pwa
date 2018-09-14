import { createFeatureSelector } from '@ngrx/store';

import { IncludesState } from './includes/includes.reducer';
import { PageletsState } from './pagelets/pagelets.reducer';

export interface ContentState {
  includes: IncludesState;
  pagelets: PageletsState;
}

export const getContentState = createFeatureSelector<ContentState>('content');
