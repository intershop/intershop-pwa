import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Contact } from 'ish-core/models/contact/contact.model';
import {
  CreateContact,
  LoadContact,
  getContactLoading,
  getContactSubjects,
  getContactSuccess,
} from 'ish-core/store/contact/contact';

@Component({
  selector: 'ish-contact-page-container',
  templateUrl: './contact-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageContainerComponent implements OnInit {
  /**
   * The list of confirmation subjects to choose from.
   */
  subjects$: Observable<string[]> = this.store.pipe(select(getContactSubjects));
  /**
   * Indicator for any loading state.
   */
  loading$ = this.store.pipe(select(getContactLoading));
  /**
   * In 'undefined' state the contact form is displayed.
   * Once 'success' is set to true or false the confirmation page is shown.
   */
  success$ = this.store.pipe(select(getContactSuccess));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadContact());
  }

  /** dispatch contact request */
  createRequest(request: { contact: Contact; captcha?: string }) {
    this.store.dispatch(new CreateContact({ contact: request.contact }));
  }
}
