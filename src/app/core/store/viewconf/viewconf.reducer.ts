import { ViewconfActions, ViewconfActionTypes } from './viewconf.actions';

export interface ViewconfState {
  wrapperClass: string;
  headerType: string;
  breadcrumbKey: string;
}

export const initialState: ViewconfState = {
  wrapperClass: undefined,
  headerType: undefined,
  breadcrumbKey: undefined,
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
    case ViewconfActionTypes.SetBreadcrumbKey:
      return {
        ...state,
        breadcrumbKey: action.payload,
      };
  }

  return state;
}
