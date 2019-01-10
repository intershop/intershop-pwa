import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { getErrorState } from './error.selectors';

@Injectable()
export class ErrorEffects {
  constructor(private router: Router, private store: Store<{}>) {}

  @Effect({ dispatch: false })
  gotoErrorPageInCaseOfError$ = this.store.pipe(
    select(getErrorState),
    whenTruthy(),
    tap(() => this.router.navigate(['/error']))
  );
}
