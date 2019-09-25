import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounce, filter, takeUntil } from 'rxjs/operators';

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
export class ContactPageContainerComponent implements OnInit, OnDestroy {
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

  private destroy$ = new Subject();

  constructor(private store: Store<{}>, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(new LoadContact());

    // reset contact page if the user routes to 'contact' again after a contact form submission
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd && !event.snapshot.queryParamMap.has('submitted')),
        debounce(() => this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(new LoadContact());
      });
  }

  /** dispatch contact request */
  createRequest(request: { contact: Contact; captcha?: string }) {
    this.store.dispatch(new CreateContact({ contact: request.contact }));
    this.router.navigate([], { queryParams: { submitted: true } });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
