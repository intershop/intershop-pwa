import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

@Component({
  selector: 'ish-product-bundle-display',
  templateUrl: './product-bundle-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, ProductNameComponent, ProductContextDirective],
})
export class ProductBundleDisplayComponent implements OnInit {
  parts$: Observable<SkuQuantityType[]>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.parts$ = this.context.select('parts');
    this.visible$ = this.context.select('displayProperties', 'bundleParts');
  }
}
