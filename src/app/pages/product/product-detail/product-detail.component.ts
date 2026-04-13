import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, filter, map, skip, switchMap, take, tap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<ProductView>;
  paypalCheckoutPaymentMethod$: Observable<PaymentMethod>;
  private initialized = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.paypalCheckoutPaymentMethod$ = this.appFacade.paypalSinglePayment$().pipe(
      whenTruthy(),
      switchMap(() => this.getPaypalCheckoutPaymentMethod$())
    );

    // React to sku/quantity changes and consolidate single product basket
    combineLatest([this.context.select('sku'), this.context.select('quantity')])
      .pipe(
        skip(1), // Skip initial emission
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([sku, quantity]) => this.consolidateSingleProductBasket(sku, quantity));
  }

  setSelectedWarranty(selectedWarranty: string) {
    this.context.setSelectedWarranty(selectedWarranty);
  }

  consolidateSingleProductBasket(sku: string, quantity: number) {
    console.log('Consolidate basket with SKU:', sku, 'and quantity:', quantity);
    this.checkoutFacade.addProductToSingleProductBasket({ sku, quantity });
  }

  getPaypalCheckoutPaymentMethod$(): Observable<PaymentMethod> {
    return combineLatest([this.checkoutFacade.singleProductBasket$, this.context.select('sku')]).pipe(
      tap(([, sku]) => {
        console.log('Init?: ', this.initialized);
        if (!this.initialized) {
          this.initialized = true;
          this.checkoutFacade.addProductToSingleProductBasket({ sku, quantity: 1 });
        }
      }),
      filter(([basket]) => !!basket?.lineItems?.length),
      whenTruthy(),
      take(1),
      switchMap(() =>
        this.checkoutFacade.getSingleProductBasketEligiblePaymentMethods$.pipe(
          whenTruthy(),
          map(paymentMethods =>
            paymentMethods.find(
              method => method.capabilities?.includes('PaypalCheckout') && method.capabilities?.includes('FastCheckout')
            )
          ),
          filter((method): method is PaymentMethod => !!method),
          take(1)
        )
      )
    );
  }
}
