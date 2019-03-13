import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentEntryPointView, createContentEntryPointView } from 'ish-core/models/content-view/content-views';
import { getContentState } from '../content-store';
import { getContentPageletEntities } from '../pagelets';

import { pagesAdapter } from './pages.reducer';

const getPagesState = createSelector(
  getContentState,
  state => state.pages
);

const { selectEntities: getPageEntities } = pagesAdapter.getSelectors(getPagesState);

export const getContentPageLoading = createSelector(
  getPagesState,
  state => state.loading
);

export const getSelectedContentPageId = createSelector(
  getPagesState,
  state => state.selected
);

export const getSelectedContentPage = createSelector(
  getPageEntities,
  getContentPageletEntities,
  getSelectedContentPageId,
  (pages, pagelets, id) => (!pages[id] ? undefined : createContentEntryPointView(pages[id], pagelets))
);

export const getContentPage = createSelector(
  getPageEntities,
  getContentPageletEntities,
  (
    pages: Dictionary<ContentPageletEntryPoint>,
    pagelets: Dictionary<ContentPagelet>,
    id: string
  ): ContentEntryPointView => (!pages[id] ? undefined : createContentEntryPointView(pages[id], pagelets))
);
