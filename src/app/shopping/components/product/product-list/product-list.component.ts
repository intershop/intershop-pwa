// NEEDS_WORK: product listing components rework - service usage not compliant to style guide
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Product } from '../../../../models/product/product.model';
import { ProductsService } from '../../../services/products/products.service';

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
   * @param  {ProductsService} private productsService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      // TODO: REST urls do not belong into any component but into the service
      const productListUrl = `categories/${urlSegment.map(x => x.path).join('/')}/products`;
      this.productsService.getProductList(productListUrl).subscribe((data: Product[]) => {
        this.products = data;
        this.totalItems.emit(this.products.length);
      });
    });
  }
}
