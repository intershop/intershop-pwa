import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
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
export class AccountProfileUserComponent implements OnInit, OnChanges {
  @Input() currentUser: User;
  @Input() titles: string[];
  @Input() countryCode: string;
  @Input() error: HttpError;

  @Output() updateUserProfile = new EventEmitter<User>();

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    // create form
    this.form = new FormGroup({
      title: new FormControl(''),
      firstName: new FormControl('', [Validators.required, SpecialValidators.noSpecialChars]),
      lastName: new FormControl('', [Validators.required, SpecialValidators.noSpecialChars]),
      phoneHome: new FormControl(''),
    });

    // initialize form values in case currentUser is available
    this.initFormValues();
  }

  ngOnChanges(c: SimpleChanges) {
    // initialize form values in case currentUser changes (current user is later than form creation)
    if (c.currentUser) {
      this.initFormValues();
    }
  }

  /**
   * fills form values with data of the logged in user
   */
  initFormValues() {
    if (this.form && this.currentUser) {
      if (this.currentUser.title) {
        this.form.get('title').setValue(this.currentUser.title ? this.currentUser.title : '');
      }
      this.form.get('firstName').setValue(this.currentUser.firstName);
      this.form.get('lastName').setValue(this.currentUser.lastName);
      this.form.get('phoneHome').setValue(this.currentUser.phoneHome);
    }
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const title = this.form.get('title').value;
    const firstName = this.form.get('firstName').value;
    const lastName = this.form.get('lastName').value;
    const phoneHome = this.form.get('phoneHome').value;

    this.updateUserProfile.emit({ ...this.currentUser, title, firstName, lastName, phoneHome });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
