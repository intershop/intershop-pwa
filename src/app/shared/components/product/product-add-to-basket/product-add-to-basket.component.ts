import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { whenFalsy } from 'ish-core/utils/operators';

/**
 * Displays an add to cart button with an icon or a text label. After clicking the button a loading animation is displayed
 *
 * @example
 * <ish-product-add-to-basket
    [class]="'btn-lg btn-block'"
    [translationKey]="isRetailSet(product) ? 'product.add_to_cart.retailset.link' : 'product.add_to_cart.link'"
  ></ish-product-add-to-basket>
 */
@Component({
  selector: 'ish-product-add-to-basket',
  templateUrl: './product-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToBasketComponent implements OnInit, OnDestroy {
  /**
   * when 'icon', the button label is an icon, otherwise it is text
   */
  @Input() displayType?: 'icon' | 'link' = 'link';
  /**
   * additional css styling
   */
  @Input() class?: string;

  basketLoading$: Observable<boolean>;
  hasQuantityError$: Observable<boolean>;
  visible$: Observable<boolean>;
  translationKey$: Observable<string>;

  constructor(private checkoutFacade: CheckoutFacade, private context: ProductContextFacade) {}

  /**
   * fires 'true' after add To Cart is clicked and basket is loading
   */
  displaySpinner$ = new BehaviorSubject(false);

  private destroy$ = new Subject();

  ngOnInit() {
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.visible$ = this.context.select('displayProperties', 'addToBasket');
    this.translationKey$ = this.context.select('product').pipe(
      map(product =>
        ProductHelper.isRetailSet(product) ? 'product.add_to_cart.retailset.link' : 'product.add_to_cart.link'
      ),
      startWith('product.add_to_cart.link')
    );

    this.basketLoading$ = this.checkoutFacade.basketLoading$;

    // update emitted to display spinning animation
    this.basketLoading$.pipe(whenFalsy(), takeUntil(this.destroy$)).subscribe(this.displaySpinner$); // false
  }

  addToBasket() {
    this.context.addToBasket();
    this.displaySpinner$.next(true);
  }

  get displayIcon(): boolean {
    return this.displayType === 'icon';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
