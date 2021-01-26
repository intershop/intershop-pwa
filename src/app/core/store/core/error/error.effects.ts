import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { getGeneralError } from './error.selectors';

@Injectable()
export class ErrorEffects {
  constructor(store: Store, httpStatusCodeService: HttpStatusCodeService) {
    store
      .pipe(
        select(getGeneralError),
        whenTruthy(),
        map(error => this.mapStatus(error))
      )
      .subscribe(status => httpStatusCodeService.setStatus(status));
  }

  private mapStatus(state: HttpError | string): number {
    if (!state) {
      return 500;
    } else if (typeof state === 'string') {
      return 400;
    } else if (typeof state.status === 'number') {
      return state.status === 0 ? 504 : state.status;
    }
    return 500;
  }
}
