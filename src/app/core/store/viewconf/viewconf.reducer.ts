import { BreadcrumbItem } from '../../models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from '../../models/viewtype/viewtype.types';

import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  wrapperClass: string;
  headerType: string;
  deviceType: DeviceType;
  breadcrumbData: BreadcrumbItem[];
}

export const initialState: ViewconfState = {
  wrapperClass: undefined,
  headerType: undefined,
  deviceType: undefined,
  breadcrumbData: [],
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
    case ViewconfActionTypes.SetDeviceType: {
      return {
        ...state,
        deviceType: action.payload.deviceType,
      };
    }
  }

  return state;
}
