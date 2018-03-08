import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductDetailComponent implements OnInit {
  @Input() product: Product;
  readonly quantityControlName = 'quantity';
  productDetailForm: FormGroup;

  ngOnInit(): void {
    this.productDetailForm = new FormGroup({});
  }
}
