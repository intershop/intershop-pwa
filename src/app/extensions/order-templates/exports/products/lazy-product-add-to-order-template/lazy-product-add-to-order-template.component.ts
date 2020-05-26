import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-lazy-product-add-to-order-template',
  templateUrl: './lazy-product-add-to-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyProductAddToOrderTemplateComponent {
  @Input() product: Product;
  @Input() displayType?: string;
  @Input() quantity: number;
  @Input() class?: string;
  componentLocation = {
    moduleId: 'ish-extensions-order-templates',
    selector: 'ish-product-add-to-order-template',
  };
}
