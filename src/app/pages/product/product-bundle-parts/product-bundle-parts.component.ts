import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

@Component({
  selector: 'ish-product-bundle-parts',
  templateUrl: './product-bundle-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, TranslatePipe, ProductAddToBasketComponent, ProductItemComponent, ProductContextDirective],
})
export class ProductBundlePartsComponent implements OnInit {
  parts$: Observable<SkuQuantityType[]>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.parts$ = this.context.select('parts');
    this.visible$ = this.context.select('displayProperties', 'bundleParts');
  }
}
