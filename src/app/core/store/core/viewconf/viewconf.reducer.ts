import { createReducer, on } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

import {
  setBreadcrumbData,
  setDefaultInstantSearchQuery,
  setInstantSearchHeader,
  setStickyHeader,
} from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
  instantSearchHeader: boolean;
  defaultInstantSearchQuery: string;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
  instantSearchHeader: false,
  defaultInstantSearchQuery: undefined,
};

export const viewconfReducer = createReducer(
  initialState,
  on(
    setBreadcrumbData,
    (state, action): ViewconfState => ({
      ...state,
      breadcrumbData: action.payload.breadcrumbData,
    })
  ),
  on(
    setStickyHeader,
    (state, action): ViewconfState => ({
      ...state,
      stickyHeader: action.payload.sticky,
    })
  ),
  on(
    setInstantSearchHeader,
    (state, action): ViewconfState => ({
      ...state,
      instantSearchHeader: action.payload.instantSearch,
    })
  ),
  on(
    setDefaultInstantSearchQuery,
    (state, action): ViewconfState => ({
      ...state,
      defaultInstantSearchQuery: action.payload.instantSearchQuery,
    })
  )
);
