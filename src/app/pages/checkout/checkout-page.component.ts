import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { CheckoutProgressBarComponent } from './checkout-progress-bar/checkout-progress-bar.component';

@Component({
  templateUrl: './checkout-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [AsyncPipe, CheckoutProgressBarComponent, RouterOutlet],
})
export class CheckoutPageComponent implements OnInit {
  checkoutStep$: Observable<number>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.checkoutStep$ = this.checkoutFacade.checkoutStep$;
  }
}
