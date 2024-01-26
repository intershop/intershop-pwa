import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

/**
 * The Newsletter Service handles the newsletter related interaction with the 'subscriptions' REST API.
 */
@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the current newsletter subscription status of the user.
   *
   * @param userEmail    The user email.
   * @returns            The current newsletter subscription status.
   *                     Returns 'false' when a 404-error is thrown, which is the APIs response for "no subscription found".
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

  /**
   * Updates the newsletter subscription status of the user.
   * Doesn't make a REST call when newStatus and currentStatus are the same.
   *
   * @param newStatus        The new newsletter subscription status of the user.
   * @param currentStatus    The current newsletter subscription status of the user.
   * @param userEmail        The user email.
   * @returns                The new newsletter subscription status.
   *                         Returns the current status when newStatus and currentStatus are the same.
   */
  updateNewsletterSubscriptionStatus(
    newStatus: boolean,
    // TODO: check if there is a better way to open a stream on the currentStatus instead of passing it through the effect
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
    const requestBody = {
      name: 'Newsletter',
      type: 'Subscription',
      active: true,
      recipient: userEmail,
    };

    return this.apiService.post(`subscriptions`, requestBody).pipe(map(() => true));
  }

  /**
   * always returns 'false'
   */
  private unsubscribeFromNewsletter(userEmail: string): Observable<boolean> {
    return this.apiService.delete(`subscriptions/${userEmail}`).pipe(map(() => false));
  }
}
