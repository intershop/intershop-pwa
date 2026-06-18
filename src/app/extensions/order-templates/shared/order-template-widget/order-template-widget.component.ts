import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplateAddToCartDialogComponent } from '../order-template-add-to-cart/order-template-add-to-cart-dialog/order-template-add-to-cart-dialog.component';

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
    this.facade.loadOrderTemplates();
    this.loading$ = this.facade.orderTemplateLoading$;
    this.orderTemplates$ = this.facade.orderTemplates$.pipe(
      whenTruthy(),
      map(orderTemplates => orderTemplates.slice(0, 3))
    );
  }

  openModal(modal: OrderTemplateAddToCartDialogComponent) {
    modal.show();
  }
}
