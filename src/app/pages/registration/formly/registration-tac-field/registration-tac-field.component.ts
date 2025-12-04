import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';

/**
 * Type that will render a terms and conditions field, specific for the registration form.
 */
@Component({
  selector: 'ish-registration-tac-field',
  imports: [FormlyAttributes, ReactiveFormsModule, ServerHtmlDirective, TranslatePipe, ValidationMessageComponent],
  standalone: true,
  templateUrl: './registration-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationTacFieldComponent extends FieldType<FieldTypeConfig> {}
