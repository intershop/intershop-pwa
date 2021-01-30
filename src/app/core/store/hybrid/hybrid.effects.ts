import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Actions } from '@ngrx/effects';
import { filter, take } from 'rxjs/operators';

export const SSR_HYBRID_STATE = makeStateKey<boolean>('ssrHybrid');

@Injectable()
export class HybridEffects {
  constructor(
    actions: Actions,
    @Inject(PLATFORM_ID) platformId: string,
    transferState: TransferState,
    @Optional() @Inject('SSR_HYBRID') ssrHybridState: boolean
  ) {
    actions
      .pipe(
        take(1),
        filter(() => isPlatformServer(platformId)),
        filter(() => !!ssrHybridState)
      )
      .subscribe(() => transferState.set(SSR_HYBRID_STATE, true));
  }
}
