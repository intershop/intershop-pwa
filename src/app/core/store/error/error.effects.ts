import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { ErrorState } from './error.reducer';
import { getErrorState } from './error.selectors';

@Injectable()
export class ErrorEffects {
  constructor(private store: Store<{}>, private httpStatusCodeService: HttpStatusCodeService) {}

  @Effect({ dispatch: false })
  gotoErrorPageInCaseOfError$ = this.store.pipe(
    select(getErrorState),
    whenTruthy(),
    map(state => this.mapStatus(state)),
    tap(status => this.httpStatusCodeService.setStatusAndRedirect(status))
  );

  private mapStatus(state: ErrorState): number {
    if (state && state.current && typeof state.current.status === 'number') {
      if (state.current.status === 0) {
        return 504;
      }
      return state.current.status;
    }
    return 500;
  }
}
