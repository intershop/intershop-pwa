import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pick } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserProfileFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() error: HttpError;
  @Input() user?: B2bUser;

  fields: FormlyFieldConfig[];
  model: Partial<B2bUser>;

  titleOptions$: Observable<SelectOption[]>;

  constructor(private appFacade: AppFacade, private translate: TranslateService) {}

  ngOnInit() {
    // determine default language from session and available locales
    this.titleOptions$ = this.appFacade.currentLocale$.pipe(
      whenTruthy(),
      map(locale =>
        determineSalutations(locale.lang?.slice(3)).map(title => ({
          value: this.translate.instant(title),
          label: title,
        }))
      )
    );

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
              label: 'account.address.firstname.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.user.new.firstname.error.required',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
          },
          {
            key: 'lastName',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.address.lastname.label',
              required: true,
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.user.new.lastname.error.required',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
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
                validation: {
                  messages: {
                    required: 'account.update_email.email.error.notempty',
                  },
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
            key: 'phoneHome',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.profile.phone.label',
            },
          },
        ],
      },
    ];
  }
}
