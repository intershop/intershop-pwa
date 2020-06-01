import { Action } from '@ngrx/store';

export interface MessagesPayloadType {
  /**
   * required message (works with i18n)
   */
  message: string;

  /**
   * optional message-parameters (i18n)
   */
  messageParams?: { [id: string]: string };

  /**
   * optional title (works with i18n)
   */
  title?: string;

  /**
   * optional title-parameters (i18n)
   */
  titleParams?: { [id: string]: string };

  /**
   * in ms
   */
  duration?: number;
}

export enum MessagesActionTypes {
  ToastMessage = '[Message] Set Toast',
}

export class InfoMessage implements Action {
  readonly type = MessagesActionTypes.ToastMessage;
  readonly messageType = 'info';
  constructor(public payload: MessagesPayloadType) {}
}

export class ErrorMessage implements Action {
  readonly type = MessagesActionTypes.ToastMessage;
  readonly messageType = 'error';
  constructor(public payload: MessagesPayloadType) {}
}

export class WarningMessage implements Action {
  readonly type = MessagesActionTypes.ToastMessage;
  readonly messageType = 'warning';
  constructor(public payload: MessagesPayloadType) {}
}

export class SuccessMessage implements Action {
  readonly type = MessagesActionTypes.ToastMessage;
  readonly messageType = 'success';
  constructor(public payload: MessagesPayloadType) {}
}

export type MessagesActions = InfoMessage | ErrorMessage | WarningMessage | SuccessMessage;
