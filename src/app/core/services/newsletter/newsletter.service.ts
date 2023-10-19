import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private apiService: ApiService) {}

  getSubscription(userEmail: string): Observable<boolean> {
    return this.apiService.get(`subscriptions/${userEmail}`).pipe(map((params: { active: boolean }) => params.active));
  }

  subscribeToNewsletter(userEmail: string): Observable<boolean> {
    const body = {
      name: 'Newsletter',
      type: 'Subscription',
      active: true,
      recipient: userEmail,
    };

    return this.apiService.post(`subscriptions`, body).pipe(map(() => true));
  }

  unsubscribeFromNewsletter(userEmail: string): Observable<boolean> {
    return this.apiService.delete(`subscriptions/${userEmail}`).pipe(map(() => false));
  }
}
