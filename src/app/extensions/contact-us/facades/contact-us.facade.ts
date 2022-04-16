import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getContactUsState } from '../store/contact-us-store';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ContactUsFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  contactUsState$ = this.store.pipe(select(getContactUsState));
}
