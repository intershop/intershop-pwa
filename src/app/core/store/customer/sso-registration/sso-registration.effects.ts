import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, mergeMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { UserService } from 'ish-core/services/user/user.service';
import { userNewsletterActions } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { registerFailure, registerSuccess, setRegistrationInfo } from './sso-registration.actions';

@Injectable()
export class SsoRegistrationEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private featureToggleService: FeatureToggleService
  ) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setRegistrationInfo),
      mapToPayload(),
      mergeMap((data: SsoRegistrationType) =>
        this.userService
          .createUser({
            address: data.address,
            customer: {
              customerNo: uuid(),
              companyName: data.companyInfo.companyName1,
              companyName2: data.companyInfo.companyName2,
              isBusinessCustomer: this.featureToggleService.enabled('businessCustomerRegistration'),
              taxationID: data.companyInfo.taxationID,
            },
            userId: data.userId,
          })
          .pipe(
            concatMap(createUserResponse => [
              registerSuccess,
              ...(data.subscribedToNewsletter
                ? [
                    userNewsletterActions.updateUserNewsletterSubscription({
                      subscriptionStatus: true,
                      userEmail: createUserResponse.user.email,
                    }),
                  ]
                : []),
            ]),
            mapErrorToAction(registerFailure)
          )
      )
    )
  );
}
