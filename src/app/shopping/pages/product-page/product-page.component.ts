import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html'
})

export class ProductPageComponent implements OnInit {

  product: Product = null;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.map(data => data.product).subscribe((product: Product) => {
      this.product = product;
    });
  }

}
