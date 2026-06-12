import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-shipment',
  templateUrl: './product-shipment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShipmentComponent implements OnInit {
  visible$: Observable<boolean>;
  readyForShipmentMin$: Observable<number>;
  readyForShipmentMax$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'shipment');
    this.readyForShipmentMin$ = this.context.select('product', 'readyForShipmentMin');
    this.readyForShipmentMax$ = this.context.select('product', 'readyForShipmentMax');
  }
}
