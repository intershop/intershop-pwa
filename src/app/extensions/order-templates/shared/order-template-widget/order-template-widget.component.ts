import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

@Component({
  selector: 'ish-order-template-widget',
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
    this.orderTemplates$ = this.facade.orderTemplates$.pipe(
      whenTruthy(),
      map(orderTemplates => orderTemplates.slice(0, 3))
    );
  }

  getParts(tmpl: OrderTemplate): SkuQuantityType[] {
    return tmpl?.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }));
  }
}
