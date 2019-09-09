import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  wrapperClass: string;
  headerType: string;
  deviceType: DeviceType;
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
}

export const initialState: ViewconfState = {
  wrapperClass: undefined,
  headerType: undefined,
  deviceType: undefined,
  breadcrumbData: [],
  stickyHeader: false,
};

export function viewconfReducer(state: ViewconfState = initialState, action: ViewconfActions) {
  switch (action.type) {
    case ViewconfActionTypes.SetWrapperClass:
      return {
        ...state,
        wrapperClass: action.payload.wrapperClass,
      };
    case ViewconfActionTypes.SetHeaderType:
      return {
        ...state,
        headerType: action.payload.headerType,
      };
    case ViewconfActionTypes.SetBreadcrumbData:
      return {
        ...state,
        breadcrumbData: action.payload.breadcrumbData,
      };
    case ViewconfActionTypes.SetDeviceType:
      return {
        ...state,
        deviceType: action.payload.deviceType,
      };
    case ViewconfActionTypes.SetStickyHeader:
      return {
        ...state,
        stickyHeader: action.payload.sticky,
      };
  }

  return state;
}
