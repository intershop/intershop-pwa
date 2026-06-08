import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

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

  constructor(
    private facade: OrderTemplatesFacade,
    private shoppingFacade: ShoppingFacade,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.facade.loadOrderTemplates();
    this.loading$ = this.facade.orderTemplateLoading$;
    this.orderTemplates$ = this.facade.orderTemplates$.pipe(
      whenTruthy(),
      map(orderTemplates => orderTemplates.slice(0, 3))
    );
  }

  addToBasket(orderTemplateId: string) {
    this.facade.orderTemplates$
      .pipe(
        map(orderTemplates => {
          const template = orderTemplates.find(t => t.id === orderTemplateId);
          if (template && template.itemsCount !== template.items?.length) {
            this.facade.loadOrderTemplateDetails(orderTemplateId);
          }
          return template;
        }),
        filter(orderTemplate => orderTemplate?.itemsCount === orderTemplate.items?.length),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(orderTemplate => {
        this.shoppingFacade.addProductsToBasket(
          orderTemplate.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }))
        );
      });
  }
}
