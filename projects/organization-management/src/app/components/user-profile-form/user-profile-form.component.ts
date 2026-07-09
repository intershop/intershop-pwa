import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-profile-form',
  standalone: false,
  templateUrl: './user-profile-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserProfileFormComponent implements OnInit {
  @Input({ required: true }) form: FormGroup;
  @Input() error: HttpError;
  @Input() user: B2bUser;

  fields: FormlyFieldConfig[];
  model: Partial<B2bUser>;
  loginType: string;

  private destroyRef = inject(DestroyRef);

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.model = this.getModel(this.user);
    this.appFacade
      .serverSetting$<string>('preferences.UserCredentialPreferences.UserRegistrationLoginType')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loginType => {
        this.loginType = loginType;
        this.fields = this.getFields();
      });
  }

  private getModel(user: B2bUser) {
    return this.user ? pick(user, 'title', 'firstName', 'lastName', 'active', 'phoneHome') : { active: true };
  }

  private getFields() {
    return [
      {
        type: 'ish-fieldset-field',
        props: {
          legend: 'account.register.personal_information.heading',
        },
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
          this.loginType !== 'email'
            ? {
                key: 'login',
                type: 'ish-text-input-field',
                props: {
                  postWrappers: [{ wrapper: 'description', index: -1 }],
                  type: 'text',
                  label: 'account.register.username.label',
                  required: true,
                  customDescription: {
                    key: 'account.register.username.extrainfo.message',
                  },
                },
                validation: {
                  messages: {
                    required: 'account.login.username.error.required',
                  },
                },
              }
            : {},
          !this.user
            ? {
                key: 'email',
                type: 'ish-email-field',
                props: {
                  label: 'account.user.email.label',
                  required: true,
                },
              }
            : {},
          {
            type: '#phoneHome',
          },
          {
            key: 'active',
            type: 'ish-checkbox-field',
            props: {
              label: 'account.user.active.label',
              title: 'account.user.active.title',
            },
          },
        ],
      },
    ];
  }
}
