import { Action } from '@ngrx/store';

export enum PageletsActionTypes {
  ResetPagelets = '[Pagelets] Reset Pagelets',
}

export class ResetPagelets implements Action {
  readonly type = PageletsActionTypes.ResetPagelets;
}

export type PageletsAction = ResetPagelets;
