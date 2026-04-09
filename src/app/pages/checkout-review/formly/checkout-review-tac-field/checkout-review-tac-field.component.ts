import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';

/**
 * Type that renders a terms and conditions field, specific for the checkout review form.
 */
@Component({
  selector: 'ish-checkout-review-tac-field',
  templateUrl: './checkout-review-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, ServerHtmlDirective, TranslatePipe, FormlyAttributes, ValidationMessageComponent],
})
export class CheckoutReviewTacFieldComponent extends FieldType<FieldTypeConfig> {}
