import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pick } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { determineSalutations, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Account Profile User Page Component displays a form for changing the user's profile data
 * see also: {@link AccountProfileUserPageContainerComponent}
 */
@Component({
  selector: 'ish-account-profile-user',
  templateUrl: './account-profile-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileUserComponent implements OnInit {
  @Input() currentUser: User;
  @Input() titles: string[];
  @Input() countryCode: string;
  @Input() error: HttpError;

  @Output() updateUserProfile = new EventEmitter<User>();

  submitted = false;

  accountProfileUserForm = new FormGroup({});
  model: Partial<User>;
  fields: FormlyFieldConfig[];

  titleOptions$: Observable<SelectOption[]>;

  constructor(private appFacade: AppFacade, private translate: TranslateService) {}

  ngOnInit() {
    // get localized option values for title select box
    this.titleOptions$ = this.appFacade.currentLocale$.pipe(
      whenTruthy(),
      map(locale =>
        determineSalutations(locale.lang?.slice(3)).map(title => ({
          value: this.translate.instant(title),
          label: title,
        }))
      )
    );

    this.model = pick(this.currentUser, 'title', 'firstName', 'lastName', 'phoneHome');

    this.fields = [
      {
        key: 'title',
        type: 'ish-select-field',
        templateOptions: {
          label: 'account.default_address.title.label',
          placeholder: 'account.option.select.text',
          options: this.titleOptions$,
        },
      },
      {
        key: 'firstName',
        type: 'ish-text-input-field',
        templateOptions: {
          required: true,
          label: 'account.update_profile.firstname.label',
        },
        validators: {
          validation: [SpecialValidators.noSpecialChars],
        },
        validation: {
          messages: {
            required: 'account.firstname.error.required',
            noSpecialChars: 'account.name.error.forbidden.chars',
          },
        },
      },
      {
        key: 'lastName',
        type: 'ish-text-input-field',
        templateOptions: {
          required: true,
          label: 'account.update_profile.lastname.label',
        },
        validators: {
          validation: [SpecialValidators.noSpecialChars],
        },
        validation: {
          messages: {
            required: 'account.lastname.error.required',
            noSpecialChars: 'account.name.error.forbidden.chars',
          },
        },
      },
      {
        key: 'phoneHome',
        type: 'ish-text-input-field',
        templateOptions: {
          label: 'account.update_profile.phone.label',
        },
      },
    ];
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

    this.updateUserProfile.emit({ ...this.currentUser, title, firstName, lastName, phoneHome });
  }

  get buttonDisabled() {
    return this.accountProfileUserForm.invalid && this.submitted;
  }
}
