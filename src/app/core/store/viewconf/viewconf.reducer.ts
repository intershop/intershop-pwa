import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
  // not synced via state transfer
  _deviceType: DeviceType;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
  _deviceType: 'mobile',
};

export function viewconfReducer(state: ViewconfState = initialState, action: ViewconfActions): ViewconfState {
  switch (action.type) {
    case ViewconfActionTypes.SetBreadcrumbData:
      return {
        ...state,
        breadcrumbData: action.payload.breadcrumbData,
      };
    case ViewconfActionTypes.SetDeviceType:
      return {
        ...state,
        _deviceType: action.payload.deviceType,
      };
    case ViewconfActionTypes.SetStickyHeader:
      return {
        ...state,
        stickyHeader: action.payload.sticky,
      };
  }

  return state;
}
