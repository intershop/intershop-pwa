import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Contact } from 'ish-core/models/contact/contact.model';

@Component({
  selector: 'ish-contact-page',
  templateUrl: './contact-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent implements OnInit, OnDestroy {
  /**
   * Indicator for any loading state.
   */
  loading$: Observable<boolean>;
  /**
   * In 'undefined' state the contact form is displayed.
   * Once 'success' is set to true or false the confirmation page is shown.
   */
  success$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.loading$ = this.accountFacade.contactLoading$;
    this.success$ = this.accountFacade.contactSuccess$;
  }

  /** dispatch contact request */
  createRequest(contact: Contact) {
    this.accountFacade.createContact(contact);
    this.router.navigate([], { queryParams: { submitted: true } });
  }

  ngOnDestroy() {
    // reset contact page if the user routes to 'contact' again
    this.accountFacade.resetContactState();
  }
}
