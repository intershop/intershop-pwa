import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  ErrorMessage,
  InfoMessage,
  MessagesPayloadType,
  SuccessMessage,
  WarningMessage,
} from 'ish-core/store/messages';

@Injectable({ providedIn: 'root' })
export class MessageFacade {
  constructor(private store: Store<{}>) {}

  info(data: MessagesPayloadType) {
    this.store.dispatch(new InfoMessage(data));
  }

  error(data: MessagesPayloadType) {
    this.store.dispatch(new ErrorMessage(data));
  }

  warn(data: MessagesPayloadType) {
    this.store.dispatch(new WarningMessage(data));
  }

  success(data: MessagesPayloadType) {
    this.store.dispatch(new SuccessMessage(data));
  }
}
