import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
};

export function viewconfReducer(state: ViewconfState = initialState, action: ViewconfActions): ViewconfState {
  switch (action.type) {
    case ViewconfActionTypes.SetBreadcrumbData:
      return {
        ...state,
        breadcrumbData: action.payload.breadcrumbData,
      };
    case ViewconfActionTypes.SetStickyHeader:
      return {
        ...state,
        stickyHeader: action.payload.sticky,
      };
  }

  return state;
}
