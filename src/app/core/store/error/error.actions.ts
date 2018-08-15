import { Action } from '@ngrx/store';
import { HttpError } from '../../../models/http-error/http-error.model';

export enum ErrorActionTypes {
  GeneralError = '[Error] Communication Error',
  TimeoutError = '[Error] Communication Timeout Error',
  ServerError = '[Error] Server Error (5xx)',
}

export class GeneralError implements Action {
  readonly type = ErrorActionTypes.GeneralError;
  constructor(public error: HttpError) {}
}

export class CommunicationTimeoutError implements Action {
  readonly type = ErrorActionTypes.TimeoutError;
  constructor(public error: HttpError) {}
}
// 500
export class ServerError implements Action {
  readonly type = ErrorActionTypes.ServerError;
  constructor(public error: HttpError) {}
}

export type HttpErrorAction = GeneralError | CommunicationTimeoutError | ServerError;
