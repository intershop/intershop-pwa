import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-shipment',
  templateUrl: './product-shipment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShipmentComponent implements OnChanges {
  @Input() product: Product;

  isShipmentInformationAvailable = false;

  ngOnChanges() {
    this.isShipmentInformationAvailable =
      Number.isInteger(this.product.readyForShipmentMin) && Number.isInteger(this.product.readyForShipmentMax);
  }
}
