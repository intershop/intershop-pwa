// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';
import { ProductCompareService } from '../../../core/services/product-compare/product-compare.service';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html'
})
export class ComparePageContainerComponent implements OnInit {
  comparedProducts = [];

  constructor(
    private productCompareService: ProductCompareService
  ) { }

  ngOnInit() {
    this.productCompareService.subscribe(data => {
      this.comparedProducts = data;
    });
  }
}
