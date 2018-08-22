import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { CoreState } from '../core.state';

import { getErrorState } from './error.selectors';

@Injectable()
export class ErrorEffects {
  constructor(private router: Router, private store: Store<CoreState>) {}

  @Effect({ dispatch: false })
  gotoErrorPageInCaseOfError$ = this.store.pipe(
    select(getErrorState),
    filter(state => !!state),
    tap(() => this.router.navigate(['/error']))
  );
}
