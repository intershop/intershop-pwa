import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { NewsletterService } from 'ish-core/services/newsletter/newsletter.service';
import { getLoggedInUser } from 'ish-core/store/customer/user';

import { UserNewsletterEffects } from './user-newsletter.effects';
import { userNewsletterActions, userNewsletterApiActions } from './user.actions';

describe('User Newsletter Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserNewsletterEffects;
  let newsletterServiceMock: NewsletterService;

  const email = 'test@intershop.com';

  beforeEach(() => {
    newsletterServiceMock = mock(NewsletterService);

    when(newsletterServiceMock.getSubscription(anything())).thenReturn(of(true));
    when(newsletterServiceMock.subscribeToNewsletter(anything())).thenReturn(of(true));
    when(newsletterServiceMock.unsubscribeFromNewsletter(anything())).thenReturn(of(false));

    TestBed.configureTestingModule({
      providers: [
        { provide: NewsletterService, useFactory: () => instance(newsletterServiceMock) },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: getLoggedInUser, value: { email } }],
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
        verify(newsletterServiceMock.getSubscription(email)).once();
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

  describe('subscribeUserToNewsletter$', () => {
    it('should call the newsletter service when SubscribeUserToNewsletter event is called', done => {
      const action = userNewsletterActions.subscribeUserToNewsletter({ userEmail: undefined });

      actions$ = of(action);

      effects.subscribeUserToNewsletter$.subscribe(() => {
        verify(newsletterServiceMock.subscribeToNewsletter(email)).once();
        done();
      });
    });

    it('should use the email of the logged-in user by default when no email is provided', done => {
      const action = userNewsletterActions.subscribeUserToNewsletter({ userEmail: undefined });

      actions$ = of(action);

      effects.subscribeUserToNewsletter$.subscribe(() => {
        verify(newsletterServiceMock.subscribeToNewsletter(email)).once();
        done();
      });
    });

    it('should use the provided email over the logged-in user email', done => {
      const newTestEmail = 'newTestMail@intershop.com';
      const action = userNewsletterActions.subscribeUserToNewsletter({ userEmail: newTestEmail });

      actions$ = of(action);

      effects.subscribeUserToNewsletter$.subscribe(() => {
        verify(newsletterServiceMock.subscribeToNewsletter(newTestEmail)).once();
        done();
      });
    });

    it('should map to action of type SubscribeUserToNewsletterSuccess', () => {
      const action = userNewsletterActions.subscribeUserToNewsletter({ userEmail: undefined });
      const completion = userNewsletterApiActions.subscribeUserToNewsletterSuccess();

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.subscribeUserToNewsletter$).toBeObservable(expected$);
    });
  });

  describe('unsubscribeUserFromNewsletter$', () => {
    it('should call the newsletter service when UnsubscribeUserFromNewsletter event is called', done => {
      const action = userNewsletterActions.unsubscribeUserFromNewsletter();

      actions$ = of(action);

      effects.unsubscribeUserFromNewsletter$.subscribe(() => {
        verify(newsletterServiceMock.unsubscribeFromNewsletter(email)).once();
        done();
      });
    });

    it('should map to action of type UnsubscribeUserFromNewsletterSuccess', () => {
      const action = userNewsletterActions.unsubscribeUserFromNewsletter();
      const completion = userNewsletterApiActions.unsubscribeUserFromNewsletterSuccess();

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.unsubscribeUserFromNewsletter$).toBeObservable(expected$);
    });
  });
});
