import { Action } from '@ngrx/store';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { HttpError } from '../../../models/http-error/http-error.model';

export enum IncludesActionTypes {
  LoadContentInclude = '[Content Include] Load Content Include',
  LoadContentIncludeFail = '[Content Include API] Load Content Include Fail',
  LoadContentIncludeSuccess = '[Content Include API] Load Content Include Success',
}

export class LoadContentInclude implements Action {
  readonly type = IncludesActionTypes.LoadContentInclude;
  constructor(public payload: string) {}
}

export class LoadContentIncludeFail implements Action {
  readonly type = IncludesActionTypes.LoadContentIncludeFail;
  constructor(public payload: HttpError) {}
}

export class LoadContentIncludeSuccess implements Action {
  readonly type = IncludesActionTypes.LoadContentIncludeSuccess;
  constructor(public payload: ContentInclude) {}
}

export type IncludesAction = LoadContentInclude | LoadContentIncludeFail | LoadContentIncludeSuccess;
