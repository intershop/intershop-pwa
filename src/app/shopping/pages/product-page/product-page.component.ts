import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html'
})

export class ProductPageComponent implements OnInit {

  product: Product = null;
  categoryPath: Category[] = [];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.map(data => data.product).subscribe((product: Product) => {
      this.product = product;
    });
    this.route.data.map(data => data.categoryPath).subscribe((categoryPath: Category[]) => {
      this.categoryPath = categoryPath;
    });
  }

}
