import { BreadcrumbItem } from '../../../models/breadcrumb-item/breadcrumb-item.interface';

import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  wrapperClass: string;
  headerType: string;
  breadcrumbData: BreadcrumbItem[];
}

export const initialState: ViewconfState = {
  wrapperClass: undefined,
  headerType: undefined,
  breadcrumbData: [],
};

export function viewconfReducer(state: ViewconfState = initialState, action: ViewconfActions) {
  switch (action.type) {
    case ViewconfActionTypes.SetWrapperClass:
      return {
        ...state,
        wrapperClass: action.payload,
      };
    case ViewconfActionTypes.SetHeaderType:
      return {
        ...state,
        headerType: action.payload,
      };
    case ViewconfActionTypes.SetBreadcrumbData:
      return {
        ...state,
        breadcrumbData: action.payload,
      };
  }

  return state;
}
