import { Component } from '@angular/core';

@Component({
  selector: 'ish-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})
export class ProductCompareStatusComponent {

  get productCompareCount(): number {
    // TODO: get from store
    return 0;
  }
}
