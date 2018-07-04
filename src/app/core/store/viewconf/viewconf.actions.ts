import { Action } from '@ngrx/store';

export enum ViewconfActionTypes {
  SetWrapperClass = '[Viewconf Internal] Set Wrapper Class',
  SetHeaderType = '[Viewconf Internal] Set Header Type',
  SetBreadcrumbKey = '[Viewconf Internal] Set Breadcrumb Key',
}

export class SetWrapperClass implements Action {
  readonly type = ViewconfActionTypes.SetWrapperClass;
  constructor(public payload: string) {}
}

export class SetHeaderType implements Action {
  readonly type = ViewconfActionTypes.SetHeaderType;
  constructor(public payload: string) {}
}

export class SetBreadcrumbKey implements Action {
  readonly type = ViewconfActionTypes.SetBreadcrumbKey;
  constructor(public payload: string) {}
}

export declare type ViewconfActions = SetWrapperClass | SetHeaderType | SetBreadcrumbKey;
