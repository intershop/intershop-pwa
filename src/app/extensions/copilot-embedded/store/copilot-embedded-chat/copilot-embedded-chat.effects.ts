import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';

import { resetUserData } from 'ish-core/store/customer/user';

/**
 * Suffix of the storage keys of the persisted chat; `dataRetentionMeta` stores it as `{baseHref}-copilotEmbedded-_chat`.
 */
const COPILOT_EMBEDDED_CHAT_STORAGE_KEY_SUFFIX = '-copilotEmbedded-_chat';

@Injectable()
export class CopilotEmbeddedChatEffects {
  constructor(private actions$: Actions) {}

  /**
   * Removes the persisted chats under every base href on logout, so the next user of the browser cannot see them.
   * The reducer only clears the chat of the current base href, but the logout applies to the whole site.
   */
  removePersistedChatsOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetUserData),
        filter(() => !SSR),
        map(() =>
          [localStorage, sessionStorage].forEach(storage =>
            Array.from({ length: storage.length }, (_, index) => storage.key(index))
              .filter(key => key?.endsWith(COPILOT_EMBEDDED_CHAT_STORAGE_KEY_SUFFIX))
              .forEach(key => storage.removeItem(key))
          )
        )
      ),
    { dispatch: false }
  );
}
