import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';
import { CoreState } from '../../core/store/core.state';

@Injectable()
export class LogEffects {
  actions: Action[] = [];
  state: CoreState;

  logActions = false;
  logState = false;

  constructor(private actions$: Actions, private store$: Store<CoreState>) {}

  @Effect({ dispatch: false })
  logActions$ = this.actions$.pipe(
    tap(action => this.actions.push(action)),
    filter(() => this.logActions),
    tap(action => console.log('action', action))
  );

  @Effect({ dispatch: false })
  logState$ = this.store$.pipe(
    tap(state => (this.state = JSON.parse(JSON.stringify(state)))),
    filter(() => this.logState),
    tap(state => console.log('state', state))
  );

  dispatch(action: Action) {
    this.store$.dispatch(action);
  }

  actionsIterator(include: (string | RegExp)[]) {
    let currentIdx = 0;

    return {
      next: () => {
        let current;
        do {
          currentIdx++;
          current = this.actions[currentIdx];
        } while (
          !!current &&
          !!current.type &&
          !include
            .map(inc => {
              if (typeof inc === 'string') {
                return (current.type as string).indexOf(inc) >= 0;
              }
              return (current.type as string).search(inc) >= 0;
            })
            .reduce((l, r) => l || r)
        );
        return current;
      },
    };
  }
}
