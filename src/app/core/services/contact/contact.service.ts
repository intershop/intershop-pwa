import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contact } from 'ish-core/models/contact/contact.model';
import { ApiService, AvailableOptions, unpackEnvelope } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private apiService: ApiService) {}

  /**
   * Get the possible contact subjects, which the customer can select for his request
   */
  getContactSubjects(): Observable<string[]> {
    return this.apiService.get(`contact`).pipe(
      unpackEnvelope<{ type: string; subject: string }>(),
      map(el => el.map(e => e.subject))
    );
  }

  /**
   * Send contact us request, when a customer want to get in contact with the shop
   */
  createContactRequest(contactData: Contact): Observable<void> {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
      captcha: pick(contactData, ['captcha', 'captchaAction']),
    };

    return this.apiService.post(`contact`, { ...contactData, captcha: undefined, captchaAction: undefined }, options);
  }
}
