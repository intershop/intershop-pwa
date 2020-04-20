import { Action } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

export enum ViewconfActionTypes {
  SetBreadcrumbData = '[Viewconf Internal] Set Breadcrumb Data',
  SetStickyHeader = '[Viewconf Internal] Set Sticky Header',
}

export class SetBreadcrumbData implements Action {
  readonly type = ViewconfActionTypes.SetBreadcrumbData;
  constructor(public payload: { breadcrumbData: BreadcrumbItem[] }) {}
}

export class SetStickyHeader implements Action {
  readonly type = ViewconfActionTypes.SetStickyHeader;
  constructor(public payload: { sticky: boolean }) {}
}

export type ViewconfActions = SetBreadcrumbData | SetStickyHeader;
