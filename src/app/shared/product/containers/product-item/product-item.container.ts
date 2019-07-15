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
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { ProductView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { ToggleCompare, isInCompareProducts } from 'ish-core/store/shopping/compare';
import { LoadProductIfNotLoaded, getProduct, getProductVariationOptions } from 'ish-core/store/shopping/products';
import { ProductRowComponentConfiguration } from '../../components/product-row/product-row.component';
import { ProductTileComponentConfiguration } from '../../components/product-tile/product-tile.component';

declare type ProductItemContainerConfiguration = ProductTileComponentConfiguration &
  ProductRowComponentConfiguration & { displayType: 'tile' | 'row' };

export const DEFAULT_CONFIGURATION: Readonly<ProductItemContainerConfiguration> = {
  readOnly: false,
  displayName: true,
  displayDescription: true,
  displaySKU: true,
  displayInventory: true,
  displayQuantity: true,
  displayPrice: true,
  displayPromotions: true,
  displayVariations: true,
  displayShipment: false,
  displayAddToBasket: true,
  displayAddToCompare: true,
  displayAddToQuote: true,
  displayType: 'tile',
};

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
export class ProductItemContainerComponent implements OnInit, OnDestroy, OnChanges {
  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  /**
   * The Product SKU to render a product item for.
   */
  @Input() productSku: string;
  @Output() productSkuChange = new EventEmitter<string>();
  /**
   * The quantity which should be set for this. Default is minOrderQuantity.
   */
  @Input() quantity: number;
  @Output() quantityChange = new EventEmitter<number>();
  /**
   * The optional Category context.
   */
  @Input() category?: Category;
  /**
   * configuration
   */
  @Input() configuration: ProductItemContainerConfiguration = DEFAULT_CONFIGURATION;

  productForDisplay$: Observable<ProductView>;
  loading$: Observable<boolean>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  isInCompareList$: Observable<boolean>;

  private destroy$ = new Subject();
  private sku$: Observable<string>;
  private product$: Observable<ProductView>;

  constructor(private store: Store<{}>) {}

  // tslint:disable:initialize-observables-in-declaration
  ngOnInit() {
    this.sku$ = this.productSkuChange.pipe(startWith(this.productSku));
    this.product$ = this.sku$.pipe(switchMap(sku => this.store.pipe(select(getProduct, { sku }))));

    this.productForDisplay$ = this.product$.pipe(
      filter(p => ProductHelper.isReadyForDisplay(p, ProductItemContainerComponent.REQUIRED_COMPLETENESS_LEVEL))
    );
    this.loading$ = this.product$.pipe(
      map(p => !ProductHelper.isReadyForDisplay(p, ProductItemContainerComponent.REQUIRED_COMPLETENESS_LEVEL))
    );

    this.productVariationOptions$ = this.sku$.pipe(
      switchMap(sku => this.store.pipe(select(getProductVariationOptions, { sku })))
    );
    this.isInCompareList$ = this.sku$.pipe(switchMap(sku => this.store.pipe(select(isInCompareProducts(sku)))));

    // Checks if the product is already in the store and only dispatches a LoadProduct action if it is not
    this.sku$.pipe(takeUntil(this.destroy$)).subscribe(sku => {
      this.store.dispatch(
        new LoadProductIfNotLoaded({ sku, level: ProductItemContainerComponent.REQUIRED_COMPLETENESS_LEVEL })
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mergeConfiguration(changes);
  }

  private mergeConfiguration(changes: SimpleChanges) {
    if (changes.configuration && changes.configuration.firstChange) {
      const oldConfig = this.configuration || {};
      // tslint:disable-next-line:no-assignement-to-inputs
      this.configuration = { ...DEFAULT_CONFIGURATION, ...oldConfig };
    }
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
        this.productSkuChange.emit(sku);
      });
  }

  get isTile() {
    return !!this.configuration && this.configuration.displayType === 'tile';
  }

  get isRow() {
    return !this.isTile;
  }
}
