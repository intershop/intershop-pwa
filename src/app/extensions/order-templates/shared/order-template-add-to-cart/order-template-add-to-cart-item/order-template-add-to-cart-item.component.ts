import { ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplate, OrderTemplateItem } from '../../../models/order-template/order-template.model';

@Component({
  selector: 'ish-order-template-add-to-cart-item',
  templateUrl: './order-template-add-to-cart-item.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class OrderTemplateAddToCartItemComponent implements OnInit {
  readonly currentOrderTemplate = input<OrderTemplate>();
  readonly orderTemplateItemData = input<OrderTemplateItem>();

  checkBox = new FormControl();

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.context.connect('propagateActive', this.checkBox.valueChanges);

    this.context.hold(this.context.select('inventory').pipe(map(inventory => inventory?.inStock)), available => {
      this.checkBox.setValue(available);
      if (available) {
        this.checkBox.enable();
      } else {
        this.checkBox.disable();
      }
    });
  }
}
