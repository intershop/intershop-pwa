import { Action } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum PagesActionTypes {
  LoadContentPage = '[Content Page] Load Content Page',
  LoadContentPageFail = '[Content Page API] Load Content Page Fail',
  LoadContentPageSuccess = '[Content Page API] Load Content Page Success',
}

export class LoadContentPage implements Action {
  readonly type = PagesActionTypes.LoadContentPage;
  constructor(public payload: { contentPageId: string }) {}
}

export class LoadContentPageFail implements Action {
  readonly type = PagesActionTypes.LoadContentPageFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadContentPageSuccess implements Action {
  readonly type = PagesActionTypes.LoadContentPageSuccess;
  constructor(public payload: { page: ContentPageletEntryPoint; pagelets: ContentPagelet[] }) {}
}

export type PageAction = LoadContentPage | LoadContentPageFail | LoadContentPageSuccess;
