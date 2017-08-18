import { Component, OnInit } from '@angular/core';
import { FilterListService } from './filter-list-service';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { DataEmitterService } from '../../services/data-emitter.service';
import { FilterListModel } from './filter-entries';

@Component({
  selector: 'is-filterlist',
  templateUrl: './filter-list.component.html',
  providers: [
    FilterListService
  ],
  styles: [`
     @media only screen and (min-width: 768px){
       #filter-accordion.filter-panel{
         display:block !important;
       }
      }
  `]
})

export class FilterListComponent implements OnInit {
  filterListData: FilterListModel;
  filterAccordion = true;
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
  constructor(private filterListService: FilterListService, private customService: CacheCustomService) {
  }

  ngOnInit() {
    if (this.customService.cacheKeyExists(this.filterkey)) {
      this.filterListData = this.customService.getCachedData(this.filterkey, true);
    } else {
      this.filterListService.getSideFilters().subscribe((data: FilterListModel) => {
        const that = this;
        if (data) {
          that.filterListData = data;
          that.filterListData.elements[0].facets.forEach(item => {
            if (item.name === 'Camcorders') {
              item['level'] = true;
            }
          })
          this.customService.storeDataToCache(this.filterListData, this.filterkey, true);
        }
      });
    }
  }
}
