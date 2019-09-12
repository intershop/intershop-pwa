import { Action } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

export enum ViewconfActionTypes {
  SetWrapperClass = '[Viewconf Internal] Set Wrapper Class',
  SetHeaderType = '[Viewconf Internal] Set Header Type',
  SetBreadcrumbData = '[Viewconf Internal] Set Breadcrumb Data',
  SetDeviceType = '[Viewconf Internal] Set Device Type',
  SetStickyHeader = '[Viewconf Internal] Set Sticky Header',
}

export class SetWrapperClass implements Action {
  readonly type = ViewconfActionTypes.SetWrapperClass;
  constructor(public payload: { wrapperClass: string }) {}
}

export class SetHeaderType implements Action {
  readonly type = ViewconfActionTypes.SetHeaderType;
  constructor(public payload: { headerType: string }) {}
}

export class SetBreadcrumbData implements Action {
  readonly type = ViewconfActionTypes.SetBreadcrumbData;
  constructor(public payload: { breadcrumbData: BreadcrumbItem[] }) {}
}

export class SetDeviceType implements Action {
  readonly type = ViewconfActionTypes.SetDeviceType;
  constructor(public payload: { deviceType: DeviceType }) {}
}

export class SetStickyHeader implements Action {
  readonly type = ViewconfActionTypes.SetStickyHeader;
  constructor(public payload: { sticky: boolean }) {}
}

export type ViewconfActions = SetWrapperClass | SetHeaderType | SetBreadcrumbData | SetDeviceType | SetStickyHeader;
