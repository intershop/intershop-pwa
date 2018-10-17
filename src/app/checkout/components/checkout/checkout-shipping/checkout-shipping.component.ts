import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Basket } from '../../../../models/basket/basket.model';
import { HttpError } from '../../../../models/http-error/http-error.model';
import { ShippingMethod } from '../../../../models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  basket: Basket;
  @Input()
  shippingMethods: ShippingMethod[];
  @Input()
  error: HttpError;

  @Output()
  updateShippingMethod = new EventEmitter<string>();

  shippingForm: FormGroup;
  submitted = false;
  destroy$ = new Subject();

  constructor(private router: Router) {}

  ngOnInit() {
    this.shippingForm = new FormGroup({
      id: new FormControl(this.getCommonShippingMethod()),
    });

    // trigger update shipping method if selection changes
    this.shippingForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingId => this.updateShippingMethod.emit(shippingId));
  }

  private getCommonShippingMethod(): string {
    return this.basket.commonShippingMethod ? this.basket.commonShippingMethod.id : '';
  }

  /**
   * set shipping selection to the corresponding basket value (important in case of an error)
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.basket && this.shippingForm) {
      this.shippingForm.get('id').setValue(this.getCommonShippingMethod(), { emitEvent: false });
    }
  }

  /**
   * leads to next checkout page (checkout payment)
   */
  nextStep() {
    this.submitted = true;
    if (!this.nextDisabled) {
      this.router.navigate(['/checkout/payment']);
    }
  }

  get nextDisabled() {
    return !this.basket.commonShippingMethod && this.submitted;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
