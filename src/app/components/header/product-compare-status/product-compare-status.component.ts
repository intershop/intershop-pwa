import { Component } from '@angular/core';
import { ProductCompareService } from '../../../services/product-compare/product-compare.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})
export class ProductCompareStatusComponent {

  constructor(public localize: LocalizeRouterService, private productCompareService: ProductCompareService) {
  }

  get productCompareCount(): number {
    return this.productCompareService.current ? this.productCompareService.current.length : 0;
  }
}
