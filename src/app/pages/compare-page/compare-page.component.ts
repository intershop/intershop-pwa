import { Component } from '@angular/core';
import { GlobalState } from '../../shared/services';

@Component({
  selector: 'is-compare-page',
  templateUrl: './compare-page.component.html'
})
export class ComparePageComponent {
  comparedProducts = [];
  constructor(private globalState: GlobalState) {

    globalState.subscribeCachedData('productCompareData', data => {
      this.comparedProducts = data;
    });
  }
}
