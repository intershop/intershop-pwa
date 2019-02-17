import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { getErrorState } from './error.selectors';

@Injectable()
export class ErrorEffects {
  constructor(private store: Store<{}>, private httpStatusCodeService: HttpStatusCodeService) {}

  @Effect({ dispatch: false })
  gotoErrorPageInCaseOfError$ = this.store.pipe(
    select(getErrorState),
    whenTruthy(),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(500))
  );
}
