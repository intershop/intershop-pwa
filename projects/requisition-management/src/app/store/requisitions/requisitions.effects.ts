import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';

import { loadRequisitions } from './requisitions.actions';

@Injectable()
export class RequisitionsEffects {
  constructor(private actions$: Actions) {}

  loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitions),
      // tslint:disable-next-line:no-console
      tap(() => console.log('got loadRequisitions in RequisitionsEffects.loadRequisitions$')),
      filter(() => false)
    )
  );
}
