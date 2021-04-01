import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-checkout-progress-bar',
  templateUrl: './checkout-progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutProgressBarComponent {
  @Input() step = 1;

  /**
   * Define the checkout steps.
   */
  checkoutSteps = [
    {
      step: 1,
      link: '/checkout/address',
      labelKey: 'checkout.progress.addresses.label',
      stepKey: 'checkout.progress.step1.text',
    },
    {
      step: 2,
      link: '/checkout/shipping',
      labelKey: 'checkout.progress.shipping.label',
      stepKey: 'checkout.progress.step2.text',
    },
    {
      step: 3,
      link: '/checkout/payment',
      labelKey: 'checkout.progress.payment.label',
      stepKey: 'checkout.progress.step3.text',
    },
    {
      step: 4,
      link: '/checkout/review',
      labelKey: 'checkout.progress.review.label',
      stepKey: 'checkout.progress.step4.text',
    },
    {
      step: 5,
      link: '/checkout/receipt',
      labelKey: 'checkout.progress.receipt.label',
      stepKey: 'checkout.progress.step5.text',
    },
  ];

  /**
   * Checks whether a checkout step should be displayed as link or not.
   * @param step  The checkout step to evaluate.
   * @returns     Returns 'true' if the step number is lover than the current step and if the current step is lower than 5.
   */
  checkoutStepLink(step: number): boolean {
    return step < this.step && this.step < 5;
  }
}
