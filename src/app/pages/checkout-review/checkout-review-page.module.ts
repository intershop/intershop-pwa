import { NgModule } from '@angular/core';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutReviewPageComponent } from './checkout-review-page.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutReviewTacFieldComponent } from './formly/checkout-review-tac-field/checkout-review-tac-field.component';

const checkoutReviewFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-checkout-review-tac-field',
      component: CheckoutReviewTacFieldComponent,
    },
  ],
};

@NgModule({
  imports: [FormlyModule.forChild(checkoutReviewFormlyConfig), SharedModule],
  declarations: [CheckoutReviewComponent, CheckoutReviewPageComponent, CheckoutReviewTacFieldComponent],
})
export class CheckoutReviewPageModule {
  static component = CheckoutReviewPageComponent;
}
