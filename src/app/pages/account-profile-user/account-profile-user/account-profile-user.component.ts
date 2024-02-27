import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';
import { Observable, concatMap, map, of, withLatestFrom } from 'rxjs';

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
  @Input({ required: true }) currentUser$: Observable<User>;
  @Input() error: HttpError;

  @Output() updateUserProfile = new EventEmitter<User>();

  submitted = false;

  accountProfileUserForm = new FormGroup({});
  model$: Observable<Partial<User>>;
  fields$: Observable<FormlyFieldConfig[]>;

  constructor(private fieldLibrary: FieldLibrary, private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    // only retrieves and sets the newsletter-subscription-status in the model if the server-setting for it is enabled
    this.model$ = this.currentUser$.pipe(
      map(user => pick(user, 'title', 'firstName', 'lastName', 'phoneHome')),
      withLatestFrom(this.appFacade.serverSetting$<boolean>('marketing.newsletterSubscriptionEnabled')),
      concatMap(([userAttributes, newsletterSubscriptionEnabled]) =>
        this.accountFacade.subscribedToNewsletter$.pipe(
          map(subscribedToNewsletter =>
            newsletterSubscriptionEnabled
              ? {
                  ...userAttributes,
                  newsletter: subscribedToNewsletter,
                }
              : userAttributes
          )
        )
      )
    );

    // only displays the newsletter-subscription-field if the server-setting for the newsletter is enabled
    this.fields$ = of(this.fieldLibrary.getConfigurationGroup('personalInfo')).pipe(
      withLatestFrom(this.appFacade.serverSetting$<boolean>('marketing.newsletterSubscriptionEnabled')),
      map(([fields, newsletterSubscriptionEnabled]) =>
        newsletterSubscriptionEnabled ? [...fields, this.newsletterCheckboxField()] : fields
      )
    );
  }

  newsletterCheckboxField(): FormlyFieldConfig {
    return {
      type: 'ish-checkbox-field',
      key: 'newsletter',
      props: {
        label: 'registration.newsletter_subscription.text',
      },
    };
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submitForm(currentUser: User) {
    if (this.accountProfileUserForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.accountProfileUserForm);
      return;
    }

    if (this.accountProfileUserForm.get('newsletter')) {
      const subscribedToNewsletter = this.accountProfileUserForm.get('newsletter').value;
      this.accountFacade.updateNewsletterSubscription(subscribedToNewsletter);
    }

    this.updateUserProfile.emit({ ...currentUser, ...this.accountProfileUserForm.value });
  }

  get buttonDisabled() {
    return this.accountProfileUserForm.invalid && this.submitted;
  }
}
