import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

/**
 * Type that will render a newsletter subscription field, specific for the registration form.
 */
@Component({
  selector: 'ish-registration-newsletter-field',
  templateUrl: './registration-newsletter-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ServerSettingPipe, FormlyAttributes, ReactiveFormsModule, TranslatePipe],
})
export class RegistrationNewsletterFieldComponent extends FieldType<FieldTypeConfig> {}
