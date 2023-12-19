import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';
import { Observable, map, of, withLatestFrom } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Account Profile User Page Component displays a form for changing the user's profile data
 * see also: {@link AccountProfileUserPageComponent}
 */
@Component({
  selector: 'ish-account-profile-user',
  templateUrl: './account-profile-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUserComponent implements OnInit {
  @Input({ required: true }) currentUser: User;
  @Input() error: HttpError;

  @Output() updateUserProfile = new EventEmitter<User>();

  submitted = false;

  accountProfileUserForm = new FormGroup({});
  model: Partial<User>;
  fields$: Observable<FormlyFieldConfig[]>;

  constructor(private fieldLibrary: FieldLibrary, private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    // TODO: change model into stream and read form values from it instead from the form fields,
    //       also dynamically add newsletter subscription to it
    this.model = pick(this.currentUser, 'title', 'firstName', 'lastName', 'phoneHome');

    this.fields$ = of(this.fieldLibrary.getConfigurationGroup('personalInfo')).pipe(
      withLatestFrom(
        this.appFacade.serverSetting$<boolean>('marketing.newsletterSubscriptionEnabled'),
        this.accountFacade.subscribedToNewsletter$
      ),
      map(([fields, newsletterSubscriptionEnabled, subscribedToNewsletter]) =>
        newsletterSubscriptionEnabled
          ? [
              ...fields,
              {
                type: 'ish-checkbox-field',
                key: 'newsletter',
                defaultValue: subscribedToNewsletter,
                props: {
                  label: 'registration.newsletter_subscription.text',
                },
              },
            ]
          : fields
      )
    );
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.accountProfileUserForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.accountProfileUserForm);
      return;
    }

    const title = this.accountProfileUserForm.get('title').value;
    const firstName = this.accountProfileUserForm.get('firstName').value;
    const lastName = this.accountProfileUserForm.get('lastName').value;
    const phoneHome = this.accountProfileUserForm.get('phoneHome').value;

    const subscribedToNewsletter = this.accountProfileUserForm.get('newsletter').value;
    this.accountFacade.updateNewsletterSubscription(subscribedToNewsletter);

    this.updateUserProfile.emit({ ...this.currentUser, title, firstName, lastName, phoneHome });
  }

  get buttonDisabled() {
    return this.accountProfileUserForm.invalid && this.submitted;
  }
}
