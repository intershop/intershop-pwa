import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { setLoadingOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import { loadContentPage, loadContentPageFail, loadContentPageSuccess } from './pages.actions';

export const pagesAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: contentPage => contentPage.id,
});

export interface PagesState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
}

const initialState: PagesState = pagesAdapter.getInitialState({
  loading: false,
});

export const pagesReducer = createReducer(
  initialState,
  setLoadingOn(loadContentPage),
  unsetLoadingOn(loadContentPageFail, loadContentPageSuccess),
  on(loadContentPageSuccess, (state, action) => {
    const { page } = action.payload;

    return {
      ...pagesAdapter.upsertOne(page, state),
    };
  })
);
