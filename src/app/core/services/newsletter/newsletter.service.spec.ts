import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

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

  it("should subscribe user to newsletter when 'subscribeToNewsletter' is called", done => {
    when(apiServiceMock.post(anyString(), anything())).thenReturn(of(true));

    newsletterServiceMock.subscribeToNewsletter(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.post(`subscriptions`, anything())).once();
      expect(subscriptionStatus).toBeTrue();
      done();
    });
  });

  it("should get the users subscription-status when 'getSubscription' is called", done => {
    when(apiServiceMock.get(anyString())).thenReturn(of({ active: true }));

    newsletterServiceMock.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeTrue();
      done();
    });

    when(apiServiceMock.get(anyString())).thenReturn(of({ active: false }));

    newsletterServiceMock.getSubscription(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.get(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });

  it("should unsubscribe user from newsletter when 'unsubscribeFromNewsletter' is called", done => {
    when(apiServiceMock.delete(anyString())).thenReturn(of(false));

    newsletterServiceMock.unsubscribeFromNewsletter(userEmail).subscribe(subscriptionStatus => {
      verify(apiServiceMock.delete(`subscriptions/${userEmail}`)).once();
      expect(subscriptionStatus).toBeFalse();
      done();
    });
  });
});
