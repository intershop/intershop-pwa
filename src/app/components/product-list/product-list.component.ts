import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { ProductListService } from '../../services/products/products.service';
import { ProductTileModel } from '../product-tile/product-tile.model';


@Component({
  selector: 'is-product-list',
  templateUrl: './product-list.component.html',
})

export class ProductListComponent implements OnInit {
  @Input() isListView;
  @Input() sortBy;
  @Output() totalItems: EventEmitter<number> = new EventEmitter();
  thumbnailKey = 'thumbnailKey';
  AllCategories: 'AllCategories';
  allData: any;
  thumbnails: ProductTileModel[];
  filteredData;

  /**
   * Construcotr
   * @param  {ActivatedRoute} activatedRoute
   * @param  {ProductListService} privateproductListService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private productListService: ProductListService) {
  }

  /*
  * Gets the data from Cache and shows products
   */
  ngOnInit() {

    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const productListUrl = `categories/${urlSegment.map(x => x.path).join('/')}/products`;
      this.productListService.getProductList(productListUrl).subscribe((data: any) => {
        this.thumbnails = data;
        this.totalItems.emit(this.thumbnails.length);
      });
    });
  }
}
