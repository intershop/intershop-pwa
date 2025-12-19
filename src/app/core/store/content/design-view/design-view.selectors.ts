import { createSelector } from '@ngrx/store';

import { getContentState } from 'ish-core/store/content/content-store';

const getDesignViewState = createSelector(getContentState, state => state.designView);

export const getDesignViewSelectedPageletId = createSelector(getDesignViewState, state => state.selectedPageletId);

export const getDesignViewPreviewedPageletId = createSelector(getDesignViewState, state => state.previewedPageletId);

export const getDesignViewScrollToPageletId = createSelector(getDesignViewState, state => state.scrollToPageletId);
