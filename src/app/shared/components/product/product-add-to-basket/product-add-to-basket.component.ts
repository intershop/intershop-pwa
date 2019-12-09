import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { whenFalsy } from 'ish-core/utils/operators';

/**
 * Displays an add to cart button with an icon or a text label. After clicking the button a loading animation is displayed
 *
 * @example
 * <ish-product-add-to-basket
    [product]="product"
    [class]="'btn-lg btn-block'"
    [disabled]="productDetailForm.invalid"
    [translationKey]="isRetailSet(product) ? 'product.add_to_cart.retailset.link' : 'product.add_to_cart.link'"
    (productToBasket)="addToBasket()"
  ></ish-product-add-to-basket>
 */
@Component({
  selector: 'ish-product-add-to-basket',
  templateUrl: './product-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class ProductAddToBasketComponent implements OnInit, OnDestroy {
  basketLoading$: Observable<boolean>;

  /**
   * The product that can be added to basket
   */
  @Input() product: Product;
  /**
   * When true, it specifies that the button should be disabled
   */
  @Input() disabled = false;
  /**
   * when 'icon', the button label is an icon, otherwise it is text
   */
  @Input() displayType?: string;
  /**
   * additional css styling
   */
  @Input() class?: string;
  /**
   * translationKey for the button label
   */
  @Input() translationKey = 'product.add_to_cart.link';
  /**
   * button was clicked event
   */
  @Output() productToBasket = new EventEmitter<void>();

  showAddToCart = ProductHelper.showAddToCart;

  constructor(private checkoutFacade: CheckoutFacade) {}

  // fires 'true' after add To Cart is clicked and basket is loading
  displaySpinner$ = new BehaviorSubject(false);

  private destroy$ = new Subject();

  ngOnInit() {
    this.basketLoading$ = this.checkoutFacade.basketLoading$;

    // update emitted to display spinning animation
    this.basketLoading$
      .pipe(
        whenFalsy(),
        takeUntil(this.destroy$)
      )
      .subscribe(this.displaySpinner$); // false
  }

  addToBasket() {
    this.productToBasket.emit();
    this.displaySpinner$.next(true);
  }

  get displayIcon(): boolean {
    return this.displayType === 'icon';
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
