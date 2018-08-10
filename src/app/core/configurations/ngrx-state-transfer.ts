// tslint:disable:no-any
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActionReducer, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { CoreState } from '../store/core.state';

const NGRX_STATE_SK = makeStateKey('ngrxState');
const STATE_ACTION_TYPE = '[Internal] Import NgRx State';

/**
 * meta reducer for overriding client side state if supplied by server
 */
export function ngrxStateTransferMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    if (action.type === STATE_ACTION_TYPE) {
      return action.payload;
    }
    return reducer(state, action);
  };
}

/**
 * Sets state on server-side, re-hydrates on client side.
 * inspired by https://github.com/ngrx/platform/issues/101#issuecomment-351998548
 */
@Injectable()
export class NgrxStateTransfer {
  constructor(private transferState: TransferState, private store: Store<CoreState>) {}

  do() {
    const isBrowser = this.transferState.hasKey<any>(NGRX_STATE_SK);

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  private onServer() {
    this.transferState.onSerialize(NGRX_STATE_SK, () => {
      let state;
      this.store.pipe(take(1)).subscribe((saveState: any) => {
        /* console.debug('Set for browser', JSON.stringify(saveState));*/
        state = saveState;
      });

      return state;
    });
  }

  private onBrowser() {
    const state = this.transferState.get<any>(NGRX_STATE_SK, undefined);
    this.transferState.remove(NGRX_STATE_SK);
    this.store.dispatch({ type: STATE_ACTION_TYPE, payload: state });
    /* console.debug('Got state from server', JSON.stringify(state)); */
  }
}
