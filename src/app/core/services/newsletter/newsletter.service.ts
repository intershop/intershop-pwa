import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private apiService: ApiService) {}

  /**
   * returns the current newsletter subscription status
   * returns 'false' when a 404-error is thrown, which is the APIs response for "no subscription found"
   */
  getSubscription(userEmail: string): Observable<boolean> {
    return this.apiService.get(`subscriptions/${userEmail}`).pipe(
      map((params: { active: boolean }) => params.active),
      catchError(error => {
        if (error.status === 404) {
          return of(false);
        }
        return throwError(() => error);
      })
    );
  }

  // TODO: check if there is a better way to open a stream on the currentStatus instead of passing it through the effect
  updateNewsletterSubscriptionStatus(
    newStatus: boolean,
    currentStatus: boolean,
    userEmail: string
  ): Observable<boolean> {
    // only make a REST-call when the status has changed
    if (currentStatus === newStatus) {
      return of(currentStatus);
    }

    if (newStatus) {
      return this.subscribeToNewsletter(userEmail);
    } else {
      return this.unsubscribeFromNewsletter(userEmail);
    }
  }

  /**
   * always returns 'true'
   */
  private subscribeToNewsletter(userEmail: string): Observable<boolean> {
    const body = {
      name: 'Newsletter',
      type: 'Subscription',
      active: true,
      recipient: userEmail,
    };

    return this.apiService.post(`subscriptions`, body).pipe(map(() => true));
  }

  /**
   * always returns 'false'
   */
  private unsubscribeFromNewsletter(userEmail: string): Observable<boolean> {
    return this.apiService.delete(`subscriptions/${userEmail}`).pipe(map(() => false));
  }
}
