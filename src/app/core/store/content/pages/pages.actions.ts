import { Action } from '@ngrx/store';

import { ContentPage } from 'ish-core/models/content-page/content-page.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum PagesActionTypes {
  LoadContentPage = '[Pages] Load Content Page',
  LoadContentPageFail = '[Pages] Load Content Page Fail',
  LoadContentPageSuccess = '[Pages] Load Content Page Success',
}

export class LoadContentPage implements Action {
  readonly type = PagesActionTypes.LoadContentPage;
  constructor(public payload: { id: string }) {}
}

export class LoadContentPageFail implements Action {
  readonly type = PagesActionTypes.LoadContentPageFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadContentPageSuccess implements Action {
  readonly type = PagesActionTypes.LoadContentPageSuccess;
  constructor(public payload: { page: ContentPage; pagelets: ContentPagelet[] }) {}
}

export type PageAction = LoadContentPage | LoadContentPageFail | LoadContentPageSuccess;
