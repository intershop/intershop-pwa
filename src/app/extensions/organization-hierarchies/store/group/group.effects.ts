import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';

import { loadGroups } from './group.actions';

@Injectable()
export class GroupEffects {
  constructor(private actions$: Actions) {}

  loadGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      // tslint:disable-next-line:no-console
      tap(() => console.log('got loadGroup in GroupEffects.loadGroup$')),
      filter(() => false)
    )
  );
}
