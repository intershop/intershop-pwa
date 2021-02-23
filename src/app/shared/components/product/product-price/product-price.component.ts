import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductPriceComponent implements OnInit {
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;

  visible$: Observable<boolean>;
  isPriceRange$: Observable<boolean>;
  data$: Observable<
    {
      isListPriceGreaterThanSalePrice: boolean;
      isListPriceLessThanSalePrice: boolean;
      priceSavings: Price;
      lowerPrice: Price;
      upperPrice: Price;
    } & Pick<Product, 'salePrice' | 'listPrice'>
  >;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'price');
    this.isPriceRange$ = this.context
      .select('product')
      .pipe(map(product => ProductHelper.isMasterProduct(product) || ProductHelper.isRetailSet(product)));

    this.data$ = this.context.select('product').pipe(
      map(product => ({
        salePrice: product.salePrice,
        listPrice: product.listPrice,
        isListPriceGreaterThanSalePrice: product.listPrice?.value > product.salePrice?.value,
        isListPriceLessThanSalePrice: product.listPrice?.value < product.salePrice?.value,
        priceSavings: product.listPrice && product.salePrice && PriceHelper.diff(product.listPrice, product.salePrice),
        lowerPrice:
          (ProductHelper.isMasterProduct(product) || ProductHelper.isRetailSet(product)) && product.minSalePrice,
        upperPrice: ProductHelper.isMasterProduct(product)
          ? product.maxSalePrice
          : ProductHelper.isRetailSet(product)
          ? product.summedUpSalePrice
          : undefined,
      }))
    );
  }
}
