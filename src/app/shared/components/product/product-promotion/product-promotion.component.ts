import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

@Component({
  selector: 'ish-product-promotion',
  templateUrl: './product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, PromotionDetailsComponent, ServerHtmlDirective],
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
