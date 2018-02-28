import { Action } from '@ngrx/store';
import { Locale } from '../../../models/locale/locale.interface';
import { Error } from './error.reducer';

export enum ErrorActionTypes {
  generalError = '[Error] Communication Error',
  timeoutError = '[Error] Communication Timeout Error',
}

export class GeneralError implements Action {
  readonly type = ErrorActionTypes.generalError;
  constructor(public error: Error) { }
}

export class CommunicationTimeoutError implements Action {
  readonly type = ErrorActionTypes.timeoutError;
  constructor(public error: Error) { }
}

export type ErrorAction = GeneralError | CommunicationTimeoutError;
