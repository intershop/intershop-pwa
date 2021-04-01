import { createReducer, on } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

import { setBreadcrumbData, setStickyHeader } from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
};

export const viewconfReducer = createReducer(
  initialState,
  on(setBreadcrumbData, (state, action) => ({
    ...state,
    breadcrumbData: action.payload.breadcrumbData,
  })),
  on(setStickyHeader, (state, action) => ({
    ...state,
    stickyHeader: action.payload.sticky,
  }))
);
