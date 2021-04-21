import { createSelector } from '@ngrx/store';

import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';
import { selectRouteParam } from 'ish-core/store/core/router';

import { pagesAdapter } from './pages.reducer';

const getPagesState = createSelector(getContentState, state => state.pages);

const { selectEntities: getPageEntities } = pagesAdapter.getSelectors(getPagesState);

export const getContentPageLoading = createSelector(getPagesState, state => state.loading);

export const getSelectedContentPage = createSelector(getPageEntities, selectRouteParam('contentPageId'), (pages, id) =>
  createContentPageletEntryPointView(pages[id])
);
