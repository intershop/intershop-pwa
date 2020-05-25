import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounce, filter, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Contact } from 'ish-core/models/contact/contact.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-contact-page',
  templateUrl: './contact-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent implements OnInit, OnDestroy {
  /**
   * The list of confirmation subjects to choose from.
   */
  subjects$: Observable<string[]>;
  /**
   * Indicator for any loading state.
   */
  loading$: Observable<boolean>;
  /**
   * In 'undefined' state the contact form is displayed.
   * Once 'success' is set to true or false the confirmation page is shown.
   */
  success$: Observable<boolean>;

  user$: Observable<User>;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.subjects$ = this.accountFacade.contactSubjects$();
    this.loading$ = this.accountFacade.contactLoading$;
    this.success$ = this.accountFacade.contactSuccess$;
    this.user$ = this.accountFacade.user$;

    // reset contact page if the user routes to 'contact' again after a contact form submission
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd && !event.snapshot.queryParamMap.has('submitted')),
        debounce(() => this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.accountFacade.resetContactState();
      });
  }

  /** dispatch contact request */
  createRequest(contact: Contact) {
    this.accountFacade.createContact(contact);
    this.router.navigate([], { queryParams: { submitted: true } });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
