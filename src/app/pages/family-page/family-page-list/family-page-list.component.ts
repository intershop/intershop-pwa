import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ProductListService } from '../../../services/products';
import { CacheCustomService } from '../../../services/index';
import { ProductTileModel } from '../../../components/product-tile/product-tile.model';

@Component({
  selector: 'is-family-page-list',
  templateUrl: './family-page-list.component.html',
})

export class FamilyPageListComponent implements OnInit, OnChanges {
  @Input() isListView;
  @Input() sortBy;
  @Output() totalItems: EventEmitter<number> = new EventEmitter();
  thumbnailKey = 'thumbnailKey';
  AllCategories: 'AllCategories';
  allData: any;
  thumbnails: ProductTileModel[] = [];
  filteredData;

  /**
   * Construcotr
   * @param  {ProductListService} privateproductListService
   * @param  {CacheCustomService} privatecustomService
   */
  constructor(
    private productListService: ProductListService,
    private customService: CacheCustomService) {
  }

  ngOnChanges() {
    /**
     * Sorts the Products either Ascending or Descending
     */
    this.thumbnails.sort((a, b) => {
      if (this.sortBy === 'name-asc') {
        if (a.name > b.name) {
          return 1;
        } else if (a.name === b.name) {
          return 0;
        } else {
          return -1;
        }
      } else if (this.sortBy === 'name-desc') {
        if (a.name > b.name) {
          return -1;
        } else if (a.name === b.name) {
          return 0;
        } else {
          return 1;
        }
      }
    });
  }

  /*
  * Gets the data from Cache and shows products
   */
  ngOnInit() {
    if (this.customService.cacheKeyExists(this.thumbnailKey)) {
      this.thumbnails = this.customService.getCachedData(this.thumbnailKey, true);
      this.totalItems.emit(this.thumbnails.length);
    } else {
      this.productListService.getProductList().subscribe((data: any) => {// type should be ProductTileModel[]
        this.allData = data;
        this.thumbnails.push(this.allData);
        this.totalItems.emit(this.thumbnails.length);
        this.customService.storeDataToCache(this.thumbnails, this.thumbnailKey, true);
      });
    }

  }
}
