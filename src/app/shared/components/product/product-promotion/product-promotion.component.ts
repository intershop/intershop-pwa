import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Promotion } from 'ish-core/models/promotion/promotion.model';

@Component({
  selector: 'ish-product-promotion',
  templateUrl: './product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPromotionComponent implements OnInit {
  @Input() displayType?: string;

  visible$: Observable<boolean>;
  promotions$: Observable<Promotion[]>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'promotions');
    this.promotions$ = this.context.select('promotions');
  }
}
