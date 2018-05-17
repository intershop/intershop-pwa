import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ish-checkout-progress-bar',
  templateUrl: './checkout-progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutProgressBarComponent implements OnChanges {
  @Input() step = 1;

  // display step as link
  displayStepLinks = [false, false, false, false, false, false];

  ngOnChanges() {
    // ToDo: Extend conditions for basket excelleration
    this.displayStepLinks[1] = this.step > 1 && this.step < 5;
    this.displayStepLinks[2] = this.step > 2 && this.step < 5;
    this.displayStepLinks[3] = this.step > 3 && this.step < 5;
  }
}
