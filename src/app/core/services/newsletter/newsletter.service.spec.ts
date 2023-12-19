import { of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { NewsletterService } from './newsletter.service';

describe('Newsletter Service', () => {
  let apiServiceMock: ApiService;
  let newsletterServiceMock: NewsletterService;

  let userEmail: string;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    newsletterServiceMock = new NewsletterService(instance(apiServiceMock));

    userEmail = 'user@test.com';
  });

  it("should subscribe user to newsletter when 'updateNewsletterSubscriptionStatus' is called with 'true'", done => {
    when(apiServiceMock.post(anything(), anything())).thenReturn(of(true));

    const currentStatus = false;
    const newStatus = true;

    newsletterServiceMock
      .updateNewsletterSubscriptionStatus(newStatus, currentStatus, userEmail)
      .subscribe(subscriptionStatus => {
        verify(apiServiceMock.post(`subscriptions`, anything())).once();
        expect(subscriptionStatus).toBeTrue();
        done();
      });
  });

  it("should unsubscribe user from the newsletter when 'updateNewsletterSubscriptionStatus' is called with 'false'", done => {
    when(apiServiceMock.delete(anything())).thenReturn(of(false));

    const currentStatus = true;
    const newStatus = false;

    newsletterServiceMock
      .updateNewsletterSubscriptionStatus(newStatus, currentStatus, userEmail)
      .subscribe(subscriptionStatus => {
        verify(apiServiceMock.delete(`subscriptions/${userEmail}`)).once();
        expect(subscriptionStatus).toBeFalse();
        done();
      });
  });

  it("should not make an API call when calling 'updateNewsletterSubscriptionStatus' and the status hasn't changed", done => {
    when(apiServiceMock.delete(anything())).thenReturn(of(false));

    const newStatus = true;
    const currentStatus = true;

    newsletterServiceMock
      .updateNewsletterSubscriptionStatus(newStatus, currentStatus, userEmail)
      .subscribe(subscriptionStatus => {
        verify(apiServiceMock.delete(`subscriptions/${userEmail}`)).never();
        expect(subscriptionStatus).toBeTrue();
        done();
      });
  });

  it("should get the users subscription-status when 'getSubscription' is called", done => {
    when(apiServiceMock.get(anything())).thenReturn(of({ active: true }));

    newsletterServiceMock.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeTrue();
      done();
    });

    when(apiServiceMock.get(anything())).thenReturn(of({ active: false }));

    newsletterServiceMock.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });

  it('should return false when "getSubscription" is called and a 404-error is thrown', done => {
    when(apiServiceMock.get(anything())).thenReturn(
      throwError(() => makeHttpError({ message: 'No subscription found', status: 404 }))
    );

    newsletterServiceMock.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });

    when(apiServiceMock.get(anything())).thenReturn(of({ active: false }));

    newsletterServiceMock.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });
});
