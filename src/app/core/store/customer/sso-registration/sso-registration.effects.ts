import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { RegistrationConfigurationService } from 'src/app/pages/registration/registration-configuration/registration-configuration.service';

import { SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { log } from 'ish-core/utils/dev/operators';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { registerFailure, registerSuccess, setRegistrationInfo } from './sso-registration.actions';

@Injectable()
export class SsoRegistrationEffects {
  constructor(private actions$: Actions, private registrationService: RegistrationConfigurationService) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setRegistrationInfo),
      mapToPayload(),
      log('Effect Start ===>'),
      mergeMap((data: SsoRegistrationType) =>
        this.registrationService.register(data).pipe(map(registerSuccess), mapErrorToAction(registerFailure))
      )
    )
  );
}
