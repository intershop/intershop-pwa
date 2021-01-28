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
      .subscribe(status => httpStatusCodeService.setStatusAndRedirect(status));
  }

  private mapStatus(state: HttpError): number {
    if (state && typeof state.status === 'number') {
      if (state.status === 0) {
        return 504;
      }
      return state.status;
    }
    return 500;
  }
}
