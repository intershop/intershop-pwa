import { Component, OnInit } from '@angular/core';
import { CacheCustomService } from "../../shared/services/cache/cache-custom.service";

@Component({
  selector: 'is-compare-page',
  templateUrl: './compare-page.component.html'
})
export class ComparePageComponent implements OnInit {
  cacheStoreKey: string = 'productCompareKey';
  comparedProducts = [];
  constructor(private cacheCustomService: CacheCustomService) { }

  ngOnInit() {
    const cachedComparedItems = this.cacheCustomService.getCachedData(this.cacheStoreKey);
    cachedComparedItems.forEach(element => {
      this.comparedProducts.push(element);
    });
    console.log(this.comparedProducts);
  }
}
