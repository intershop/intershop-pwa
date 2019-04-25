import { Action } from '@ngrx/store';

export enum SentryConfigActionTypes {
  SetSentryConfig = '[Sentry] Set Config',
}

export class SetSentryConfig implements Action {
  readonly type = SentryConfigActionTypes.SetSentryConfig;
  constructor(public payload: { dsn: string }) {}
}

export type SentryConfigAction = SetSentryConfig;
