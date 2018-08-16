import { Action } from '@ngrx/store';

import { BreadcrumbItem } from '../../../models/breadcrumb-item/breadcrumb-item.interface';

export enum ViewconfActionTypes {
  SetWrapperClass = '[Viewconf Internal] Set Wrapper Class',
  SetHeaderType = '[Viewconf Internal] Set Header Type',
  SetBreadcrumbData = '[Viewconf Internal] Set Breadcrumb Data',
}

export class SetWrapperClass implements Action {
  readonly type = ViewconfActionTypes.SetWrapperClass;
  constructor(public payload: string) {}
}

export class SetHeaderType implements Action {
  readonly type = ViewconfActionTypes.SetHeaderType;
  constructor(public payload: string) {}
}

export class SetBreadcrumbData implements Action {
  readonly type = ViewconfActionTypes.SetBreadcrumbData;
  constructor(public payload: BreadcrumbItem[]) {}
}

export declare type ViewconfActions = SetWrapperClass | SetHeaderType | SetBreadcrumbData;
