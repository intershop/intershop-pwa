import { Action } from '@ngrx/store';
import { ViewType } from '../../../models/types';


export enum ViewconfActionTypes {
  ChangeViewType = '[Shopping] Change ViewType'
}

export class ChangeViewType implements Action {
  readonly type = ViewconfActionTypes.ChangeViewType;
  constructor(public payload: ViewType) { }
}

export type CompareAction =
  | ChangeViewType;
