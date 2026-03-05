import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatesStoreModule } from '../../store/order-templates-store.module';

@Component({
  selector: 'ish-order-template-widget',
  templateUrl: './order-template-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    InfoBoxComponent,
    LoadingComponent,
    NgFor,
    NgIf,
    OrderTemplatesStoreModule,
    ProductAddToBasketComponent,
    ProductContextDirective,
    TranslatePipe,
    RouterLink,
  ],
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

  getParts(template: OrderTemplate): SkuQuantityType[] {
    return template?.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }));
  }
}
