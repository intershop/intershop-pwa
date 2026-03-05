import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';

/**
 * Type that will render a terms and conditions field, specific for the registration form.
 */
@Component({
  selector: 'ish-registration-tac-field',
  templateUrl: './registration-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ValidationMessageComponent, ServerHtmlDirective, TranslatePipe, NgIf, ReactiveFormsModule, FormlyModule],
})
export class RegistrationTacFieldComponent extends FieldType<FieldTypeConfig> {}
