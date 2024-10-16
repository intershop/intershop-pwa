import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { whenFalsy } from 'ish-core/utils/operators';

/**
 * Displays an add to cart button with an icon or a text label. After clicking the button a loading animation is displayed
 *
 * @example
 * <ish-product-add-to-basket
    [cssClass]="'btn-lg btn-block'"
  ></ish-product-add-to-basket>
 */
@Component({
  selector: 'ish-product-add-to-basket',
  templateUrl: './product-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
   * render context, e.g. 'grid' for product list grid view
   */
  @Input() renderContext: 'grid' | undefined;

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
    this.visible$ = this.context.select('displayProperties', 'addToBasket');
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

  get tabIndex(): number {
    // if shown in product list 'grid' view, the icon is not accessible using keyboard tab, otherwise it is accessible
    return this.displayType === 'icon' && this.renderContext === 'grid' ? -1 : undefined;
  }
}
