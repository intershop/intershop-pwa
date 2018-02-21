import { Action } from '@ngrx/store';
import { ViewType } from '../../../models/types';


export enum ViewconfActionTypes {
  ChangeViewType = '[Shopping] Change ViewType setting',
  ChangeSortBy = '[Shopping] Change SortBy setting'
}

export class ChangeViewType implements Action {
  readonly type = ViewconfActionTypes.ChangeViewType;
  constructor(public payload: ViewType) { }
}

export class ChangeSortBy implements Action {
  readonly type = ViewconfActionTypes.ChangeSortBy;
  constructor(public payload: string) { }
}

export type ViewconfAction =
  | ChangeViewType
  | ChangeSortBy;
