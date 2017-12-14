// NEEDS_WORK: product listing components rework - service usage not compliant to style guide
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Product } from '../../../../models/product.model';
import { ProductListService } from '../../../../shared/services/products/products.service';

@Component({
  selector: 'ish-product-list',
  templateUrl: './product-list.component.html',
})

export class ProductListComponent implements OnInit {
  @Input() listView;
  @Input() sortBy;
  @Output() totalItems: EventEmitter<number> = new EventEmitter();
  products: Product[];

  /**
   * Construcotr
   * @param  {ActivatedRoute} activatedRoute
   * @param  {ProductListService} privateproductListService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private productListService: ProductListService
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      // TODO: REST urls do not belong into any component but into the service
      const productListUrl = `categories/${urlSegment.map(x => x.path).join('/')}/products`;
      this.productListService.getProductList(productListUrl).subscribe((data: any) => {
        this.products = data;
        this.totalItems.emit(this.products.length);
      });
    });
  }
}
