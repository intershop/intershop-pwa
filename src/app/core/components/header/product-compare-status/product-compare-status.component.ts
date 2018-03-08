import { Component, Input } from '@angular/core';

@Component({
  selector: 'ish-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})
export class ProductCompareStatusComponent {

  @Input() productCompareCount: number;
}
