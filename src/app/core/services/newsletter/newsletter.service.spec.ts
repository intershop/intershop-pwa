import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { getNewsletterSubscriptionStatus } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { NewsletterService } from './newsletter.service';

describe('Newsletter Service', () => {
  let newsletterService: NewsletterService;
  let apiServiceMock: ApiService;
  let store$: MockStore;

  let userEmail: string;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }, provideMockStore()],
    });
    newsletterService = TestBed.inject(NewsletterService);
    store$ = TestBed.inject(MockStore);

    userEmail = 'user@test.com';

    store$.overrideSelector(getNewsletterSubscriptionStatus, false);
  });

  it("should subscribe user to newsletter when 'updateNewsletterSubscriptionStatus' is called with 'true'", done => {
    when(apiServiceMock.post(anything(), anything())).thenReturn(of(true));

    const newStatus = true;

    newsletterService.updateNewsletterSubscriptionStatus(newStatus, userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.post(`subscriptions`, anything())).once();
      expect(subscriptionStatus).toBeTrue();
      done();
    });
  });

  it("should unsubscribe user from the newsletter when 'updateNewsletterSubscriptionStatus' is called with 'false'", done => {
    when(apiServiceMock.delete(anything())).thenReturn(of(false));
    store$.overrideSelector(getNewsletterSubscriptionStatus, true);

    const newStatus = false;

    newsletterService.updateNewsletterSubscriptionStatus(newStatus, userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.delete(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });

  it("should not make an API call when calling 'updateNewsletterSubscriptionStatus' and the status hasn't changed", done => {
    when(apiServiceMock.delete(anything())).thenReturn(of(false));
    store$.overrideSelector(getNewsletterSubscriptionStatus, true);

    const newStatus = true;

    newsletterService.updateNewsletterSubscriptionStatus(newStatus, userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.delete(`subscriptions/${userEmail}`)).never();
      expect(subscriptionStatus).toBeTrue();
      done();
    });
  });

  it("should get the users subscription-status when 'getSubscription' is called", done => {
    when(apiServiceMock.get(anything())).thenReturn(of({ active: true }));

    newsletterService.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeTrue();
      done();
    });

    when(apiServiceMock.get(anything())).thenReturn(of({ active: false }));

    newsletterService.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });

  it('should return false when "getSubscription" is called and a 404-error is thrown', done => {
    when(apiServiceMock.get(anything())).thenReturn(
      throwError(() => makeHttpError({ message: 'No subscription found', status: 404 }))
    );

    newsletterService.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });

    when(apiServiceMock.get(anything())).thenReturn(of({ active: false }));

    newsletterService.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });
});
