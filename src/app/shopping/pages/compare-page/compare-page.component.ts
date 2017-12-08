// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';
import { ProductCompareService } from '../../../core/services/product-compare/product-compare.service';

@Component({
  selector: 'is-compare-page',
  templateUrl: './compare-page.component.html'
})
export class ComparePageComponent implements OnInit {
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
