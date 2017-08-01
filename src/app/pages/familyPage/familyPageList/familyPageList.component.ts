import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataEmitterService } from '../../../shared/services/dataEmitter.service';
import { ProductListService } from './productListService';
import { CacheCustomService } from '../../../shared/services/cache/cacheCustom.service';

@Component({
  selector: 'is-familypagelist',
  templateUrl: './familyPageList.component.html',
  styleUrls: ['./familyPageList.component.css']
})

export class FamilyPageListComponent implements OnInit, OnChanges {
  @Input() isListView;
  @Input() sortBy;
  thumbnailKey = 'thumbnailKey';
  AllCategories: 'AllCategories';
  allData: any;
  thumbnails = [];
  filteredData;


  /**
   * Construcotr
   * @param  {DataEmitterService} private_dataEmitterService
   * @param  {ProductListService} privateproductListService
   * @param  {CacheCustomService} privatecustomService
   */
  constructor(
    private _dataEmitterService: DataEmitterService,
    private productListService: ProductListService,
    private customService: CacheCustomService) {
  };


  ngOnChanges() {
    /**
     * Sorts the Products either Ascending or Descending
     */
    this.thumbnails.sort((a, b) => {
      if (this.sortBy === 'name-asc') {
        if (a.Brand > b.Brand) {
          return 1
        } else if (a.Brand === b.Brand) {
          return 0
        } else {
          return -1
        }
      } else if (this.sortBy === 'name-desc') {
        if (a.Brand > b.Brand) {
          return -1
        } else if (a.Brand === b.Brand) {
          return 0
        } else {
          return 1
        }
      }
    })
  };

  /*
  * Gets the data from Cache and shows products
   */
  ngOnInit() {
    if (this.customService.cacheKeyExists(this.thumbnailKey)) {
      this.allData = this.customService.getCachedData(this.thumbnailKey, true);
    } else {
      this.productListService.getProductList().subscribe(data => {
        this.allData = data;
        this.customService.storeDataToCache(data, this.thumbnailKey, true);
      });
    };
    this.thumbnails = this.allData[0]['Cameras'];
  };

  /**
   * Adds Product to Cart
   * @param  {} itemToAdd
   */
  addToCart(itemToAdd) {
    this._dataEmitterService.addToCart(itemToAdd);
  };
};
