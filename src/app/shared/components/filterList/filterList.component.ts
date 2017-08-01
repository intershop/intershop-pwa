import { Component, OnInit } from '@angular/core';
import { FilterListService } from './filterListService';
import { CacheCustomService } from '../../services/cache/cacheCustom.service';
import { DataEmitterService } from '../../services/dataEmitter.service';
import { FilterListData } from './filterEntries';

@Component({
  selector: 'is-filterlist',
  templateUrl: './filterList.component.html',
  providers: [
    FilterListService
  ]

})

export class FilterListComponent implements OnInit {
  filterListData: FilterListData;
  brandFilter: any[] = [];
  categoryFilter;
  priceFilter;
  colorFilter;
  selectedColor;
  allFilters: any = {
    price: {},
    brand: [],
    color: {},
    category: {}
  };
  class;
  filterkey = 'filterData';
  toggleIcon = {};
  constructor(private categoryService: FilterListService, private customService: CacheCustomService) {
  }

  ngOnInit() {
    if (this.customService.cacheKeyExists(this.filterkey)) {
      this.filterListData = this.customService.getCachedData(this.filterkey, true);
    } else {
      this.categoryService.getSideFilters().subscribe(data => {
        this.filterListData = data;
        this.customService.storeDataToCache(this.filterListData, this.filterkey, true);
      });
    }
  }
}
