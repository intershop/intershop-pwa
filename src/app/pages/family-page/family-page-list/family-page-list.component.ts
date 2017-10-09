import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ProductTileModel } from '../../../components/product-tile/product-tile.model';
import { CacheCustomService } from '../../../services/index';
import { ProductListService } from '../../../services/products';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
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
    this.activatedRoute.params.subscribe(params => {
      this.productListService.getProductList(params).subscribe((data: any) => {
        this.thumbnails = data;
        this.totalItems.emit(this.thumbnails.length);
      });
    });

  }
}
