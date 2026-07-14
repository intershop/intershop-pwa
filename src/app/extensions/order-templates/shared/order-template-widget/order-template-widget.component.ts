import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

const MAX_DISPLAYED_ORDER_TEMPLATES = 3;

@Component({
  selector: 'ish-order-template-widget',
  standalone: false,
  templateUrl: './order-template-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class OrderTemplateWidgetComponent implements OnInit {
  loading$: Observable<boolean>;
  orderTemplates$: Observable<OrderTemplate[]>;

  constructor(private facade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.loading$ = this.facade.orderTemplateLoading$;
    this.orderTemplates$ = this.facade.orderTemplatesWithDetails$(MAX_DISPLAYED_ORDER_TEMPLATES);
  }

  getParts(orderTemplate: OrderTemplate): SkuQuantityType[] {
    return orderTemplate.items?.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value })) ?? [];
  }
}
