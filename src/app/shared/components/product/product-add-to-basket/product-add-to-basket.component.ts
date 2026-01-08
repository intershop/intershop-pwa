import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { IconModule } from 'ish-core/icon.module';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { whenFalsy } from 'ish-core/utils/operators';

/**
 * Displays an add to cart button with an icon or a text label. After clicking the button a loading animation is displayed
 *
 * @example
 * <ish-product-add-to-basket
    [cssClass]="'btn-lg'"
  ></ish-product-add-to-basket>
 */
@Component({
  selector: 'ish-product-add-to-basket',
  templateUrl: './product-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgIf, AsyncPipe, TranslateModule, IconModule],
})
export class ProductAddToBasketComponent implements OnInit {
  /**
   * when 'icon', the button label is an icon, otherwise it is text
   */
  @Input() displayType: 'icon' | 'link' = 'link';
  /**
   * additional css styling
   */
  @Input() cssClass: string;
  /**
   * hidden for screen readers
   */
  @Input() ariaHidden = false;

  private basketLoading$: Observable<boolean>;
  visible$: Observable<boolean>;
  translationKey$: Observable<string>;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private context: ProductContextFacade
  ) {}

  buttonDisabled$: Observable<boolean>;

  /**
   * fires 'true' after add To Cart is clicked and basket is loading
   */
  displaySpinner$ = new BehaviorSubject(false);

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.visible$ = combineLatest([
      this.context.select('displayProperties', 'addToBasket'),
      // manually connect the product context to product prices since they are required to determine the visibility of the add to basket button
      // this connection is not automatically the case if the product context is not used to display product prices too (e.g. product compare)
      // the prices itself are not directly used here but in the ProductContextDisplayPropertiesService canBeOrderedWithPrice calculation
      // start with undefined to trigger the visibility calculation for cases where there is no product context (e.g. order templates)
      this.context.select('prices').pipe(startWith(undefined)),
    ]).pipe(map(([addToBasketVisible]) => addToBasketVisible));

    this.translationKey$ = this.context.select('product').pipe(
      map(product =>
        ProductHelper.isRetailSet(product) ? 'product.add_to_cart.retailset.link' : 'product.add_to_cart.link'
      ),
      startWith('product.add_to_cart.link')
    );

    this.basketLoading$ = this.checkoutFacade.basketLoading$;

    // update emitted to display spinning animation
    this.basketLoading$.pipe(whenFalsy(), takeUntilDestroyed(this.destroyRef)).subscribe(this.displaySpinner$); // false

    const hasQuantityError$ = this.context.select('hasQuantityError');
    const hasProductError$ = this.context.select('hasProductError');
    const hasNoQuantity$ = this.context.select('quantity').pipe(map(quantity => quantity <= 0));
    const loading$ = this.displaySpinner$.pipe(startWith(false));

    // disable button when spinning, in case of an error (quick order) or during login or basket loading
    this.buttonDisabled$ = combineLatest([
      loading$,
      hasQuantityError$,
      hasProductError$,
      hasNoQuantity$,
      this.accountFacade.userLoading$,
      this.basketLoading$,
    ]).pipe(map(conditions => conditions.some(c => c)));
  }

  addToBasket() {
    this.context.addToBasket();
    this.displaySpinner$.next(true);
  }

  get displayIcon(): boolean {
    return this.displayType === 'icon';
  }
}
