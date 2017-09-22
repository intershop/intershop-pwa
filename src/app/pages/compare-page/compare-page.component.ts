import { Component } from '@angular/core';
import { ProductCompareService } from '../../services/product-compare/product-compare.service';

@Component({
  selector: 'is-compare-page',
  templateUrl: './compare-page.component.html'
})
export class ComparePageComponent {
  comparedProducts = [];
  constructor(productCompareService: ProductCompareService) {

    productCompareService.subscribe(data => {
      this.comparedProducts = data;
    });
  }
}
