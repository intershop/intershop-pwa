import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  DisplayErrorMessage,
  DisplayInfoMessage,
  DisplaySuccessMessage,
  DisplayWarningMessage,
  MessagesPayloadType,
} from 'ish-core/store/core/messages';

// not-dead-code
@Injectable({ providedIn: 'root' })
export class MessageFacade {
  constructor(private store: Store) {}

  info(data: MessagesPayloadType) {
    this.store.dispatch(new DisplayInfoMessage(data));
  }

  error(data: MessagesPayloadType) {
    this.store.dispatch(new DisplayErrorMessage(data));
  }

  warn(data: MessagesPayloadType) {
    this.store.dispatch(new DisplayWarningMessage(data));
  }

  success(data: MessagesPayloadType) {
    this.store.dispatch(new DisplaySuccessMessage(data));
  }
}
