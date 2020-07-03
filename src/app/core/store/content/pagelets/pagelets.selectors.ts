import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { pageletsAdapter } from './pagelets.reducer';

const getPageletsState = createSelector(getContentState, state => state.pagelets);

export const { selectEntities: getContentPageletEntities } = pageletsAdapter.getSelectors(getPageletsState);

const getContentPageletMemoized = (pageletId: string) =>
  createSelectorFactory(projector => defaultMemoize(projector, undefined, isEqual))(
    getContentPageletEntities,
    (entities): ContentPageletView => entities[pageletId]
  );

export const getContentPagelet = (pageletId: string) =>
  createSelector(getContentPageletMemoized(pageletId), createContentPageletView);
