import { Component } from '@angular/core';
import { GlobalState } from '../../../services/';

@Component({
  selector: 'is-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})

export class ProductCompareStatusComponent {
  productCompareCount: number;

  /**
   * @param  {GlobalState} privateglobalState
   */
  constructor(private globalState: GlobalState) {
    this.globalState.subscribeCachedData('productCompareData', data => {
      this.productCompareCount = data ? data.length : 0;
      this.globalState.subscribe('productCompareData', (productCompareData: string[]) => {
        this.productCompareCount = productCompareData ? productCompareData.length : 0;
      });
    });
  }
}
