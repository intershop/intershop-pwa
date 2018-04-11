import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export enum ErrorActionTypes {
  GeneralError = '[Error] Communication Error',
  TimeoutError = '[Error] Communication Timeout Error',
  InternalServerError = '[Error] Internal Server Error (500)',
  NotImplementedError = '[Error] Not Implemented (501)',
  BadGatewayError = '[Error] Bad Gateway (502)',
  ServiceUnavailableError = '[Error] Service Unavailable (503)',
  GatewayTimeoutError = '[Error] Gateway Timeout (504)',
  HttpVersionNotSupportedError = '[Error] HTTP Version not supported (505)',
  VariantAlsoNegotiatesError = '[Error] Variant Also Negotiates (506)',
  InsufficientStorageError = '[Error] Insufficient Storage (507)',
  LoopDetectedError = '[Error] Loop Detected (508)',
  BandwidthLimitExceededError = '[Error] Bandwidth Limit Exceeded (509)',
  NotExtendedError = '[Error] Not Extended (510)',
  NetworkAuthenticationRequiredError = '[Error] Network Authentication Required (511)',
}

export enum ErrorGroupTypes {
  Http5XXError = '5xx Server error',
}
export abstract class Http5XXAction implements Action {
  errorGroup = ErrorGroupTypes.Http5XXError;
  type = '';
  constructor(public error: HttpErrorResponse) {}
}

export class GeneralError extends Http5XXAction {
  readonly type = ErrorActionTypes.GeneralError;
}

export class CommunicationTimeoutError extends Http5XXAction {
  readonly type = ErrorActionTypes.TimeoutError;
}
// 500
export class InternalServerError extends Http5XXAction {
  readonly type = ErrorActionTypes.InternalServerError;
}
// 501
export class NotImplementedError extends Http5XXAction {
  readonly type = ErrorActionTypes.NotImplementedError;
}
// 502
export class BadGatewayError extends Http5XXAction {
  readonly type = ErrorActionTypes.BadGatewayError;
}
// 503
export class ServiceUnavailableError extends Http5XXAction {
  readonly type = ErrorActionTypes.ServiceUnavailableError;
}
// 504
export class GatewayTimeoutError extends Http5XXAction {
  readonly type = ErrorActionTypes.GatewayTimeoutError;
}
// 505
export class HttpVersionNotSupportedError extends Http5XXAction {
  readonly type = ErrorActionTypes.HttpVersionNotSupportedError;
}
// 506
export class VariantAlsoNegotiatesError extends Http5XXAction {
  readonly type = ErrorActionTypes.VariantAlsoNegotiatesError;
}
// 507
export class InsufficientStorageError extends Http5XXAction {
  readonly type = ErrorActionTypes.InsufficientStorageError;
}
// 508
export class LoopDetectedError extends Http5XXAction {
  readonly type = ErrorActionTypes.LoopDetectedError;
}
// 509
export class BandwidthLimitExceededError extends Http5XXAction {
  readonly type = ErrorActionTypes.BandwidthLimitExceededError;
}
// 510
export class NotExtendedError extends Http5XXAction {
  readonly type = ErrorActionTypes.NotExtendedError;
}
// 511
export class NetworkAuthenticationRequiredError extends Http5XXAction {
  readonly type = ErrorActionTypes.NetworkAuthenticationRequiredError;
}

export type Http5XXError =
  | GeneralError
  | CommunicationTimeoutError
  | InternalServerError
  | NotImplementedError
  | BadGatewayError
  | ServiceUnavailableError
  | GatewayTimeoutError
  | HttpVersionNotSupportedError
  | VariantAlsoNegotiatesError
  | InsufficientStorageError
  | LoopDetectedError
  | BandwidthLimitExceededError
  | NotExtendedError
  | NetworkAuthenticationRequiredError;

export type HttpError = Http5XXError;
