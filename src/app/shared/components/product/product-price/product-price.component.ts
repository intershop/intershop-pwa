import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { Observable, combineLatest, Subject, takeUntil, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Price, PriceHelper, Pricing } from 'ish-core/models/price/price.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductPriceComponent implements OnInit {
  private destroy = new Subject<void>();
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;
  @Input() showScaledPrices = true;

  visible$: Observable<boolean>;
  isPriceRange$: Observable<boolean>;
  data$: Observable<
    {
      isListPriceGreaterThanSalePrice: boolean;
      isListPriceLessThanSalePrice: boolean;
      priceSavings: Price;
      lowerPrice: Price;
      upperPrice: Price;
    } & Pricing & ProductView
  >;


  constructor(private context: ProductContextFacade, private readonly tracker: MatomoTracker) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'price');
    this.isPriceRange$ = this.context
      .select('product')
      .pipe(map(product => ProductHelper.isMasterProduct(product) || ProductHelper.isRetailSet(product)));

    this.data$ = combineLatest([this.context.select('product'), this.context.select('prices')]).pipe(
      map(([product, prices]) => ({
        ...prices,
        ...product,
        isListPriceGreaterThanSalePrice: prices.listPrice?.value > prices.salePrice?.value,
        isListPriceLessThanSalePrice: prices.listPrice?.value < prices.salePrice?.value,
        priceSavings: prices.listPrice && prices.salePrice && PriceHelper.diff(prices.listPrice, prices.salePrice),
        lowerPrice:
          (ProductHelper.isMasterProduct(product) || ProductHelper.isRetailSet(product)) && product.minSalePrice,
        upperPrice: ProductHelper.isMasterProduct(product)
          ? product.maxSalePrice
          : ProductHelper.isRetailSet(product)
          ? product.summedUpSalePrice
          : undefined,
      }))
    );
    this.data$
      .pipe(
        switchMap(async product => {
          this.tracker.setEcommerceView(product.sku, product.name, product?.defaultCategory?.name, product?.salePrice?.value);
          this.tracker.trackPageView();
        }),
        takeUntil(this.destroy)
      )
      // eslint-disable-next-line rxjs/no-ignored-subscribe
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
