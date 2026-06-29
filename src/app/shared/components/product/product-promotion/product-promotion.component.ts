import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';

@Component({
  selector: 'ish-product-promotion',
  imports: [AsyncPipe, PromotionDetailsComponent, ServerHtmlDirective],
  standalone: true,
  templateUrl: './product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionComponent implements OnInit {
  @Input() displayType: 'default' | 'simple' | 'simpleWithDetail' = 'default';

  visible$: Observable<boolean>;
  promotions$: Observable<Promotion[]>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'promotions');
    this.promotions$ = this.context.select('promotions');
  }
}
