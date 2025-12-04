import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CheckoutProgressBarComponent } from './checkout-progress-bar/checkout-progress-bar.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  templateUrl: './checkout-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CheckoutProgressBarComponent, RouterOutlet, AsyncPipe],
})
export class CheckoutPageComponent implements OnInit {
  checkoutStep$: Observable<number>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.checkoutStep$ = this.checkoutFacade.checkoutStep$;
  }
}
