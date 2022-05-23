import { Inject, Injectable, Optional } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { filter, take } from 'rxjs/operators';

export const SSR_HYBRID_STATE = makeStateKey<boolean>('ssrHybrid');

@Injectable()
export class HybridEffects {
  constructor(
    actions: Actions,
    transferState: TransferState,
    @Optional() @Inject('SSR_HYBRID') ssrHybridState: boolean
  ) {
    if (SSR) {
      actions
        .pipe(
          take(1),
          filter(() => !!ssrHybridState)
        )
        .subscribe(() => transferState.set(SSR_HYBRID_STATE, true));
    }
  }
}
