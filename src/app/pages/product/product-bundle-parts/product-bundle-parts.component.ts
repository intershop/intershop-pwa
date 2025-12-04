import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';

@Component({
  selector: 'ish-product-bundle-parts',
  templateUrl: './product-bundle-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    TranslateModule,
    ProductAddToBasketComponent,
    ProductItemComponent,
    ProductContextDirective,
  ],
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
