import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render a newsletter subscription field, specific for the registration form.
 */
@Component({
  selector: 'ish-registration-newsletter-field',
  templateUrl: './registration-newsletter-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationNewsletterFieldComponent extends FieldType<FieldTypeConfig> {}
