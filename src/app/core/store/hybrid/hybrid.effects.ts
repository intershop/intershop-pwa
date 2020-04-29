import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Actions, Effect } from '@ngrx/effects';
import { filter, take, tap } from 'rxjs/operators';

export const SSR_HYBRID_STATE = makeStateKey<boolean>('ssrHybrid');

@Injectable()
export class HybridEffects {
  constructor(
    private actions: Actions,
    @Inject(PLATFORM_ID) private platformId: string,
    private transferState: TransferState,
    @Optional() @Inject('SSR_HYBRID') private ssrHybridState: boolean
  ) {}

  @Effect({ dispatch: false })
  propagateSSRHybridPropToTransferState$ = this.actions.pipe(
    take(1),
    filter(() => isPlatformServer(this.platformId)),
    filter(() => !!this.ssrHybridState),
    tap(() => this.transferState.set(SSR_HYBRID_STATE, true))
  );
}
