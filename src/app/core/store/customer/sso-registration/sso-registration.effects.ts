import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UUID } from 'angular2-uuid';
import { map, mergeMap } from 'rxjs/operators';

import { SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { UserService } from 'ish-core/services/user/user.service';
import { log } from 'ish-core/utils/dev/operators';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { registerFailure, registerSuccess, setRegistrationInfo } from './sso-registration.actions';

@Injectable()
export class SsoRegistrationEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setRegistrationInfo),
      mapToPayload(),
      log('Effect Start ===>'),
      mergeMap((data: SsoRegistrationType) =>
        this.userService
          .createUser({
            address: data.address,
            customer: {
              customerNo: UUID.UUID(),
              companyName: data.companyInfo.companyName1,
              companyName2: data.companyInfo.companyName2,
              isBusinessCustomer: true,
              taxationID: data.companyInfo.taxationID,
            },
            userId: data.userId,
          })
          .pipe(map(registerSuccess), mapErrorToAction(registerFailure))
      )
    )
  );
}
