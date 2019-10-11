import { Action } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum IncludesActionTypes {
  LoadContentInclude = '[Content Include] Load Content Include',
  LoadContentIncludeFail = '[Content Include API] Load Content Include Fail',
  LoadContentIncludeSuccess = '[Content Include API] Load Content Include Success',
}

export class LoadContentInclude implements Action {
  readonly type = IncludesActionTypes.LoadContentInclude;
  constructor(public payload: { includeId: string }) {}
}

export class LoadContentIncludeFail implements Action {
  readonly type = IncludesActionTypes.LoadContentIncludeFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadContentIncludeSuccess implements Action {
  readonly type = IncludesActionTypes.LoadContentIncludeSuccess;
  constructor(public payload: { include: ContentPageletEntryPoint; pagelets: ContentPagelet[] }) {}
}

export type IncludesAction = LoadContentInclude | LoadContentIncludeFail | LoadContentIncludeSuccess;
