import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

/**
 * Type that will render a newsletter subscription field, specific for the registration form.
 */
@Component({
  selector: 'ish-registration-newsletter-field',
  templateUrl: './registration-newsletter-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, ServerSettingPipe, FormlyModule, ReactiveFormsModule, TranslateModule],
})
export class RegistrationNewsletterFieldComponent extends FieldType<FieldTypeConfig> {}
