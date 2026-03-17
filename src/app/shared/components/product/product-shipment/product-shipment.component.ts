import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

@Component({
  selector: 'ish-product-shipment',
  templateUrl: './product-shipment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe, AsyncPipe, ModalDialogLinkComponent, NgClass, ContentIncludeComponent],
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
