import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';

import { CompareFacade } from '../../../facades/compare.facade';
import { TranslateModule } from '@ngx-translate/core';
import { RatingExportsModule } from '../../../../rating/exports/rating-exports.module';
import { FeatureToggleModule } from '../../../../../core/feature-toggle.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductImageComponent } from '../../../../../shared/components/product/product-image/product-image.component';
import { ProductComparePagingComponent as ProductComparePagingComponent_1 } from '../product-compare-paging/product-compare-paging.component';
import { NgIf, NgFor, AsyncPipe, SlicePipe } from '@angular/common';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';

/**
 * The Product Compare List Component
 *
 * Displays a table of products to be compared with paging handled by the {@link ProductComparePagingComponent}.
 *
 * @example
 * <ish-product-compare-list [compareProducts]="compareProducts$ | async" />
 */
@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ProductComparePagingComponent_1,
    NgFor,
    ProductImageComponent,
    FontAwesomeModule,
    FeatureToggleModule,
    RatingExportsModule,
    AsyncPipe,
    SlicePipe,
    TranslateModule,
    ProductNameComponent,
    ProductAttributesComponent,
    ProductPriceComponent,
    ProductContextDirective,
    ServerHtmlDirective,
    AttributeToStringPipe,
  ],
})
export class ProductCompareListComponent implements OnInit {
  /**
   * The list of products to compare
   */
  @Input()
  set compareProducts(val: string[]) {
    this.compareProductSKUs$.next(val);
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

  constructor(
    private shoppingFacade: ShoppingFacade,
    private compareFacade: CompareFacade
  ) {}

  ngOnInit() {
    this.compareProducts$ = this.compareProductSKUs$.pipe(
      tap(skus => {
        // decrease the current page value if the current page would be empty because of removing a product from compare
        if ((this.currentPage - 1) * this.itemsPerPage >= skus.length) {
          this.currentPage = this.currentPage - 1;
        }
      }),
      switchMap(skus =>
        combineLatest(skus.map(sku => this.shoppingFacade.product$(sku, ProductCompletenessLevel.Detail)))
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
