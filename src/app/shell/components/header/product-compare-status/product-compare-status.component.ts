import { Component } from '@angular/core';
import { ProductCompareService } from '../../../../core/services/product-compare/product-compare.service';

@Component({
  selector: 'ish-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})
export class ProductCompareStatusComponent {

  constructor(
    private productCompareService: ProductCompareService
  ) { }

  get productCompareCount(): number {
    return !!this.productCompareService.getValue() ? this.productCompareService.getValue().length : 0;
  }
}
