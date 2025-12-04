import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

@Component({
  selector: 'ish-product-shipment',
  templateUrl: './product-shipment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateModule, NgIf, AsyncPipe, ModalDialogLinkComponent, NgClass, ContentIncludeComponent],
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
