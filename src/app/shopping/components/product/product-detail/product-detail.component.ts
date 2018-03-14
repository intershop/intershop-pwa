import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;

  productDetailForm: FormGroup;
  readonly quantityControlName = 'quantity';

  ngOnInit(): void {
    this.productDetailForm = new FormGroup({});
    this.productDetailForm.addControl(this.quantityControlName,
      new FormControl(this.product.minOrderQuantity));
  }
}
