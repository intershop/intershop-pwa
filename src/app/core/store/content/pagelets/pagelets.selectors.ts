import { createSelector } from '@ngrx/store';

import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { pageletsAdapter } from './pagelets.reducer';

const getPageletsState = createSelector(
  getContentState,
  state => state.pagelets
);

export const { selectEntities: getContentPageletEntities } = pageletsAdapter.getSelectors(getPageletsState);

export const getContentPagelet = () =>
  createSelector(
    getContentPageletEntities,
    (entities, id: string): ContentPageletView => createContentPageletView(entities[id])
  );
