import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  deviceType: DeviceType;
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
}

export const initialState: ViewconfState = {
  deviceType: undefined,
  breadcrumbData: [],
  stickyHeader: false,
};

export function viewconfReducer(state: ViewconfState = initialState, action: ViewconfActions) {
  switch (action.type) {
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
