import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPage } from 'ish-core/models/content-page/content-page.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageView, createPageView } from 'ish-core/models/content-view/content-views';
import { getContentState } from '../content-store';
import { getContentPageletEntities } from '../pagelets';

import { pagesAdapter } from './pages.reducer';

const getPagesState = createSelector(
  getContentState,
  state => state.pages
);

export const getPagesLoading = createSelector(
  getPagesState,
  state => state.loading
);

const { selectEntities: getPageEntities } = pagesAdapter.getSelectors(getPagesState);

export const getContentPage = createSelector(
  getPageEntities,
  getContentPageletEntities,
  (pages: Dictionary<ContentPage>, pagelets: Dictionary<ContentPagelet>, id: string): ContentPageView =>
    !pages[id] ? undefined : createPageView(pages[id], pagelets)
);
