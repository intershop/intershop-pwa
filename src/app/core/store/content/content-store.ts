import { createFeatureSelector } from '@ngrx/store';

import { IncludesState } from './includes/includes.reducer';
import { PageTreesState } from './page-trees/page-trees.reducer';
import { PageletsState } from './pagelets/pagelets.reducer';
import { PagesState } from './pages/pages.reducer';
import { ViewcontextsState } from './viewcontexts/viewcontexts.reducer';

export interface ContentState {
  includes: IncludesState;
  pagelets: PageletsState;
  pages: PagesState;
  viewcontexts: ViewcontextsState;
  trees: PageTreesState;
}

export const getContentState = createFeatureSelector<ContentState>('content');
