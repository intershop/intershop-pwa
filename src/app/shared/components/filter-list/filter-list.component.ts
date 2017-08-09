import { Component, OnInit } from '@angular/core';
import { FilterListService } from './filter-list-service';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { DataEmitterService } from '../../services/data-emitter.service';
import { FilterListData } from './filter-entries';

@Component({
  selector: 'is-filterlist',
  templateUrl: './filter-list.component.html',
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
