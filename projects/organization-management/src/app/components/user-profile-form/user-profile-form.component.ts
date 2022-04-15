import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserProfileFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() error: HttpError;
  @Input() user: B2bUser;

  fields: FormlyFieldConfig[];
  model: Partial<B2bUser>;

  ngOnInit() {
    this.model = this.getModel(this.user);
    this.fields = this.getFields();
  }

  private getModel(user: B2bUser) {
    return this.user ? pick(user, 'title', 'firstName', 'lastName', 'active', 'phoneHome') : { active: true };
  }

  private getFields() {
    return [
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            type: '#title',
          },
          {
            type: '#firstName',
          },
          {
            type: '#lastName',
          },
        ],
      },
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          !this.user
            ? {
                key: 'email',
                type: 'ish-email-field',
                templateOptions: {
                  label: 'account.user.email.label',
                  required: true,
                },
              }
            : {},
          {
            key: 'active',
            type: 'ish-checkbox-field',
            templateOptions: {
              label: 'account.user.active.label',
            },
          },
          {
            type: '#phoneHome',
          },
        ],
      },
    ];
  }
}
