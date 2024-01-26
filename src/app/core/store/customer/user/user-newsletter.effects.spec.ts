import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { NewsletterService } from 'ish-core/services/newsletter/newsletter.service';
import { getLoggedInUser, getNewsletterSubscriptionStatus } from 'ish-core/store/customer/user';

import { UserNewsletterEffects } from './user-newsletter.effects';
import { userNewsletterActions, userNewsletterApiActions } from './user.actions';

describe('User Newsletter Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserNewsletterEffects;
  let newsletterServiceMock: NewsletterService;

  const testEmail = 'test@intershop.com';

  beforeEach(() => {
    newsletterServiceMock = mock(NewsletterService);

    when(newsletterServiceMock.getSubscription(anything())).thenReturn(of(true));
    when(newsletterServiceMock.updateNewsletterSubscriptionStatus(anything(), anything(), anything())).thenReturn(
      of(true)
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: NewsletterService, useFactory: () => instance(newsletterServiceMock) },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: getLoggedInUser, value: { email: testEmail } },
            { selector: getNewsletterSubscriptionStatus, value: false },
          ],
        }),
        UserNewsletterEffects,
      ],
    });

    effects = TestBed.inject(UserNewsletterEffects);
  });

  describe('loadUserNewsletterSubscription$', () => {
    it('should call the newsletter service when LoadUserNewsletterSubscription event is called', done => {
      const action = userNewsletterActions.loadUserNewsletterSubscription();

      actions$ = of(action);

      effects.loadUserNewsletterSubscription$.subscribe(() => {
        verify(newsletterServiceMock.getSubscription(testEmail)).once();
        done();
      });
    });

    it('should map to action of type LoadUserNewsletterSubscriptionSuccess', () => {
      const action = userNewsletterActions.loadUserNewsletterSubscription();
      const completion = userNewsletterApiActions.loadUserNewsletterSubscriptionSuccess({ subscribed: true });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadUserNewsletterSubscription$).toBeObservable(expected$);
    });
  });

  describe('updateUserNewsletterSubscription$', () => {
    it('should call the newsletter service when UpdateUserNewsletterSubscription event is called', done => {
      const action = userNewsletterActions.updateUserNewsletterSubscription({
        subscriptionStatus: true,
      });

      actions$ = of(action);

      effects.updateNewsletterSubscription$.subscribe(() => {
        verify(newsletterServiceMock.updateNewsletterSubscriptionStatus(true, false, testEmail)).once();
        done();
      });
    });

    it('should use the email of the logged-in user by default when no email is provided', done => {
      const action = userNewsletterActions.updateUserNewsletterSubscription({
        subscriptionStatus: true,
        userEmail: undefined,
      });

      actions$ = of(action);

      effects.updateNewsletterSubscription$.subscribe(() => {
        verify(newsletterServiceMock.updateNewsletterSubscriptionStatus(true, false, testEmail)).once();
        done();
      });
    });

    it('should prioritize the provided email over the logged-in user email', done => {
      const newTestEmail = 'newTestMail@intershop.com';

      const action = userNewsletterActions.updateUserNewsletterSubscription({
        subscriptionStatus: true,
        userEmail: newTestEmail,
      });

      actions$ = of(action);

      effects.updateNewsletterSubscription$.subscribe(() => {
        verify(newsletterServiceMock.updateNewsletterSubscriptionStatus(true, false, newTestEmail)).once();
        done();
      });
    });

    it('should map to action of type UpdateUserNewsletterSubscriptionSuccess', () => {
      const action = userNewsletterActions.updateUserNewsletterSubscription({
        subscriptionStatus: true,
      });
      const completion = userNewsletterApiActions.updateUserNewsletterSubscriptionSuccess({ subscriptionStatus: true });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateNewsletterSubscription$).toBeObservable(expected$);
    });
  });
});
