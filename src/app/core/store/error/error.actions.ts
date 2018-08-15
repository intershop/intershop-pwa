import { Action } from '@ngrx/store';
import { HttpError } from '../../../models/http-error/http-error.model';

export enum ErrorActionTypes {
  GeneralError = '[Error] Communication Error',
  TimeoutError = '[Error] Communication Timeout Error',
  ServerError = '[Error] Server Error (5xx)',
}

export enum ErrorGroupTypes {
  Http5XXError = '5xx Server error',
}
export abstract class Http5XXAction implements Action {
  errorGroup = ErrorGroupTypes.Http5XXError;
  type = '';
  constructor(public error: HttpError) {}
}

export class GeneralError extends Http5XXAction {
  readonly type = ErrorActionTypes.GeneralError;
}

export class CommunicationTimeoutError extends Http5XXAction {
  readonly type = ErrorActionTypes.TimeoutError;
}
// 500
export class ServerError extends Http5XXAction {
  readonly type = ErrorActionTypes.ServerError;
}

export type Http5XXError = GeneralError | CommunicationTimeoutError | ServerError;
