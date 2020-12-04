import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

@Component({
  templateUrl: './spa-checkout-single-page.component.html',
  styleUrls: ['./spa-checkout-single-page-component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SpaCheckoutSinglePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  stepsOrder = ['address', 'shipping-payment', 'review', 'receipt'];
  currentStep: string;
  steps = [];
  totalAmount: Price | PriceItem;

  constructor(private checkoutFacade: CheckoutFacade, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.checkoutFacade.basket$.pipe(takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.totalAmount = basket && basket.totals && basket.totals.itemTotal;
    });
    this.currentStep = this.route.snapshot.firstChild.url.join('');
    this.updateSteps();
  }

  completeSteps(step: string): boolean {
    return this.steps.includes(step);
  }

  updateSteps() {
    if (this.currentStep === 'receipt') {
      this.steps = [];
      return;
    }
    const arr = [];
    for (let i = 0; i < 3; i++) {
      if (this.currentStep === this.stepsOrder[i]) {
        break;
      }
      arr.push(this.stepsOrder[i]);
    }
    this.steps = arr;
  }

  jumpTo(step: string): void {
    if (this.completeSteps(step)) {
      this.router.navigate([`/checkout-spa/${step}`]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
