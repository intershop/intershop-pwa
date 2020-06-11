import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

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

export const displayInfoMessage = createAction('[Message] Info Toast', payload<MessagesPayloadType>());

export const displayErrorMessage = createAction('[Message] Error Toast', payload<MessagesPayloadType>());

export const displayWarningMessage = createAction('[Message] Warning Toast', payload<MessagesPayloadType>());

export const displaySuccessMessage = createAction('[Message] Success Toast', payload<MessagesPayloadType>());
