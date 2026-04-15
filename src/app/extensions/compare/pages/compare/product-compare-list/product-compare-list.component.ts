import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, ReplaySubject, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

import { ProductRatingComponent } from '../../../../rating/shared/product-rating/product-rating.component';
import { CompareFacade } from '../../../facades/compare.facade';
import { ProductComparePagingComponent as ProductComparePagingComponent_1 } from '../product-compare-paging/product-compare-paging.component';

/**
 * The Product Compare List Component
 *
 * Displays a table of products to be compared with paging handled by the {@link ProductComparePagingComponent}.
 *
 * @example
 * <ish-product-compare-list [compareProducts]="compareProducts$ | async"></ish-product-compare-list>
 */
@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductComparePagingComponent_1,
    ProductImageComponent,
    ...FEATURE_TOGGLE_IMPORTS,
    ProductRatingComponent,
    AsyncPipe,
    SlicePipe,
    TranslatePipe,
    ProductNameComponent,
    ProductAttributesComponent,
    ProductPriceComponent,
    ProductContextDirective,
    ServerHtmlDirective,
    AttributeToStringPipe,
    ProductInventoryComponent,
    ProductIdComponent,
    ProductAddToBasketComponent,
  ],
})
export class ProductCompareListComponent implements OnInit {
  /**
   * The list of products to compare
   */
  @Input()
  set compareProducts(val: string[] | null) {
    this.compareProductSKUs$.next(val ?? []);
  }

  /**
   * The maximum number of products to be compared on one page
   */
  @Input() itemsPerPage = 3;

  private compareProductSKUs$ = new ReplaySubject<string[]>(1);
  compareProducts$: Observable<ProductView[]>;
  commonAttributeNames$: Observable<string[]>;

  currentPage = 1;

  getAttributeByAttributeName = AttributeHelper.getAttributeByAttributeName;

  getProductWithoutCommonAttributes = ProductHelper.getProductWithoutCommonAttributes;

  constructor(private shoppingFacade: ShoppingFacade, private compareFacade: CompareFacade) {}

  ngOnInit() {
    this.compareProducts$ = this.compareProductSKUs$.pipe(
      tap(skus => {
        // keep paging in a valid range when compare items are added or removed
        const maxPage = Math.max(1, Math.ceil(skus.length / this.itemsPerPage));
        if (this.currentPage > maxPage) {
          this.currentPage = maxPage;
        }
      }),
      switchMap(skus =>
        skus.length
          ? combineLatest(skus.map(sku => this.shoppingFacade.product$(sku, ProductCompletenessLevel.Detail)))
          : of<ProductView[]>([])
      )
    );
    this.commonAttributeNames$ = this.compareProducts$.pipe(map(ProductHelper.getCommonAttributeNames));
  }

  /**
   * Changes the current page and sets the according compare products to be visible.
   *
   * @param pageNumber The page number to set the current page to
   */
  changeCurrentPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  get start(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get end(): number {
    return this.currentPage * this.itemsPerPage;
  }

  /**
   * Remove the product with the given SKU from the compare list.
   *
   * @param sku The SKU of the product to remove
   */
  removeFromCompare(sku: string) {
    this.compareFacade.removeProductFromCompare(sku);
  }
}
