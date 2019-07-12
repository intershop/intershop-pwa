import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { ToggleCompare, isInCompareProducts } from 'ish-core/store/shopping/compare';
import { LoadProductIfNotLoaded, getProduct, getProductVariationOptions } from 'ish-core/store/shopping/products';

type DisplayType = 'tile' | 'row';

/**
 * The Product Item Container Component fetches the product data for a given product sku
 * and renders the product either as 'tile' or 'row'.
 * The 'tile' rendering is the default if no value is provided for the displayType.
 *
 * @example
 * <ish-product-item-container [productSku]="product.sku"></ish-product-item-container>
 */
@Component({
  selector: 'ish-product-item-container',
  templateUrl: './product-item.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemContainerComponent implements OnInit, OnDestroy {
  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  /**
   * The Product SKU to render a product item for.
   */
  @Input() productSku: string;
  /**
   * The Display Type of the product item, 'tile' - the default - or 'row'.
   */
  @Input() displayType?: DisplayType = 'tile';
  /**
   * The optional Category context.
   */
  @Input() category?: Category;

  /** holds the current SKU */
  private sku$ = new ReplaySubject<string>(1);

  private product$ = this.sku$.pipe(switchMap(sku => this.store.pipe(select(getProduct, { sku }))));
  /** display only completely loaded (or failed) products to prevent flickering */
  productForDisplay$ = this.product$.pipe(
    filter(p => ProductHelper.isReadyForDisplay(p, ProductItemContainerComponent.REQUIRED_COMPLETENESS_LEVEL))
  );
  /** display loading overlay while product is loading */
  loading$ = this.product$.pipe(
    map(p => !ProductHelper.isReadyForDisplay(p, ProductItemContainerComponent.REQUIRED_COMPLETENESS_LEVEL))
  );
  productVariationOptions$ = this.sku$.pipe(
    switchMap(sku => this.store.pipe(select(getProductVariationOptions, { sku })))
  );
  isInCompareList$ = this.sku$.pipe(switchMap(sku => this.store.pipe(select(isInCompareProducts(sku)))));

  private destroy$ = new Subject();

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    // Checks if the product is already in the store and only dispatches a LoadProduct action if it is not
    this.sku$.pipe(takeUntil(this.destroy$)).subscribe(sku => {
      this.store.dispatch(
        new LoadProductIfNotLoaded({ sku, level: ProductItemContainerComponent.REQUIRED_COMPLETENESS_LEVEL })
      );
    });

    this.sku$.next(this.productSku);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleCompare() {
    this.sku$.pipe(take(1)).subscribe(sku => this.store.dispatch(new ToggleCompare({ sku })));
  }

  addToBasket(quantity: number) {
    this.sku$.pipe(take(1)).subscribe(sku => this.store.dispatch(new AddProductToBasket({ sku, quantity })));
  }

  replaceVariation(selection: VariationSelection) {
    this.product$
      .pipe(
        take(1),
        filter<VariationProductView>(product => ProductHelper.isVariationProduct(product))
      )
      .subscribe(product => {
        const { sku } = ProductVariationHelper.findPossibleVariationForSelection(selection, product);
        this.sku$.next(sku);
      });
  }

  get isTile() {
    return this.displayType === 'tile';
  }

  get isRow() {
    return this.displayType === 'row';
  }
}
