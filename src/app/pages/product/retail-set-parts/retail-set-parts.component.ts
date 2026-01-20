import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { DirectivesModule } from 'ish-core/directives.module';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import {
  ProductItemComponent,
  ProductItemDisplayType,
} from 'ish-shared/components/product/product-item/product-item.component';

@Component({
  selector: 'ish-retail-set-parts',
  templateUrl: './retail-set-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DirectivesModule,
    AsyncPipe,
    TranslateModule,
    ProductAddToBasketComponent,
    ProductItemComponent,
  ],
})
export class RetailSetPartsComponent implements OnInit {
  @Input() displayType: ProductItemDisplayType = 'row';

  parts$: Observable<SkuQuantityType[]>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.parts$ = this.context.select('parts');
    this.visible$ = this.context.select('displayProperties', 'retailSetParts');
  }
}
