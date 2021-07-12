import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutReviewPageComponent } from './spa-checkout-review-page.component';
import { SpaCheckoutReviewComponent } from './spa-checkout-review/spa-checkout-review.component';

@NgModule({
  imports: [SharedModule],
  declarations: [SpaCheckoutReviewComponent, SpaCheckoutReviewPageComponent],
  exports: [SpaCheckoutReviewPageComponent],
})
export class SpaCheckoutReviewPageModule {}
