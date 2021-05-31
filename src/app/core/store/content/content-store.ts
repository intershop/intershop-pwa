import { createFeatureSelector } from '@ngrx/store';

import { IncludesState } from './includes/includes.reducer';
import { PageTreeState } from './page-tree/page-tree.reducer';
import { PageletsState } from './pagelets/pagelets.reducer';
import { PagesState } from './pages/pages.reducer';
import { ParametersState } from './parameters/parameters.reducer';
import { ViewcontextsState } from './viewcontexts/viewcontexts.reducer';

export interface ContentState {
  includes: IncludesState;
  pagelets: PageletsState;
  pages: PagesState;
  viewcontexts: ViewcontextsState;
  pagetree: PageTreeState;
  parameters: ParametersState;
}

export const getContentState = createFeatureSelector<ContentState>('content');
