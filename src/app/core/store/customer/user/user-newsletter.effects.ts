import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, take } from 'rxjs/operators';

import { NewsletterService } from 'ish-core/services/newsletter/newsletter.service';
import { mapErrorToAction, mapToPayload, whenTruthy } from 'ish-core/utils/operators';

import { userNewsletterActions, userNewsletterApiActions } from './user.actions';
import { getLoggedInUser, getNewsletterSubscriptionStatus } from './user.selectors';

@Injectable()
export class UserNewsletterEffects {
  constructor(private actions$: Actions, private store: Store, private newsletterService: NewsletterService) {}

  /**
   * The effect has to wait for the getLoggedInUser-selector because it is used in a page-guard that is called before
   * the user is ready in the store
   */
  loadUserNewsletterSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userNewsletterActions.loadUserNewsletterSubscription),
      concatMap(() =>
        this.store.pipe(
          select(getLoggedInUser),
          whenTruthy(),
          take(1),
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
  updateNewsletterSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userNewsletterActions.updateUserNewsletterSubscription),
      mapToPayload(),
      concatLatestFrom(() => [
        this.store.pipe(select(getLoggedInUser)),
        this.store.pipe(select(getNewsletterSubscriptionStatus)),
      ]),
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
              userNewsletterApiActions.updateUserNewsletterSubscriptionSuccess({ subscriptionStatus })
            ),
            mapErrorToAction(userNewsletterApiActions.updateUserNewsletterSubscriptionFail)
          )
      )
    )
  );
}
