import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Price, PriceHelper, Pricing } from 'ish-core/models/price/price.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductPriceComponent implements OnInit {
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
    } & Pricing
  >;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'price');
    this.isPriceRange$ = this.context
      .select('product')
      .pipe(map(product => ProductHelper.isMasterProduct(product) || ProductHelper.isRetailSet(product)));

    this.data$ = combineLatest([this.context.select('product'), this.context.select('prices')]).pipe(
      map(([product, prices]) => ({
        ...prices,
        isListPriceGreaterThanSalePrice: prices.listPrice?.value > prices.salePrice?.value,
        isListPriceLessThanSalePrice: prices.listPrice?.value < prices.salePrice?.value,
        priceSavings: prices.listPrice && prices.salePrice && PriceHelper.diff(prices.listPrice, prices.salePrice),
        lowerPrice:
          (ProductHelper.isMasterProduct(product) || ProductHelper.isRetailSet(product)) && prices.minSalePrice,
        upperPrice: ProductHelper.isMasterProduct(product)
          ? prices.maxSalePrice
          : ProductHelper.isRetailSet(product)
          ? prices.summedUpSalePrice
          : undefined,
      }))
    );
  }
}
