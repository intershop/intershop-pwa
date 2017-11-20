import { Component } from '@angular/core';
import { ProductCompareService } from '../../../services/product-compare/product-compare.service';

@Component({
  selector: 'is-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})
export class ProductCompareStatusComponent {

  constructor(
    private productCompareService: ProductCompareService
  ) { }

  get productCompareCount(): number {
    return this.productCompareService.current ? this.productCompareService.current.length : 0;
  }
}
