import { Action } from '@ngrx/store';
import { Locale } from '../../../models/locale/locale.interface';
import { HttpErrorResponse } from '@angular/common/http';

export enum ErrorActionTypes {
  generalError = '[Error] Communication Error',
  timeoutError = '[Error] Communication Timeout Error',
  internalServerError = '[Error] Internal Server Error (500)',
  notImplementedError = '[Error] Not Implemented (501)',
  badGatewayError = '[Error] Bad Gateway (502)',
  serviceUnavailableError = '[Error] Service Unavailable (503)',
  gatewayTimeoutError = '[Error] Gateway Timeout (504)',
  httpVersionNotSupportedError = '[Error] HTTP Version not supported (505)',
  variantAlsoNegotiatesError = '[Error] Variant Also Negotiates (506)',
  insufficientStorageError = '[Error] Insufficient Storage (507)',
  loopDetectedError = '[Error] Loop Detected (508)',
  bandwidthLimitExceededError = '[Error] Bandwidth Limit Exceeded (509)',
  notExtendedError = '[Error] Not Extended (510)',
  networkAuthenticationRequiredError = '[Error] Network Authentication Required (511)',
}

export class GeneralError implements Action {
  readonly type = ErrorActionTypes.generalError;
  constructor(public error: HttpErrorResponse) { }
}

export class CommunicationTimeoutError implements Action {
  readonly type = ErrorActionTypes.timeoutError;
  constructor(public error: HttpErrorResponse) { }
}
//500
export class InternalServerError implements Action {
  readonly type = ErrorActionTypes.internalServerError;
  constructor(public error: HttpErrorResponse) { }
}
//501
export class NotImplementedError implements Action {
  readonly type = ErrorActionTypes.notImplementedError;
  constructor(public error: HttpErrorResponse) { }
}
//502
export class BadGatewayError implements Action {
  readonly type = ErrorActionTypes.badGatewayError;
  constructor(public error: HttpErrorResponse) { }
}
//503
export class ServiceUnavailableError implements Action {
  readonly type = ErrorActionTypes.serviceUnavailableError;
  constructor(public error: HttpErrorResponse) { }
}
//504
export class GatewayTimeoutError implements Action {
  readonly type = ErrorActionTypes.gatewayTimeoutError;
  constructor(public error: HttpErrorResponse) { }
}
//505
export class HttpVersionNotSupportedError implements Action {
  readonly type = ErrorActionTypes.httpVersionNotSupportedError;
  constructor(public error: HttpErrorResponse) { }
}
//506
export class VariantAlsoNegotiatesError implements Action {
  readonly type = ErrorActionTypes.variantAlsoNegotiatesError;
  constructor(public error: HttpErrorResponse) { }
}
//507
export class InsufficientStorageError implements Action {
  readonly type = ErrorActionTypes.insufficientStorageError;
  constructor(public error: HttpErrorResponse) { }
}
//508
export class LoopDetectedError implements Action {
  readonly type = ErrorActionTypes.loopDetectedError;
  constructor(public error: HttpErrorResponse) { }
}
//509
export class BandwidthLimitExceededError implements Action {
  readonly type = ErrorActionTypes.bandwidthLimitExceededError;
  constructor(public error: HttpErrorResponse) { }
}
//510
export class NotExtendedError implements Action {
  readonly type = ErrorActionTypes.notExtendedError;
  constructor(public error: HttpErrorResponse) { }
}
//511
export class NetworkAuthenticationRequiredError implements Action {
  readonly type = ErrorActionTypes.networkAuthenticationRequiredError;
  constructor(public error: HttpErrorResponse) { }
}

export type ErrorAction = GeneralError
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
