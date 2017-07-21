import { Component, OnInit } from '@angular/core';
import { CategoryService } from './filterListService';
import { CacheCustomService } from '../../services/cache/cacheCustom.service';
import { DataEmitterService } from '../../services/dataEmitter.service';
import { FilterListData } from "./filterEntries";




@Component({
  selector: 'is-filterlist',
  templateUrl: './filterList.component.html',
  providers: [
    CategoryService
  ]

})

export class CategoryListComponent implements OnInit {
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
  constructor(private categoryService: CategoryService, private customService: CacheCustomService, private dataEmitterService: DataEmitterService) {
  }

  ngOnInit() {

    if (this.customService.cacheKeyExists(this.filterkey)) {
    this.filterListData = this.customService.getCachedData(this.filterkey);
    } else {
    this.categoryService.getSideFilters().subscribe(data => {
      this.filterListData = data;
      this.customService.storeDataToCache(this.filterListData, this.filterkey, true);
    });
    }
  }

  filterCategory(category) {
    this.categoryFilter = category;
    this.allFilter('category', this.categoryFilter);
  }

  filterBrand(brandsSelected) {
    if (brandsSelected.checked) {
      brandsSelected.checked = false;
    }
    if (this.brandFilter.length === 0) {
      this.brandFilter.push(brandsSelected);

    } else {
      const itemExists = this.brandFilter.filter((item) => item.id === brandsSelected.id);
      if (itemExists.length > 0) {
        this.brandFilter = this.brandFilter.filter((item) => item.id !== brandsSelected.id);
      } else {
        this.brandFilter.push(brandsSelected);
      }
    }
    this.allFilter('brand', this.brandFilter);
  }

  filterPrice(allPrices, selectedPrice) {
    if (allPrices) {
      allPrices.forEach(element => {
        element.showImage = false;
      });
      selectedPrice.showImage = true;
      this.priceFilter = selectedPrice;
      this.allFilter('price', this.priceFilter);
    } else {
      this.priceFilter = {};
      this.allFilter('price', this.priceFilter);
    }
  };

  filterColor(color, index) {
    this.selectedColor = index;
    if (this.colorFilter && this.colorFilter.name === color.name) {
      this.colorFilter = {}
      this.selectedColor = null;
    } else {
      this.colorFilter = color;
    }
    this.allFilter('color', this.colorFilter);
  }

  allFilter(name, value) {
    this.allFilters[name] = value;
    this.dataEmitterService.pushData(this.allFilters);
  }

  ChevronIconSwap(index: number) {
    console.log(index);
    // 'chevronClassFlag'+index  
  }

  pageSource(page) {

  }
}
