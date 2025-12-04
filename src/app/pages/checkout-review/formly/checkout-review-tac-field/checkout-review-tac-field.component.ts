import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FormlyModule } from 'ish-shared/formly/formly.module';

/**
 * Type that renders a terms and conditions field, specific for the checkout review form.
 */
@Component({
  selector: 'ish-checkout-review-tac-field',
  templateUrl: './checkout-review-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, ServerHtmlDirective, NgIf, TranslateModule, FormlyModule],
})
export class CheckoutReviewTacFieldComponent extends FieldType<FieldTypeConfig> {}
