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
  DisplayInfoMessage = '[Message] Info Toast',
  DisplayErrorMessage = '[Message] Error Toast',
  DisplayWarningMessage = '[Message] Warning Toast',
  DisplaySuccessMessage = '[Message] Success Toast',
}

export class DisplayInfoMessage implements Action {
  readonly type = MessagesActionTypes.DisplayInfoMessage;
  constructor(public payload: MessagesPayloadType) {}
}

export class DisplayErrorMessage implements Action {
  readonly type = MessagesActionTypes.DisplayErrorMessage;
  constructor(public payload: MessagesPayloadType) {}
}

export class DisplayWarningMessage implements Action {
  readonly type = MessagesActionTypes.DisplayWarningMessage;
  constructor(public payload: MessagesPayloadType) {}
}

export class DisplaySuccessMessage implements Action {
  readonly type = MessagesActionTypes.DisplaySuccessMessage;
  constructor(public payload: MessagesPayloadType) {}
}
