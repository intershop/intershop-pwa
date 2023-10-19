import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { NewsletterService } from 'ish-core/services/newsletter/newsletter.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { userNewsletterActions, userNewsletterApiActions } from './user.actions';
import { getLoggedInUser } from './user.selectors';

@Injectable()
export class UserNewsletterEffects {
  constructor(private actions$: Actions, private store: Store, private newsletterService: NewsletterService) {}

  loadUserNewsletterSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userNewsletterActions.loadUserNewsletterSubscription),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      concatMap(([, user]) =>
        this.newsletterService.getSubscription(user.email).pipe(
          map(subscriptionStatus =>
            userNewsletterApiActions.loadUserNewsletterSubscriptionSuccess({ subscribed: subscriptionStatus })
          ),
          mapErrorToAction(userNewsletterApiActions.loadUserNewsletterSubscriptionFail)
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
      ofType(userNewsletterActions.subscribeUserToNewsletter),
      mapToPayloadProperty('userEmail'),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      filter(([userEmail, user]) => !!userEmail || !!user?.email),
      concatMap(([userEmail, user]) =>
        this.newsletterService
          .subscribeToNewsletter(userEmail || user.email)
          .pipe(
            map(userNewsletterApiActions.subscribeUserToNewsletterSuccess),
            mapErrorToAction(userNewsletterApiActions.subscribeUserToNewsletterFail)
          )
      )
    )
  );

  unsubscribeUserFromNewsletter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userNewsletterActions.unsubscribeUserFromNewsletter),
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      concatMap(([, user]) =>
        this.newsletterService
          .unsubscribeFromNewsletter(user.email)
          .pipe(
            map(userNewsletterApiActions.unsubscribeUserFromNewsletterSuccess),
            mapErrorToAction(userNewsletterApiActions.unsubscribeUserFromNewsletterFail)
          )
      )
    )
  );
}
