import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { NewsletterService } from 'ish-core/services/newsletter/newsletter.service';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { mapErrorToAction, mapToPayload, whenTruthy } from 'ish-core/utils/operators';

import { userNewsletterActions, userNewsletterApiActions } from './user.actions';
import { getLoggedInUser, getNewsletterSubscriptionStatus } from './user.selectors';

@Injectable()
export class UserNewsletterEffects {
  constructor(private actions$: Actions, private store: Store, private newsletterService: NewsletterService) {}

  /**
   * The newsletter-subscription-status is only loaded when the feature-toggle "newsletterSubscriptionEnabled"
   * is enabled.
   */
  loadUserNewsletterSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userNewsletterActions.loadUserNewsletterSubscription),
      withLatestFrom(
        this.store.pipe(select(getServerConfigParameter<boolean>('marketing.newsletterSubscriptionEnabled')))
      ),
      filter(([, newsletterSubscriptionEnabled]) => newsletterSubscriptionEnabled),
      switchMap(() =>
        this.store.pipe(select(getLoggedInUser)).pipe(
          whenTruthy(),
          concatMap(user =>
            this.newsletterService.getSubscription(user.email).pipe(
              map(subscriptionStatus =>
                userNewsletterApiActions.loadUserNewsletterSubscriptionSuccess({ subscribed: subscriptionStatus })
              ),
              mapErrorToAction(userNewsletterApiActions.loadUserNewsletterSubscriptionFail)
            )
          )
        )
      )
    )
  );

  /**
   * The user-email has to be provided when setting the subscription during the registration process
   * because the user is not logged in yet.
   * If no user-email is passed in, the email of the logged-in user is used.
   */
  subscribeUserToNewsletter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userNewsletterActions.updateUserNewsletterStatus),
      mapToPayload(),
      withLatestFrom(
        this.store.pipe(select(getLoggedInUser)),
        this.store.pipe(select(getNewsletterSubscriptionStatus))
      ),
      filter(([payload, user]) => !!payload.userEmail || !!user?.email),
      concatMap(([payload, user, currentNewsletterSubscriptionStatus]) =>
        this.newsletterService
          .updateNewsletterSubscriptionStatus(
            payload.subscriptionStatus,
            currentNewsletterSubscriptionStatus,
            payload.userEmail || user.email
          )
          .pipe(
            map(subscriptionStatus =>
              userNewsletterApiActions.updateUserNewsletterStatusSuccess({ subscriptionStatus })
            ),
            mapErrorToAction(userNewsletterApiActions.updateUserNewsletterStatusFail)
          )
      )
    )
  );
}
