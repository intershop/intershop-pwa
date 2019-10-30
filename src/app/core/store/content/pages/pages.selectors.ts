import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

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
  getSelectedContentPageId,
  (pages, id) => createContentPageletEntryPointView(pages[id])
);

export const getContentPage = createSelector(
  getPageEntities,
  (pages: Dictionary<ContentPageletEntryPoint>, id: string): ContentPageletEntryPointView =>
    createContentPageletEntryPointView(pages[id])
);
